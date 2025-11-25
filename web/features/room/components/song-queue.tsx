import { ScrollArea } from "@/components/ui/scroll-area";
import { TSong } from "@/lib/types";
import { User } from "better-auth";

export function SongQueue({ queue, user }: { queue: TSong[]; user: User }) {
  return (
    <div className="h-full w-full flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
      {queue.map((song) => {
        return (
          <div
            key={song.id}
            className="mb-4 flex items-center gap-4 hover:bg-accent hover:cursor-pointer p-2"
          >
            <img
              src={song.data.image}
              alt={song.data.title}
              className="w-30 aspect-video object-cover rounded object-center"
            />
            <div>
              <p className="font-semibold line-clamp-2">{song.data.title}</p>
              <p className="text-sm font-extralight line-clamp-1 text-gray-700 dark:text-gray-400">
                {song.data.description}
              </p>
              <p className="text-xs text-gray-600">
                {song.authorId === user.id ? "You" : song.author}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
