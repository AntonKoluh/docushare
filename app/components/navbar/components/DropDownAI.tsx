import { Brain, Columns3Cog, List, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function DropDownAI() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>AI</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
          <Brain />
          AI
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xl">
          <Sun />
          Summarize
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xl">
          <List />
          Convert to ToDo list
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xl">
          <Columns3Cog />
          Custom Action
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
