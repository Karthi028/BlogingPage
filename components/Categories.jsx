import { Link } from "react-router"
import Search from "./Search"

const Categories = () => {
    return (
        <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
            <div className="flex-1 flex items-center justify-between flex-wrap">
                <Link to="/posts" className="bg-lime-300 text-white rounded-full px-4 py-2">
                    All Posts
                </Link>
                <Link to="/posts?cat=Technology" className="hover:bg-lime-100 rounded-full px-4 py-2">
                    Technology
                </Link>
                <Link to="/posts?cat=Lifestyle" className="hover:bg-lime-100  rounded-full px-4 py-2">
                    Lifestyle
                </Link>
                <Link to="/posts?cat=Business" className="hover:bg-lime-100  rounded-full px-4 py-2">
                    Business
                </Link>
                <Link to="/posts?cat=Nature" className="hover:bg-lime-100  rounded-full px-4 py-2">
                    Nature
                </Link>
                <Link to="/posts?cat=Science" className="hover:bg-lime-100  rounded-full px-4 py-2">
                    Science
                </Link>
            </div>
            <span className="text-xl font-medium">|</span>
            <Search/>
        </div>
    )
}

export default Categories