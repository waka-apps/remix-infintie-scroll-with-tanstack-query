import { LoaderFunctionArgs } from "@remix-run/node";

const LIMIT = 20;
const POSTS_COUNT = 100;

export type Post = {
  id: string;
  title: string;
  content: string;
};

export type PostFetchResponse = {
  posts: Post[];
  nextOffset: number;
  hasNextPage: boolean;
};

const data: Post[] = [...Array(POSTS_COUNT)].map((_, i) => ({
  id: "" + i,
  title: "title-" + i,
  content: `summary 00${i}:\nABCDEFGHIJKLMN\nOPQRSTUVWXYZ\n1234567890\nabcdefg\nhijklmn\nopqrstu\nvwxyz`,
}));

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get("offset")) || 0;

  try {
    const cursorIndex = data.findIndex((p) => Number(p.id) === offset);
    const skip = cursorIndex === -1 ? 0 : cursorIndex + 1;

    const posts = data.slice(skip, LIMIT + skip);
    const nextOffset = Number(posts.at(-1)?.id) || 0 + 20;
    const hasNextPage = data.length > LIMIT + skip;

    return { posts, nextOffset, hasNextPage };
  } catch (error) {
    console.error(error);
    return { posts: [], nextOffset: isNaN(offset) ? 0 : offset, hasNextPage: true };
  }
};
