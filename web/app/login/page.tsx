"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { authClient } from "@/lib/auth-client";
import { Container } from "@/components/ui/container";
import { AuthButton } from "@/features/auth/components/auth-button";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const room = searchParams.get("rooms");

  useEffect(() => {
    const getSession = async () => {
      const { data: session } = await authClient.getSession();
      if (session) {
        if (room) {
          router.push(`/rooms/${room}`);
        } else {
          router.push(`/rooms/${session.user.id}`);
        }
      }
    };
    getSession();
  }, [room, router]);

  return (
    <Container className="h-full flex flex-col items-center justify-center px-4 text-center space-y-6 md:space-y-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
        Welcome to <span className="font-gugi text-primary">Crowd-Beats</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl max-w-xl text-secondary-foreground">
        Join the party! Vote for songs, add your favorites, and control the
        playlist live.
      </p>
      <AuthButton />
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
