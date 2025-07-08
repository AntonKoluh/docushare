import { ArrowDownToLine, File, ClipboardPlus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { generateUID } from "~/helpers/helpers";

type incomingProps = {
  setDownloadOpen: (arg0: boolean) => void;
  closeSocket: () => void;
  setDeleteOpen: (arg0: boolean) => void;
};

export default function DropDownFile({
  setDownloadOpen,
  closeSocket,
  setDeleteOpen,
}: incomingProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-(--bg-acc-c) hover:text-(--text-c) cursor-pointer py-1 px-2 rounded-sm font-bold select-none">
        File
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
          <File />
          File
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xl">
          <Link
            to={"/edit/" + generateUID()}
            className="text-xl flex flex-row justify-center items-center gap-2"
            onClick={closeSocket}
          >
            <ClipboardPlus />
            New Doc
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-xl cursor-pointer"
          onSelect={() => setDownloadOpen(true)}
        >
          <ArrowDownToLine />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-xl cursor-pointer"
          variant="destructive"
          onSelect={() => setDeleteOpen(true)}
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
