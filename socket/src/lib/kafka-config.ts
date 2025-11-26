import { Kafka } from "kafkajs";
import { Server, type DefaultEventsMap } from "socket.io";
import { redis } from "./redis-config.js";

export const kafka = new Kafka({
  clientId: "app",
  brokers: ["localhost:9092"],
});
export const consumer = kafka.consumer({ groupId: "socket-group" });
export const producer = kafka.producer();

export async function initkafka(
  ioServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  await producer.connect();
  await consumer.connect();

  console.log("Kafka ready");

  await consumer.subscribe({ topic: "song-events", fromBeginning: false });
  consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value!.toString());

      switch (event.type) {
        case "add-song":
          // Save song data as hash
          await redis.hset(`song:${event.song.id}`, {
            id: event.song.id,
            author: event.song.author,
            authorId: event.song.authorId,
            room: event.song.room,
            isPlayed: event.song.isPlayed.toString(),
            upvotes: event.song.upvotes.toString(),
            upvotedBy: JSON.stringify(event.song.upvotedBy),
            videoId: event.song.data.videoId,
            image: event.song.data.image,
            title: event.song.data.title,
            description: event.song.data.description,
            songAuthor: event.song.data.author,
          });

          // Add song ID to room queue list
          await redis.rpush(`room:${event.roomId}:queue`, event.song.id);

          // Notify clients in room
          ioServer.in(event.roomId).emit("new-song", event.song);
          break;

        case "toggle-like":
          const { songId, userId, roomId } = event.data;

          const allsongs = await redis.lrange(`room:${roomId}:songs`, 0, -1);
          console.log(JSON.parse(allsongs[0]));
          break;

        case "clear-room":
          await redis.del(`room:${event.roomId}:songs`);
          ioServer.in(event.roomId).emit("clear-queue");
          break;
      }
    },
  });
}
