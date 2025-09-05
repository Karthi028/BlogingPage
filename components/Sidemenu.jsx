import { useSearchParams } from "react-router"
import Search from "./Search"

const Sidemenu = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev);
      newSearchParams.set("sort", e.target.value);
      return newSearchParams;
    });
  };

  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat: category,
      });
    }
  };

  return (
    <div className="px-4 sticky top-8">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />
      <h1 className="mb-4 mt-4 text-sm font-medium">Filters</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            checked={searchParams.get("sort") === "newest"}
            className="appearance-none w-4 h-4 border-[1.5px] border-lime-600 cursor-pointer rounded-sm bg-white checked:bg-lime-400"
          />
          Newest
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            checked={searchParams.get("sort") === "popular"}
            className="appearance-none w-4 h-4 border-[1.5px] border-lime-600 cursor-pointer rounded-sm bg-white checked:bg-lime-400"
          />
          Most Popular
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            checked={searchParams.get("sort") === "trending"}
            className="appearance-none w-4 h-4 border-[1.5px] border-lime-600 cursor-pointer rounded-sm bg-white checked:bg-lime-400"
          />
          Trending
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            checked={searchParams.get("sort") === "oldest"}
            className="appearance-none w-4 h-4 border-[1.5px]  border-lime-600 cursor-pointer rounded-sm bg-white checked:bg-lime-400"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div className="flex flex-col gap-2 text-xs">
        <span className="underline text-gray-500 cursor-pointer" onClick={() => handleCategoryChange("")}>All</span>
        <span className="underline text-gray-500 cursor-pointer" onClick={() => handleCategoryChange("general")}>General</span>
        <span className="underline text-gray-500 cursor-pointer" onClick={() => handleCategoryChange("Technology")}>Technology</span>
        <span className="underline text-gray-500 cursor-pointer" onClick={() => handleCategoryChange("Business")}>Business</span>
        <span className="underline text-gray-500 cursor-pointer" onClick={() => handleCategoryChange("Nature")}>Nature</span>
        <span className="underline text-gray-500 cursor-pointer" onClick={() => handleCategoryChange("Science")}>Science</span>
        <span className="underline text-gray-500 cursor-pointer" onClick={() => handleCategoryChange("Lifestyle")}>Lifestyle</span>
      </div>
    </div>
  )
}

export default Sidemenu