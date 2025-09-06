import { useInfiniteQuery } from "@tanstack/react-query"
import Postlistitems from "./Postlistitems"
import axios from "axios"
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useSearchParams } from "react-router";
import Anime from "../components/AnimeImage"
import { useUser } from "@clerk/clerk-react";

const fetchPosts = async (pageParam, searchParams) => {

    const searchParamsObj = Object.fromEntries([...searchParams]);

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params: { page: pageParam, limit: 10, ...searchParamsObj }
    });
    return res.data;
}

const Postlists = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const {user} = useUser();
    

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['posts', searchParams.toString()],
        queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined,
    })

    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
    const Author = searchParams.get("author") === user?.username;

    if (status === "loading") return <Anime />
    if (status === "error") return 'An error has occurred';

    if (allPosts.length === 0 && Author) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
                <Link to={'/contentwrite'} className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-700">
                    Create Your First Post!
                </Link>
                <p className="mt-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-700">
                    Looks like you haven't created any posts yet.
                </p>
            </div>
        );
    }

    return (
        <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4>Loading more posts...</h4>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                    <b><span className="text-lime-700">End</span><span className="text-lime-600"> of</span><span className="text-lime-500"> the</span><span className="text-lime-400"> Posts!!</span></b>
                </p>
            }

        >
            {allPosts.map((post, index) => {
                return <Postlistitems key={index} post={post} />
            })}
        </InfiniteScroll>

    )
}

export default Postlists