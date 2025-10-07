import fileIcon from "../../../../public/file-icon.svg";
import type { FileListType } from "@/types/accountType";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Link } from "react-router";
import DropDownDocs from "./DropDownDocs";

type incomingProps = {
  owner: string;
  fullContent: FileListType;
  setData: React.Dispatch<React.SetStateAction<FileListType[] | null>>;
  data: FileListType[];
};

const DocCard = ({ owner, fullContent, setData, data }: incomingProps) => {
  if (fullContent.name.length > 15) {
    fullContent.shortName = fullContent.name.slice(0, 14) + "...";
  }
  const modifiedDate = new Date(fullContent.updated_at);
  const createdDate = new Date(fullContent.created_at);
  const updatedAtShort = modifiedDate.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const updatedAtLong = modifiedDate.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
    const createdAtLong = createdDate.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <div className="relative w-full">
    <Link to={`/edit/${fullContent.uid}`}>
    <div className="border-1 border-black w-[210px] h-[107px] font-(font-family:--font-main) p-2 flex-col justify-center items-center gap-1 hover:bg-(--bg-navbar)">
      <div className="flex flex-col relative gap-1 justify-center items-left w-full text-left mb-1">
        <HoverCard>
          <HoverCardTrigger asChild>
            <p className="text-[14px]! font-semibold cursor-default">
              {fullContent.shortName ? fullContent.shortName : fullContent.name}
            </p>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm!">{fullContent.name}</p>
          </HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger asChild>
            <p className="text-xs cursor-default">Modified: {updatedAtShort}</p>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm!">
              Created at: {createdAtLong} <br/><br/> Last modified by: {fullContent.last_modified_by} <br/> At: {updatedAtLong}
            </p>
          </HoverCardContent>
        </HoverCard>
        <p className="text-xs cursor-default">Owner: {owner}</p>
        <img
          src={fileIcon}
          className="w-[28px] h-[34px] absolute top-1 left-41"
        />
        
      </div>
      </div>
      </Link>
        <DropDownDocs 
            id={fullContent.id}
            uid={fullContent.uid}
            name={fullContent.name}
            public_access={fullContent.public_access}
            displayOwner={owner}
            fullData={data}
            setData={setData}
          />
    </div>
  );
};

export default DocCard;
