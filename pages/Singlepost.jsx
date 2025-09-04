import { Link, useParams } from "react-router"
import PostmenuActions from "../components/PostmenuActions"
import Search from "../components/Search"
import Comments from "../components/Comments"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "timeago.js"
import Image from "../components/Image"
import Tags from "../components/Tags"
import UserSubscribe from "../components/UserSubscribe"
import SocialShare from "../components/SocialShare"

const fetchPost = async (slug) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`)
  return response.data;
}

const SinglePost = () => {

  const { slug } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug)
  })

  if (isPending) return "Loading...";
  if (error) return "Something went wrong" + error.message;
  if (!data) return "post not found";

  return (
    <div className="flex flex-col gap-8 mb-5 mt-3">

      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>
          <Tags />
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link className="text-lime-500 font-serif ">{data.user.username}</Link>
            <span>on</span>
            <Link className="text-lime-500 font-serif">{data.category}</Link>
            <span>{format(data.createAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>

        {data.img && <div className="hidden lg:block w-2/5">
          <Image src={data.img.url} w="600" className="rounded-2xl" />
        </div>}

      </div>

      <div className="flex flex-col md:flex-row gap-12 justify-between">

        <div className="lg:text-lg flex flex-col gap-6 text-justify" dangerouslySetInnerHTML={{ __html: data.content }} />

        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">

              {data.user.img && <img
                src={data.user.img}
                className="w-12 h-12 rounded-full object-cover"
                w="48"
                h="48"
              />}

              <Link className="text-lime-500 font-serif text-sm">{data.user.username}</Link>
              <UserSubscribe bloggerId={data.user._id} />
            </div>
            <p className="text-sm text-gray-500">
              {data?.user?.bio? data.user.bio :"Nor is there anyone who loves, pursues, or desires pain itself, because it is pain..."}
            </p>
            <SocialShare post={data} />
          </div>
          <PostmenuActions post={data} />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-xs">
            <Link className="underline text-gray-500" to={'/posts'}>All</Link>
            <Link className="underline text-gray-500" to="/posts?cat=Lifestyle">
              Lifestyle
            </Link>
            <Link className="underline text-gray-500" to="/posts?cat=Technology">
              Technology
            </Link>
            <Link className="underline text-gray-500" to="/posts?cat=Business">
              Business
            </Link>
            <Link className="underline text-gray-500" to="/posts?cat=Nature">
              Nature
            </Link>
            <Link className="underline text-gray-500" to="/posts?cat=Science">
              Science
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id} />
    </div>
  )
}

export default SinglePost