import { motion } from "motion/react";
export function PlayingLines() {
	return (
		<span className="flex justify-center items-center gap-0.5">
			<motion.span
				initial={{ height: 12 }}
				animate={{ height: [12, 6, 12] }}
				transition={{
					duration: 1,
					repeat: Infinity,
					repeatType: "loop",
				}}
				className="bg-red-500 w-px"
			></motion.span>

			<motion.span
				initial={{ height: 6 }}
				animate={{ height: [6, 12, 6] }}
				transition={{
					duration: 1,
					repeat: Infinity,
					repeatType: "loop",
				}}
				className="bg-red-500 w-px"
			></motion.span>

			<motion.span
				initial={{ height: 12 }}
				animate={{ height: [12, 6, 12] }}
				transition={{
					duration: 1,
					repeat: Infinity,
					repeatType: "loop",
				}}
				className="bg-red-500 w-px"
			></motion.span>
			<motion.span
				initial={{ height: 6 }}
				animate={{ height: [6, 12, 6] }}
				transition={{
					duration: 1,
					repeat: Infinity,
					repeatType: "loop",
				}}
				className="bg-red-500 w-px"
			></motion.span>
			<motion.span
				initial={{ height: 12 }}
				animate={{ height: [12, 6, 12] }}
				transition={{
					duration: 1,
					repeat: Infinity,
					repeatType: "loop",
				}}
				className="bg-red-500 w-px"
			></motion.span>
		</span>
	);
}
