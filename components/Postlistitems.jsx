import { Link } from "react-router"
import { format } from "timeago.js"
import Image from "./Image"

const Postlistitems = ({ post }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-8">
      {post.img?.url && <div className="md:hidden lg:block xl:w-1/3">
        <Image key={post.img.url} src={post.img.url} className="rounded-2xl object-cover w-183 lg:w-110 " />
      </div>}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to={`/${post.slug}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link className="text-lime-500 font-bold" to={`/authorsPage?author=${post.user.username}`}>{post.user.username}</Link>
          <span>on</span>
          <Link className="text-gray-700 hover:text-lime-500">{post.category}</Link>
          <span>{format(post.createdAt)}</span>
        </div>
        {post.tags && post.tags.length > 0 && (<div className="flex flex-wrap gap-2 text-sm ">

          <div className="flex flex-wrap gap-2 text-sm">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-lime-200 text-lime-800 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>)}
        <p>{post.desc}</p>
        <Link to={`/${post.slug}`} className="underline  hover:text-lime-500 text-sm">
          Read More
        </Link>
      </div>
    </div>
  )
}

export default Postlistitems