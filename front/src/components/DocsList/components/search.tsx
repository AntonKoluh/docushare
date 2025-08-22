export default function SearchList({setSearch} : {setSearch: React.Dispatch<React.SetStateAction<string>>}) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }
  return (
    <input
      type="text"
      name="docListSearch"
      id="docListSearch"
      className="justify-self-center w-100 h-8 bg-gray-300 rounded-md px-3 text-md border-1 border-black"
      placeholder="Search"
      onChange={handleSearchChange}
    />
  );
}
