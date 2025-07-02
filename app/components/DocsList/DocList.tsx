import { Link } from "react-router";
import NewFile from "./components/newDoc";
import { useEffect, useState } from "react";
import useGetData from "~/hooks/useGetData";
import type { FileListType } from "~/types/accountType";
import { ResponsiveDialog } from "../common/ResponsiveDialog";
import DropDownDocs from "./components/DropDownDocs";
import SpinnerDocList from "../ui/spinners/SpinnerDocList";

export default function DocList() {
  const getData = useGetData();
  const [data, setData] = useState<FileListType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user")!).email;

  useEffect(() => {
    const getListData = async () => {
      const result = await getData("docs/");
      console.log("result: " + JSON.stringify(result.data));
      setData(result.data);
      setIsLoading(false);
    };
    getListData();
  }, []);

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
        {isLoading ? (
          <SpinnerDocList />
        ) : data ? (
          data.map((obj) => {
            const displayOwner =
              obj.owner.username === currentUser ? "Me" : obj.owner.username;
            return (
              <Link to={"/edit/" + obj.id} key={obj.id}>
                <div className=" cursor-pointer flex flex-row justify-center items-center w-full border-b-1 h-16 border-b-gray-400 px-2 hover:bg-gray-600">
                  <p className="flex-6 w-full">
                    {obj.name}
                    {obj.id}
                  </p>
                  <p className="flex-2 w-full text-center">{displayOwner}</p>
                  <p className="flex-2 w-full text-center">
                    {obj.created_at.slice(0, 10)}
                  </p>
                  <div
                    className="flex-1 flex w-full justify-center items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropDownDocs
                      id={obj.id}
                      name={obj.name}
                      public_access={obj.public_access}
                      displayOwner={displayOwner}
                      setData={setData}
                      data={data}
                    />
                  </div>
                </div>
              </Link>
            );
          })
        ) : null}
      </div>
    </div>
  );
}
