import { RoomClient } from "@/features/room/components/room-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RoomPage() {

  return <RoomClient />;
}
