import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router";
import NotificationBell from "../components/Notification";

const Navbar = () => {

  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="w-full h-16 sm:h-20 flex items-center justify-between">
      <Link to={'/'} className="flex items-center gap-3 text-2xl font-bold outline-none">
        <img src="/K.jpg" alt="Logo" className="w-10 h-10" />
        <span className="text-xl sm:text-2xl"><span className="text-lime-700">Le</span><span className="text-lime-600">ts</span><span className="text-lime-500">Blo</span><span className="text-lime-400">g</span></span>
      </Link>
      <div className="sm:hidden flex items-center gap-2">
        <SignedOut>
          <Link to={'/login'}>
            <button className="p-1 cursor-pointer text-lime-700 font-bold rounded-full pr-2"> <span className="text-indigo-300">L</span><span className="text-indigo-400">o</span><span className="text-indigo-500">g</span><span className="text-indigo-600">i</span><span className="text-indigo-700">n</span></button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <div ref={menuRef}>
          <button className="cursor-pointer" onClick={() => setOpen(pre => !pre)}>
            {open ? <img src="/close.png" width={13} /> : <img src="/menubar.png" width={20} />}
          </button>
          {open && <div className="w-[25%] h-45 absolute right-5 top-11 rounded text-center transition-all duration-300 ease-out 
           transform flex flex-col p-2 items-center justify-center text-gray-400 text-sm bg-white shadow" onClick={handleMenuClick}>
            <Link className="hover:text-lime-600" to={'/'}>Home</Link>
            <Link className="hover:text-lime-600" to={'/posts'}>Trending</Link>
            <Link className="hover:text-lime-600" to={'/posts?sort=popular'}>Popular</Link>
            {user?.username && <Link className="hover:text-lime-600 mb-2" to={`/authorsPage?author=${user?.username}`}>Dashboard</Link>}
            <NotificationBell />
          </div>}
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 xl:gap-12 font-semibold text-gray-400 ">
        <Link className="hover:text-lime-600" to={'/'}>Home</Link>
        <Link className="hover:text-lime-600" to={'/posts?sort=trending'}>Trending</Link>
        <Link className="hover:text-lime-600" to={'/posts?sort=popular'}>Popular</Link>
        {user?.username && <Link className="hover:text-lime-600" to={`/authorsPage?author=${user?.username}`}>Dashboard</Link>}
        <NotificationBell />
        <SignedOut>
          <Link to={'/login'}>
            <button className="p-1 cursor-pointer text-lime-700 font-bold bg-lime-100 rounded-full pl-2 pr-2">Login</button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

    </div>
  )
}

export default Navbar