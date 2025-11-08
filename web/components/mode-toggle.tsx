"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle({ className = "" }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const sunVariants = {
		light: { scale: 1, rotate: 0, opacity: 1, transition: { duration: 0.3 } },
		dark: { scale: 0, rotate: 90, opacity: 0, transition: { duration: 0.3 } },
	};

	const moonVariants = {
		light: { scale: 0, rotate: -90, opacity: 0, transition: { duration: 0.3 } },
		dark: { scale: 1, rotate: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const currentTheme = theme === "dark" ? "dark" : "light";

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			aria-label="Toggle theme"
			className={cn("relative rounded-full", className)}
		>
			<motion.div
				aria-hidden="true"
				initial={false}
				animate={currentTheme}
				variants={sunVariants}
				className="absolute inset-0 flex items-center justify-center"
			>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			</motion.div>
			<motion.div
				aria-hidden="true"
				initial={false}
				animate={currentTheme}
				variants={moonVariants}
				className="absolute inset-0 flex items-center justify-center"
			>
				<Moon className="h-[1.2rem] w-[1.2rem]" />
			</motion.div>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
