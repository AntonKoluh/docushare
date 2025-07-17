import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Link } from "react-router";
import NewFile from "./components/newDoc";
import { useEffect, useState } from "react";
import useGetData from "~/hooks/useGetData";
import type { FileListType } from "~/types/accountType";
import DropDownDocs from "./components/DropDownDocs";
import SpinnerDocList from "../ui/spinners/SpinnerDocList";
import { generateUID } from "~/helpers/helpers";
import { FileMinus } from "lucide-react";

const DocList = () => {
  const getData = useGetData();
  const [data, setData] = useState<FileListType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user")!).email;

  useEffect(() => {
    const getListData = async () => {
      const result = await getData("docs/");
      setData(result.data);
      setIsLoading(false);
    };
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full h-full pt-10">
      <div className="flex flex-row gap-50 justify-start items-center">
        <div className="flex flex-row justify-center items-center gap-5">
          <Link to={"/edit/" + generateUID()}>
            <NewFile />
          </Link>
        </div>
        {/* <SearchList /> */}
      </div>
      <div className="flex flex-col pt-20 w-full">
        <div className="flex flex-row justify-start items-center w-full border-b-1 px-2 border-(--bg-acc-c)">
          <p className="flex-6 font-bold w-full">Name</p>
          <p className="flex-2 font-bold w-full text-center">Owner</p>
          <p className="flex-2 font-bold w-full text-center">Last modified</p>
          <p className="flex-1 w-full"></p>
        </div>
        {isLoading ? (
          <SpinnerDocList />
        ) : data ? (
          data.map((obj) => {
            const displayOwner =
              obj.owner.username === currentUser ? "Me" : obj.owner.username;
            return (
              <Link to={"/edit/" + obj.uid} key={obj.id}>
                <div className=" cursor-pointer flex flex-row justify-center items-center w-full border-b-1 h-14 border-b-gray-400 px-2 hover:bg-(--text-acc-c)">
                  <p className="flex-6 w-full text-[1.3rem]! flex flex-row justify-start items-center gap-2">
                    <FileMinus /> <span className="pt-1">{obj.name}</span>
                  </p>
                  <p className="flex-2 w-full text-center text-[1.3rem]! pt-1">
                    {displayOwner}
                  </p>
                  <HoverCard>
                    <HoverCardTrigger className="w-full flex-2" asChild>
                      <p className="flex-2 w-full text-center text-[1.3rem]! pt-1">
                        {obj.updated_at.slice(0, 10)}
                      </p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit">
                      <p className="text-4! text-black!">Created At:</p>
                      <p className="text-8! text-black! whitespace-nowrap font-bold!">
                        {new Date(obj.created_at).toLocaleString()}
                      </p>
                      {obj.last_modified_by ? (
                        <>
                          <p className="text-4! text-black!">
                            Last modified by:
                          </p>
                          <p className="text-8! text-black! font-bold!">
                            {obj.last_modified_by}
                          </p>
                        </>
                      ) : null}
                    </HoverCardContent>
                  </HoverCard>
                  <div
                    className="flex-1 flex w-full justify-center items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropDownDocs
                      id={obj.id}
                      uid={obj.uid}
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
};

export default DocList;
