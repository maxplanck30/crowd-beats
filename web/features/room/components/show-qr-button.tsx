import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { QrCode as QrIcon } from "lucide-react";

export function ShowQrButton({ name, id }: { name: string; id: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="flex justify-center items-center gap-2 w-10 h-10 md:w-max p-1 rounded-full md:rounded font-bold text-md"
				>
					<QrIcon className="size-6" />
					<span className="hidden md:block">Show QR</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogTitle>Scan Code</DialogTitle>
				<DialogDescription>And Join the party</DialogDescription>
				<div className="w-full h-full flex justify-center items-center">
					<QRCodeSVG
						value={`${
							process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
						}/login?rooms=${id}`}
						level="H"
						marginSize={2}
						height={200}
						width={200}
						className="rounded"
						imageSettings={{
							src: "/globe.svg",
							height: 40,
							width: 40,
							excavate: true,
						}}
						title="Crowd Beats"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
