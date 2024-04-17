import type { MetaFunction } from "@remix-run/node";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostFetchResponse } from "./posts";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  const fetchPosts = async (offset: number) => {
    const res = await fetch(`/posts?offset=${offset}`);
    return res.json();
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => await fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PostFetchResponse) => lastPage.nextOffset,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data ? data.pages.map((page) => page.posts).flat() : [];

  return (
    <>
      <h1 className="text-2xl">Remix infinite scroll with tanstack query.</h1>

      <div className="flex flex-col space-y-8 mt-16">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-col space-y-4 bg-gray-200 p-4">
            <h2 className="text-xl">{post.title}</h2>
            <div>{post.content}</div>
          </div>
        ))}
      </div>

      {isFetchingNextPage && <div>Loading...</div>}

      <div style={{ visibility: "hidden", height: 0 }} ref={ref}>
        <div />
      </div>
    </>
  );
}
