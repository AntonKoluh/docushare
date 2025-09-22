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
import ShareForm from "~/forms/ShareForm/ShareForm";
import DownloadDialog from "../DocsList/components/DownloadDialog";
import DeleteDialog from "../DocsList/components/DeleteDialog";
import { MoveLeft } from "lucide-react";
import type { dataType, updateDataType } from "~/types/docTypes.tsx";
import SaveSpinner from "../ui/spinners/SaveSpinner";

type incomingProps = {
  doc: dataType;
  socketStatus: number;
  updateData: updateDataType;
  setUpdateData: Dispatch<SetStateAction<updateDataType>>;
  onlineUsers: string[];
  closeSocket: () => void;
  handleManualSave: () => void;
  isSaving: boolean;
};

const EditorNavBar = ({
  doc,
  socketStatus,
  setUpdateData,
  onlineUsers,
  closeSocket,
  handleManualSave,
  isSaving,
}: incomingProps) => {
  const fileNameRef = useRef<HTMLInputElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const public_access = true;
  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.value = doc ? doc.title : "New Document";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.title]);

    useEffect(() => {
    const handleSaveShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleManualSave()
      }
    };

    window.addEventListener("keydown", handleSaveShortcut);
    return () => {
      window.removeEventListener("keydown", handleSaveShortcut);
    };
  }, []);

  const handleOnTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const title = e.target.value;
  setUpdateData((prev) => ({ ...prev, title, flag: true }));
  }

  return (
    <>
      {/* Delete doc  */}
      <ResponsiveDialog
        title={"Delete " + doc.title!}
        description={null}
        isOpen={deleteOpen}
        setIsOpen={setDeleteOpen}
      >
        <DeleteDialog
          setIsOpen={setDeleteOpen}
          id={doc.id!}
          setData={null}
          data={null}
        />
      </ResponsiveDialog>
      {/* Share Dialog */}
      <ResponsiveDialog
        title={doc.title + " Settings"}
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
      <ResponsiveDialog
        title={"Download " + doc.title}
        description={null}
        isOpen={downloadOpen}
        setIsOpen={setDownloadOpen}
      >
        <DownloadDialog uid={doc.uid!} name={doc.title} />
      </ResponsiveDialog>
      <div className="h-fit sticky w-full bg-(--text-c) flex flex-col justify-center items-center text-black max-w-7xl mx-auto p-2 rounded-md mt-1">
        <div className="mx-auto max-w-7xl w-full">
          <div className="w-full text-left text-2xl font-bold px-1 my-1 flex flex-row justify-between items-center gap-4 mt-2">
            <HoverCard>
              <HoverCardTrigger>
                <div
                  className={`w-2 h-2 rounded-full ${
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
              className="focus:outline-0 mr-auto text-lg! w-full"
              onChange={handleOnTitleChange}
              readOnly={doc.access === 0 ? true : false}
            />
            {doc.access != 1 ? (
              <p className="text-gray-700! text-center! w-full text-md!">
                (Readonly)
              </p>
            ) : null}
            <div className="text-right justify-self-end flex flex-row justify-center items-center gap-2">
              {isSaving && <SaveSpinner />}
              <p className="text-black! mr-2">Viewing:</p>
              {onlineUsers.map((user) => (
                <div
                  className={`rounded-full bg-green-700 h-6 w-6 text-center flex justify-center items-center border-2 border-black cursor-default text-sm! text-white font-semibold ${
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
            <ul className="list-none flex flex-row-reverse justify-start items-center w-full gap-2 bg-(--text-c)">
              <li className="text-xl px-2 py-1  cursor-pointer">
                <DropDownFile
                  setDownloadOpen={setDownloadOpen}
                  closeSocket={closeSocket}
                  setDeleteOpen={setDeleteOpen}
                  handleSave={handleManualSave}
                />
              </li>
              <li className="text-xl px-2 py-1  cursor-pointer">
                <DropDownSocial setShareOpen={setShareOpen} />
              </li>
              <li className="text-xl px-2 py-1  cursor-pointer font-bold">
                <DropDownAI doc_name={doc.title!} uid={doc.uid!}/>
              </li>
              <li className="bg-(--bg-acc-c) text-xl px-2 py-1 rounded-sm mr-auto text-(--text-c) font-bold hover:bg-(--bg-acc-c) hover:shadow-sm hover:shadow-amber-500 transition-all cursor-pointer">
                <Link
                  to="/"
                  onClick={closeSocket}
                  className="flex flex-row justify-center items-center gap-2 text-sm!"
                >
                  <MoveLeft />
                  Back
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorNavBar;
