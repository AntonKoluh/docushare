import { ArrowDownToLine, File, ClipboardPlus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function DropDownFile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>File</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
          <File />
          File
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xl">
          <ClipboardPlus />
          New Doc
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xl">
          <ArrowDownToLine />
          Download Doc
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xl">
          <ArrowDownToLine />
          Download JSON
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
