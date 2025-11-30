// server
import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { cors } from "hono/cors";
import { cleanYTData, getAllSongsInRoom } from "./lib/utils.js";
import { initkafka, producer } from "./lib/kafka-config.js";
import { redis } from "./lib/redis-config.js";
const app = new Hono();

app.use(
  cors({
    origin: "*",
  })
);

app.get("/test", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/search/yt/:searchTerm", async (c) => {
  const { searchTerm } = c.req.param();
  // call youtube
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
      searchTerm
    )}&fields=items(id/videoId,snippet/title,snippet/description,snippet/channelTitle,snippet/thumbnails/high/url)&key=${
      process.env.YOUTUBE_API_KEY
    }`
  );
  if (!response.ok) {
    console.log(response)
    return c.json(
      {
        data: null,
      },
      404
    );
  }
  const data = await response.json();
  return c.json(
    {
      data: cleanYTData(data.items),
    },
    200
  );
});

// sockets code
const server = serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running: http://${info.address}:${info.port}`);
  }
);
const ioServer = new Server(server as HttpServer, {
  serveClient: false,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initkafka(ioServer);

ioServer.on("error", (err) => {
  console.log(err);
});

ioServer.on("connection", (socket) => {
  console.log(`${socket.id}: connected`);

  socket.on("join-room", async (data) => {
    console.time(`join-room-${socket.id}`);

    const { userId, roomId } = data;
    if (!userId || !roomId) {
      socket.emit("error", { message: "Missing userId or roomId" });
      console.timeEnd(`join-room-${socket.id}`);
      return;
    }
    socket.join(roomId);

    console.time(`getAllSongsInRoom-${roomId}`);
    const parsedSongs = await getAllSongsInRoom(roomId);
    console.timeEnd(`getAllSongsInRoom-${roomId}`);

    socket.emit("sync-first-queue", parsedSongs);

    socket.emit("joined-room", roomId);

    console.timeEnd(`join-room-${socket.id}`);
  });

  socket.on("add-song", async (data) => {
    console.time(`add-song-${data.id}`);

    const songIds = await redis.lrange(`room:${data.room}:queue`, 0, -1);
    console.time(`lrange-${data.room}`);
    console.timeEnd(`lrange-${data.room}`);

    for (const id of songIds) {
      console.time(`hgetall-${id}`);
      const songHash = await redis.hgetall(`song:${id}`);
      console.timeEnd(`hgetall-${id}`);

      if (songHash.videoId === data.data.videoId) {
        socket.emit("error", { message: "Song already exists in room." });
        console.timeEnd(`add-song-${data.id}`);
        return;
      }
    }

    await producer.send({
      topic: "song-events",
      messages: [
        {
          value: JSON.stringify({
            type: "add-song",
            roomId: data.room,
            song: data,
          }),
        },
      ],
    });

    console.timeEnd(`add-song-${data.id}`);
  });

  socket.on("toggle-like", async (data) => {
    console.time(`toggle-like-${data.songId}`);

    await producer.send({
      topic: "song-events",
      messages: [
        {
          value: JSON.stringify({
            type: "toggle-like",
            roomId: data.roomId,
            data,
          }),
        },
      ],
    });

    console.timeEnd(`toggle-like-${data.songId}`);
  });

  socket.on("play-song", async (data) => {
    console.time(`play-song-${data.songId}`);

    if (data.userId !== data.roomId) {
      socket.emit("error", {
        message: "Only room owner can perform this action",
      });
      console.timeEnd(`play-song-${data.songId}`);
      return;
    }

    await producer.send({
      topic: "song-events",
      messages: [
        {
          value: JSON.stringify({
            type: "play-song",
            roomId: data.roomId,
            data,
          }),
        },
      ],
    });

    console.timeEnd(`play-song-${data.songId}`);
  });
  socket.on("play-next", async (data) => {
    console.time(`play-next-${data.songId}`);

    if (data.userId !== data.roomId) {
      socket.emit("error", {
        message: "Only room owner can perform this action",
      });
      console.timeEnd(`play-next-${data.songId}`);
      return;
    }

    await producer.send({
      topic: "song-events",
      messages: [
        {
          value: JSON.stringify({
            type: "play-next",
            roomId: data.roomId,
            data,
          }),
        },
      ],
    });

    console.timeEnd(`play-next-${data.songId}`);
  });

  socket.on("clear-queue", async (data) => {
    if (data.userId !== data.roomId) {
      socket.emit("error", {
        message: "Only room owner can perform this action",
      });
      return;
    }
    await producer.send({
      topic: "song-events",
      messages: [
        {
          value: JSON.stringify({
            type: "clear-queue",
            roomId: data.roomId,
            data,
          }),
        },
      ],
    });
  });
});

// all events join-room joined-room error
