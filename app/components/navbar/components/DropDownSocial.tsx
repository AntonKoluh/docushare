import { Activity, Eye, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function DropDownSocial({ setShareOpen }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Social</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
          <Activity />
          Social
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-xl"
          onSelect={() => setShareOpen(true)}
        >
          <Eye />
          Manage Access
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xl">
          <Plus />
          Add Colaborator
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
