export type TSong = {
  id: string;
  author: string;
  authorId: string;
  room: string;
  isPlayed: boolean;
  upvotes: number;
  data: {
    videoId: string;
    image: string;
    title: string;
    description: string;
    author: string;
  };
};
