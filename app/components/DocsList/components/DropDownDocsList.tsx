import {
  ArrowDownToLine,
  File,
  ClipboardPlus,
  Share,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type incomingProps = {
  name: string;
};

export default function DropDownDocsList({ name }: incomingProps) {
  let displayName = name;
  if (name.length > 7) {
    displayName = displayName.slice(0, 7) + "...";
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="flex flex-col w-10 h-10 justify-center items-center gap-1 hover:bg-gray-800 rounded-full">
          <span className="rounded-full bg-gray-200 w-1 h-1"></span>
          <span className="rounded-full bg-gray-200 w-1 h-1"></span>
          <span className="rounded-full bg-gray-200 w-1 h-1"></span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
          <File />
          {displayName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xl">
          <ArrowDownToLine />
          Download Doc
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xl">
          <ArrowDownToLine />
          Download JSON
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xl">
          <Share />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xl text-purple-700">
          <Share />
          Summarize
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xl" variant="destructive">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
