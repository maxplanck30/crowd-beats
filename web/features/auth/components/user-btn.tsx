"use client";

import Link from "next/link";
import { User } from "better-auth";
import { useRouter } from "next/navigation";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";
import { useThemeToggle } from "@/hooks/use-theme-toggle";

export function UserBtn({ user }: { user: User }) {
	const router = useRouter();

	const logout = async () => {
		const data = await authClient.signOut();
		if (data.error) {
			alert(data.error.message);
			return;
		}
		router.push("/");
	};

	const { toggleTheme } = useThemeToggle();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				className="border border-primary cursor-pointer"
			>
				<Avatar>
					<AvatarImage src={user.image || ""} alt={user.name} />
					<AvatarFallback className="uppercase">
						{user.name.slice(0, 2)}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 cursor-pointer" align="start">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem className="cursor-pointer">
						<Link href={"/profile"}>Profile</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						<Link href={`/rooms/${user.id}`}>My Room</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="cursor-pointer md:hidden"
					onClick={toggleTheme}
				>
					Change Theme
					<span className="sr-only">Toggle theme</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={logout} className="cursor-pointer">
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
