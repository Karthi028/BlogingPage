import { Link } from "react-router"
import './Home.css';
import Categories from "../components/Categories";
import FeaturesPosts from "../components/FeaturesPosts";
import Postlists from "../components/Postlists";

const Homepage = () => {

  return (
    <div className="mt-5 flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex gap-3 items-baseline">
          <Link to={'/'}>Home</Link>
          <span className="text-gray-400 text-sm">Blogs & Articles</span>
        </div>
        <div className="md:hidden mr-3">
          <Link to={'/contentwrite'}><img src="/write.png" width={23} alt="Write" /></Link>
        </div>
      </div>
      <div className="flex items-center">
        <div className="md:w-[85%]">
          <p className="font-bold text-xl sm:text-2xl"><span className="text-lime-400 text-3xl font-extrabold">S</span>
            tart writing your own <span className="text-lime-400">story</span> today. Whether you have an idea,
            a personal journey, or an article to share,
            our platform makes it <span className="text-red-400">easy</span> to publish your thoughts and connect with readers.</p>
          <p className="text-gray-400 text-sm mt-1">Knowledge is gained only when Shared<span className="text-red-400">!!</span></p>
        </div>
        <div className="w-[15%] relative hidden md:flex justify-end">
          <Link to={'/contentwrite'}>
            {/* <img id="lightbulb" src="/bulbm.png" className="w-35 m-4 bulb-glow" alt="Blog" /> */}
            <img id="lightbulb" src="/bulbm.png" className="w-35 m-4" alt="Blog" />
            <p className="text-xs font-semibold text-gray-300 absolute bottom-5 left-7 w-40"><span className="text-lime-400">Write</span> your Story <span className="text-sm text-red-400">✐ᝰ</span></p>
          </Link>
        </div>
      </div>
      <Categories />
      <FeaturesPosts />
      <div className="">
        <h1 className="my-7 text-2xl font-bold text-lime-300"><span className="text-lime-600">Rece</span><span className="text-lime-500">nt</span><span className="text-lime-400"> Pos</span>ts</h1>
        <Postlists />
      </div>
    </div>
  )
}

export default Homepage