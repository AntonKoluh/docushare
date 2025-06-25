import { Link } from "react-router";
import NewFile from "./components/newDoc";
import SearchList from "./components/search";
import DropDownDocsList from "./components/DropDownDocsList";

const data = [
  {
    id: 1,
    name: "Doc1",
    owner: "Me",
  },
  {
    id: 2,
    name: "Doc2",
    owner: "Me",
  },
  {
    id: 3,
    name: "Doc3",
    owner: "Me",
  },
  {
    id: 4,
    name: "Doc4",
    owner: "Me",
  },
  {
    id: 5,
    name: "my document",
    owner: "Me",
  },
];

export default function FileList() {
  return (
    <div className="max-w-7xl mx-auto w-full h-full pt-10">
      <div className="flex flex-row gap-50 justify-start items-center">
        <Link to={"/edit/"}>
          <NewFile />
        </Link>
        {/* <SearchList /> */}
      </div>
      <div className="flex flex-col pt-20 w-full">
        <div className="flex flex-row justify-start items-center w-full border-b-1 px-2">
          <p className="flex-6 font-bold w-full">Name</p>
          <p className="flex-2 font-bold w-full text-center">Owner</p>
          <p className="flex-2 font-bold w-full text-center">Last modified</p>
          <p className="flex-1 w-full">
            <span></span>
            <span></span>
            <span></span>
          </p>
        </div>
        {data.map((obj) => (
          <Link to={"/edit/" + obj.id} key={obj.id}>
            <div className=" cursor-pointer flex flex-row justify-center items-center w-full border-b-1 h-16 border-b-gray-400 px-2 hover:bg-gray-600">
              <p className="flex-6 w-full">{obj.name}</p>
              <p className="flex-2 w-full text-center">{obj.owner}</p>
              <p className="flex-2 w-full text-center">12.12.2024</p>
              <p className="flex-1 flex w-full justify-center items-center">
                <DropDownDocsList name={obj.name} />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
