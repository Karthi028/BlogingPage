import { useState } from "react"
import Postlists from "../components/Postlists"
import Sidemenu from "../components/Sidemenu"

const PostlistsPage = () => {
  const [open, setopen] = useState(false);

  return (
    <div className="">
      <h1 className="mb-5 text-2xl text-gray-500 font-semibold">Bloging is So Fun!!!</h1>
      <button className="md:hidden font-bold text-sm text-white px-4 py-2 rounded-2xl mb-4 bg-lime-400" onClick={() => setopen(prev => !prev)}>{open ? "Close" : "Filter or Search"}</button>
      <div className="flex flex-col-reverse md:flex-row gap-8">
        <div className="">
          <Postlists />
        </div>
        <div className={`${open ? "block" : 'hidden'} md:block`}>
          <Sidemenu />
        </div>
      </div>
    </div>
  )
}

export default PostlistsPage