import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <header className="h-20 flex justify-center items-center border-b fixed top-0 w-full bg-background">
      <div className="w-full md:container md:mx-auto px-4 flex items-center justify-center">
        <Link href={"/"} className="font-gugi font-bold">
          Crowd Beats
        </Link>
        <ModeToggle className="ml-auto" />
      </div>
    </header>
  );
}
