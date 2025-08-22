import { Activity, Eye, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import React from "react";

type incomingProps = {
  setShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DropDownSocial({ setShareOpen }: incomingProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-(--bg-acc-c) hover:text-(--text-c) cursor-pointer py-1 px-2 rounded-sm font-bold select-none text-sm!">
        Social
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-sm font-bold w-full flex flex-row justify-start items-center gap-3">
          <Activity className="w-4 h-4"/>
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
