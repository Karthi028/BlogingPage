import { useLocation, useNavigate, useSearchParams } from "react-router"

const Search = () => {

  const loacation = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value;
      if (location.pathname === "/posts") {
        setSearchParams({ ...Object.fromEntries(searchParams), search: query });
      } else {
        navigate(`/posts?search=${query}`);
      }
    }

  }

  return (
    <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
      <img src="/search.png" width={20} alt="" />
      <input
        type="text"
        placeholder="search a post..."
        className="bg-transparent outline-none"
        onKeyDown={handleKeyPress}
      />
    </div>
  )
}

export default Search