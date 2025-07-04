import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Link } from "react-router";
import DropDownFile from "./components/DropDownFile";
import DropDownSocial from "./components/DropDownSocial";
import DropDownAI from "./components/DropDownAI";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { ResponsiveDialog } from "../common/ResponsiveDialog";
import ShareForm from "~/forms/ShareForm";

type incomingProps = {
  doc: dataType;
  socketStatus: number;
  setDoc: Dispatch<SetStateAction<dataType>>;
  updateData: updateDataType;
  setUpdateData: Dispatch<SetStateAction<updateDataType>>;
  onlineUsers: string[];
};

export default function EditorNavBar({
  doc,
  socketStatus,
  setDoc,
  updateData,
  setUpdateData,
  onlineUsers,
}: incomingProps) {
  const fileNameRef = useRef<HTMLInputElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const public_access = true;
  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.value = doc ? doc.title : "New Document";
    }
  }, [doc?.title]);

  function handleOnTitleChange() {
    const newData = {
      ...updateData,
      title: fileNameRef.current?.value || "",
      flag: true,
    };
    setUpdateData(newData);
  }

  return (
    <>
      {/* Share Dialog */}
      <ResponsiveDialog
        id={doc.id || 5}
        title={name + " Settings"}
        description={null}
        isOpen={shareOpen}
        setIsOpen={setShareOpen}
      >
        <ShareForm
          id={doc.id || 5}
          setShareOpen={setShareOpen}
          allowPublicAccessProp={public_access}
        />
      </ResponsiveDialog>
      <div className="h-fit sticky w-full bg-gray-100 flex flex-col justify-center items-center text-black">
        <div className="mx-auto max-w-7xl w-full">
          <div className="w-full text-left text-2xl font-bold px-1 my-1 flex flex-row justify-between items-center gap-4 mt-2">
            <HoverCard>
              <HoverCardTrigger>
                <div
                  className={`w-3 h-3 rounded-full ${
                    socketStatus === 0
                      ? "bg-yellow-500"
                      : socketStatus === 1
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
              </HoverCardTrigger>
              <HoverCardContent>
                {socketStatus === 0
                  ? "Connecting to live service"
                  : socketStatus === 1
                  ? "Connected to live service"
                  : "Something went wrong, disconnected from live service"}
              </HoverCardContent>
            </HoverCard>
            <input
              ref={fileNameRef}
              type="text"
              name="fileName"
              id="fileName"
              className="focus:outline-0 mr-auto"
              onChange={handleOnTitleChange}
              readOnly={doc.access === 0 ? true : false}
            />
            {doc.access != 1 ? (
              <p className="text-gray-700! text-center! w-full text-lg!">
                (Readonly)
              </p>
            ) : null}
            <div className="text-right justify-self-end flex flex-row justify-center items-center gap-2">
              <p className="text-black! mr-2">Viewing:</p>
              {onlineUsers.map((user) => (
                <div
                  className={`rounded-full bg-green-400 h-10 w-10 text-center flex justify-center items-center border-2 border-black cursor-default ${
                    user.startsWith("Guest")
                      ? "bg-yellow-900 text-gray-300"
                      : ""
                  }`}
                  key={user}
                >
                  <HoverCard>
                    <HoverCardTrigger>
                      {user.slice(0, 1).toUpperCase()}
                    </HoverCardTrigger>
                    <HoverCardContent>{user}</HoverCardContent>
                  </HoverCard>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center w-full border-t-2 border-t-gray-500">
            <ul className="list-none flex flex-row justify-start items-center w-full gap-2 bg-gray-100">
              <li className="text-xl px-2 py-1 hover:bg-gray-400 cursor-pointer">
                <DropDownFile />
              </li>
              <li className="text-xl px-2 py-1 hover:bg-gray-400 cursor-pointer">
                <DropDownSocial setShareOpen={setShareOpen} />
              </li>
              <li className="text-xl px-2 py-1 hover:bg-gray-400 cursor-pointer font-bold">
                <DropDownAI />
              </li>
              <li className="bg-black text-xl px-2 rounded-md ml-auto text-white hover:bg-gray-400 cursor-pointer hover:text-black">
                <Link to="/">Back</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
