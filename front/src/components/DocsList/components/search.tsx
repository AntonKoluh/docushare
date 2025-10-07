import { Search } from "lucide-react";

export default function SearchList({searchTerm ,setSearch} : {searchTerm: string, setSearch: React.Dispatch<React.SetStateAction<string>>}) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }
  return (
    <div className="relative flex flex-row justify-center items-center rounded-md ml-6 z-50 bg-(#f5f5f5)">
    <div className="absolute sm:relative flex flex-row justify-start items-center max-w-5xl w-fit h-8 bg-(#f5f5f5) rounded-md text-md sm:bg-(--bg-navbar) sm:border-2 border-0 border-(--main-n) z-50">
    <input
      type="text"
      name="docListSearch"
      id="docListSearch"
      className="sm:w-80 sm:focus:w-80 sm:h-fit sm:focus:border-0 sm:p-0 p-1 w-8 h-fit focus:w-70 focus:outline-none pl-3 transform-width duration-150 z-50 bg-(#f5f5f5) focus:bg-(--bg-navbar) focus:border-2 focus:border-(--main-n) rounded-md sm:bg-(--bg-navbar) opacity-0 focus:opacity-100 sm:opacity-100"
      onChange={handleSearchChange}
      value={searchTerm}
    />
    <span className="hidden sm:flex cursor-pointer text-center hover:bg-gray-400 hover:rounded-l-none rounded-md items-center px-3 text-sm h-8" onClick={() => setSearch("")}>Clear</span>
    </div>
    <Search className="sm:hidden absolute h-7 w-auto p-1 rounded-full text-black"/>
    </div>
  );
}
