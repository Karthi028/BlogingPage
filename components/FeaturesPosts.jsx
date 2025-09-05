import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router"
import { format } from "timeago.js";
import Image from "./Image";

const fetchPost = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/?featured=true&limit=4&sort=newest/Star`)
    return response.data;
}

const FeaturesPosts = () => {

    const { slug } = useParams();
    const { isPending, error, data } = useQuery({
        queryKey: ['featuredPosts'],
        queryFn: () => fetchPost()
    })

    if (isPending) return "Loading...";
    if (error) return "Something went wrong" + error.message;
    const posts = data.posts;
    if (!posts || posts.length === 0) {
        return;
    }

    return (
        <div className="mt-6 flex flex-col lg:flex-row gap-8 relative">
            <p className="text-[10px] text-red-300 absolute top-[-20px] font-semibold">Featured Posts :</p>
            <div className="w-full lg:w-1/2 flex flex-col gap-3">

                {posts[0].img?.url && <Image key={posts[0].img.url} className="rounded-3xl object-cover" w="895" src={posts[0].img.url} alt="" />}
                <div className="flex items-center gap-4">
                    <h1 className="font-semibold lg:text-lg">01.</h1>
                    <p className="text-black font-bold lg:text-lg">{posts[0].title}</p>
                    <span className="text-gray-400">{format(posts[0].createdAt)}</span>
                </div>
                <Link className="text-4xl text-gray-200 font-semibold bungee-regular mt-[-5px]" to={posts[0].slug}>{posts[0].title}</Link>

            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                {posts[1] && <div className="lg:h-1/3 flex justify-between gap-4">
                    {posts[1].img?.url && <div className="w-1/3 aspect-video">
                        <Image key={posts[1].img.url}
                            src={posts[1].img.url}
                            className="rounded-3xl object-cover w-full h-full"
                            w="298"
                        />
                    </div>}
                    <div className="w-2/3">
                        <div className="flex items-center gap-4 text-sm lg:text-base mb-1">
                            <h1 className="font-semibold">02.</h1>
                            <p className="text-black font-bold">{posts[1].title}</p>
                            <span className="text-gray-400 text-sm">{format(posts[1].createdAt)}</span>
                        </div>
                        <Link className="text-gray-200 font-semibold bungee-regular text-xl" to={posts[1].slug}>{posts[1].title}</Link>
                    </div>
                </div>}
                {posts[2] &&<div className="lg:h-1/3 flex justify-between gap-4">
                    {posts[2].img?.url &&<div className="w-1/3 aspect-video">
                        <Image key={posts[2].img.url}
                            src={posts[2].img.url}
                            className="rounded-3xl object-cover w-full h-full"
                            w="298"
                        />
                    </div>}
                    <div className="w-2/3">
                        <div className="flex items-center gap-4 text-sm lg:text-base mb-1">
                            <h1 className="font-semibold">03.</h1>
                            <p className="text-black font-bold">{posts[2].title}</p>
                            <span className="text-gray-400 text-sm">{format(posts[2].createdAt)}</span>
                        </div>
                        <Link className="text-gray-200 font-semibold bungee-regular text-xl" to={posts[2].slug}>{posts[2].title}</Link>
                    </div>
                </div>}
                {posts[3] &&<div className="lg:h-1/3 flex justify-between gap-4">
                    {posts[3].img?.url &&<div className="w-1/3 aspect-video">
                        <Image key={posts[3].img.url}
                            src={posts[3].img.url}
                            className="rounded-3xl object-cover w-full h-full"
                            w="298"
                        />
                    </div>}
                    <div className="w-2/3">
                        <div className="flex items-center gap-4 text-sm lg:text-base mb-1">
                            <h1 className="font-semibold">03.</h1>
                            <p className="text-black font-bold">{posts[3].title}</p>
                            <span className="text-gray-400 text-sm">{format(posts[3].createdAt)}</span>
                        </div>
                        <Link className="text-gray-200 font-semibold bungee-regular text-xl" to={posts[3].slug}>{posts[3].title}</Link>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default FeaturesPosts