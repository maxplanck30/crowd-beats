import { Button } from "@/components/ui/button";
import {
	ArrowRightCircle,
	PauseCircle,
	PlayCircle,
	QrCode,
	Trash2,
	TrashIcon,
} from "lucide-react";
import { ShowQrButton } from "./show-qr-button";

type TSongControlsProps = {
	currentPlayingSong: string;
	name: string;
	id: string;
	isPlaying: boolean;
	playNext: () => void;
	togglePlay: () => void;
};

export function SongControls({
	currentPlayingSong,
	name,
	id,
	isPlaying,
	playNext,
	togglePlay,
}: TSongControlsProps) {
	return (
		<div className="flex justify-center items-center gap-2 w-max h-max rounded-full md:rounded-2xl font-bold absolute bottom-0 left-10 z-20 ">
			<Button
				variant="secondary"
				className="flex justify-center items-center gap-2 w-10 h-10 md:w-max p-1 rounded-full md:rounded font-bold text-md"
				onClick={togglePlay}
			>
				{isPlaying ? (
					<PauseCircle className="size-6" />
				) : (
					<PlayCircle className="size-6" />
				)}
				<span className="hidden md:block">
					{isPlaying ? "Pause song" : "Play song"}
				</span>
			</Button>
			<Button
				variant="ghost"
				className="flex justify-center items-center gap-2 w-10 h-10 md:w-max p-1 rounded-full md:rounded font-bold text-md"
				onClick={playNext}
			>
				<ArrowRightCircle className="size-6" />
				<span className="hidden md:block">Play Next</span>
			</Button>
			<ShowQrButton name={name} id={id} />
		</div>
	);
}
