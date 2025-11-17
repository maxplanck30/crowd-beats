import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RoomsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // check auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // if user session is null redirect to login
  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
