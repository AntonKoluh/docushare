export default function SearchList({searchTerm ,setSearch} : {searchTerm: string, setSearch: React.Dispatch<React.SetStateAction<string>>}) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }
  return (
    <div className="flex flex-row justify-between items-center max-w-100 min-w-70 h-8 bg-gray-300 rounded-md text-md border-1 border-black">
    <input
      type="text"
      name="docListSearch"
      id="docListSearch"
      className="w-full focus:outline-none pl-3"
      placeholder="Search"
      onChange={handleSearchChange}
      value={searchTerm}
    />
    <span className="flex cursor-pointer text-center hover:bg-gray-400 hover:rounded-l-none rounded-md h-full items-center px-3" onClick={() => setSearch("")}>Clear</span>
    </div>
  );
}
