import AiHero from "@/components/ai/AiHero";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { Brain, Columns3Cog, List, Sun } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function DropDownAI({doc_name, uid} : {doc_name: string, uid: string}) {
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <>
      {/* Summerize Docs (AI) */}
      <ResponsiveDialog
        title={doc_name + " Ai"}
        description={null}
        isOpen={aiOpen}
        setIsOpen={setAiOpen}
      >
        <AiHero uid={uid}/>
      </ResponsiveDialog>
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-(--bg-acc-c) hover:text-(--text-c) cursor-pointer py-1 px-2 rounded-sm font-bold select-none text-sm!">
        AI
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-sm! font-bold w-full flex flex-row justify-start items-center gap-3">
          <Brain className="w-4 h-4"/>
          AI
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xl" onSelect={() => setAiOpen(true)}>
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
    </>
  );
}
