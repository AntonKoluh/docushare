import { Link } from "react-router";
import NewFile from "./components/newDoc";
import { useEffect, useState } from "react";
import useGetData from "~/hooks/useGetData";
import type { FileListType } from "~/types/accountType";
import SpinnerDocList from "../ui/spinners/SpinnerDocList";
import { generateUID } from "~/helpers/helpers";
// import { useMediaQuery } from "@/hooks/useGetScreenWidth";
import DocCard from "./components/DocCard";
import plusNewFile from "../../assets/plusNewFile.svg";

type incomingProps = {
  searchTerm: string;
};

const DocList = ({ searchTerm }: incomingProps) => {
  const getData = useGetData();
  const [data, setData] = useState<FileListType[] | null>(null);
  const [originalData, setOriginalData] = useState<FileListType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user")!).email;
  const newUID = generateUID();
  // const isSmallScreen = useMediaQuery("(max-width: 764px)");

  useEffect(() => {
    const getListData = async () => {
      const result = await getData("docs/");
      setData(result.data);
      setOriginalData(result.data);
      setIsLoading(false);
    };
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setData(originalData);
    }
    if (data && data.length > 0) {
      const reordered_list = originalData!.filter((obj) => {
        return obj.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setData(reordered_list);
    }
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto w-full h-full p-5 px-2">
      <div className="flex flex-row gap-50 justify-start items-center w-full">
        <div className="flex flex-row jusify-center sm:justify-start items-center w-full relative">
          <Link to={"/edit/" + newUID}>
            <NewFile />
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="w-full gap-5 justify-center items-center mt-5 md:justify-start">
          <SpinnerDocList />
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,_210px)] w-full gap-5 justify-center items-center mt-5 md:justify-start">
          <>
            {data?.map((obj) => {
              const displayOwner =
                obj.owner.username === currentUser
                  ? "Me"
                  : obj.owner.username.length > 15
                  ? obj.owner.username.slice(0, 14) + "..."
                  : obj.owner.username;
              return (
                <DocCard
                  key={obj.uid}
                  owner={displayOwner}
                  fullContent={obj}
                  setData={setData}
                  data={data}
                />
              );
            })}
            <Link
              to={"/edit/" + newUID}
              className="shadow-xl shadow-gray-300 hover:shadow-blue-200 transition-all duration-150 border-1 border-black w-[210px] h-[107px] font-(font-family:--font-main) p-2 flex flex-col justify-center items-center gap-1 hover:bg-(--bg-navbar) text-(--main-n)"
            >
              <img src={plusNewFile} />
              <span className="font-semibold">New Doc</span>
            </Link>
          </>
        </div>
      )}
    </div>
  );
};

export default DocList;
