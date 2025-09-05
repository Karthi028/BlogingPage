import { useInfiniteQuery } from "@tanstack/react-query"
import Postlistitems from "./Postlistitems"
import axios from "axios"
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router";

const fetchPosts = async (pageParam, searchParams) => {

    const searchParamsObj = Object.fromEntries([...searchParams]);

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params: { page: pageParam, limit: 10, ...searchParamsObj }
    });
    return res.data;
}

const Postlists = () => {

    const [searchParams, setSearchParams] = useSearchParams();

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

    if (status === "loading") return 'Loading...'

    if (status === "error") return 'An error has occurred';

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