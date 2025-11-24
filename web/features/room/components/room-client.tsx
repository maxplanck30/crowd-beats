"use client";

import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Container } from "@/components/ui/container";
import { type User } from "better-auth";
import { AddSongButton } from "./add-song-button";
import { useSocket } from "@/hooks/use-socket";
import { SongQueue } from "./song-queue";
import { TSong } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RoomClient() {
  const [user, setUser] = useState<null | User>(null);
  const [queue, setQueue] = useState<TSong[]>([]);

  const socket = useSocket();

  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    router.replace("/rooms");
  }

  useEffect(() => {
    const getSession = async () => {
      const { data: session } = await authClient.getSession();
      if (!session) {
        return redirect(`/login/rooms=${roomId}`);
      }
      setIsAdmin(session.user.id === roomId);
      setUser(session.user);
    };
    getSession();
  }, [roomId]);

  // Join room and add event listeners after user is set and socket connected
  useEffect(() => {
    if (!user || !socket) return;

    // Emit join-room event when socket connects
    const onConnect = () => {
      socket.emit("join-room", { userId: user.id, roomId });
      console.log("Socket connected and join-room emitted");
    };
    socket.on("connect", onConnect);

    // Event listeners
    socket.on("joined-room", (data) => {
      console.log("Joined room confirmed:", data);
    });
    socket.on("new-song", (data: TSong) => {
      console.log(data);
      setQueue((prev) => [...prev, data]);
    });
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Cleanup event listeners on unmount or deps change
    return () => {
      socket.off("connect", onConnect);
      socket.off("joined-room");
      socket.off("new-song");
      socket.off("error");
    };
  }, [user, roomId, socket]);

  // handle auto rearranging queue on any change in queue
  useEffect(() => {
    const sortedQueue = [...queue].sort((a, b) => b.upvotes - a.upvotes);

    // Simple equality check: only update state if the order changed
    const isSameOrder = queue.every(
      (song, index) => song.id === sortedQueue[index].id
    );
    if (!isSameOrder) {
      setQueue(sortedQueue);
    }
  }, [queue]);

  const addSong = (data: object) => {
    if (!user) return;
    // your addSong implementation here
    // Get yt video Id
    // send a socket
    const payload = {
      id: uuid(),
      author: user.name,
      authorId: user.id,
      data,
      room: roomId,
      isPlayed: false,
      upvotes: 0,
    };
    socket.emit("add-song", payload);
  };

  return (
    <Container className="h-full w-full flex flex-col px-4 space-y-6 md:space-y-8 relative overflow-hidden max-h-[calc(100dvh-5rem)] min-h-[calc(100dvh-5rem)]">
      <AddSongButton addSong={addSong} />
      <SongQueue queue={queue} user={user!}/>
      <div>{roomId}</div>
      <div>{isAdmin ? <p>Admin</p> : <p>not admin</p>}</div>
    </Container>
  );
}
