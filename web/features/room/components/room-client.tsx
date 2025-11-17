"use client";

import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Container } from "@/components/ui/container";

export function RoomClient() {
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
    };
    getSession();
    return () => {};
  }, []);

  return (
    <Container className="h-full flex flex-col px-4  space-y-6 md:space-y-8">
      <div>{roomId}</div>
      <div>{isAdmin ? <p>Admin</p> : <p>not admin</p>}</div>
    </Container>
  );
}
