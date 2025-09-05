import { Outlet } from "react-router"
import Navbar from "../wrappers/Navbar"

const BlogPage = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default BlogPage 