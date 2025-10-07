import {
  Bot,
  Download,
  File,
  Link,
  Menu,
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { useState } from "react";
import { ResponsiveDialog } from "~/components/common/ResponsiveDialog";
import ShareForm from "~/forms/ShareForm/ShareForm";
import DeleteDialog from "./DeleteDialog";
import type { FileListType } from "~/types/accountType";
import DownloadDialog from "./DownloadDialog";
import PublicViewingDialog from "./PublicViewingDialog";
import React from "react";
import AiHero from "@/components/ai/AiHero";

type incomingProps = {
  id: number;
  uid: string;
  name: string;
  public_access: boolean;
  displayOwner: string;
  setData: React.Dispatch<React.SetStateAction<FileListType[] | null>>;
  fullData: FileListType[] | null;
};

export default function DropDownDocs({
  id,
  uid,
  name,
  public_access,
  displayOwner,
  setData,
  fullData,
}: incomingProps) {
  let displayName = name;
  if (name.length > 14) {
    displayName = displayName.slice(0, 14) + "...";
  }
  const [shareOpen, setShareOpen] = useState(false);
  const [publicOpen, setPublicOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const disableShare = displayOwner === "Me" ? false : true;
  return (
    <>
      {/* Share Dialog */}
      <ResponsiveDialog
        title={name + " Settings"}
        description={null}
        isOpen={shareOpen}
        setIsOpen={setShareOpen}
      >
        <ShareForm
          id={id}
          setShareOpen={setShareOpen}
          allowPublicAccessProp={public_access}
        />
      </ResponsiveDialog>
      {/* Public Access Dialog */}
      <ResponsiveDialog
        title={name + " Access"}
        description={null}
        isOpen={publicOpen}
        setIsOpen={setPublicOpen}
      >
        <PublicViewingDialog
          id={id}
          link={uid}
          publicAccess={public_access}
          setData={setData}
          data={fullData}
        />
      </ResponsiveDialog>
      {/* Delete Dialog */}
      <ResponsiveDialog
        title={"Delete " + name}
        description={null}
        isOpen={deleteOpen}
        setIsOpen={setDeleteOpen}
      >
        <DeleteDialog
          setIsOpen={setDeleteOpen}
          id={id}
          setData={setData}
          data={fullData}
        />
      </ResponsiveDialog>
      {/* Download Docs */}
      <ResponsiveDialog
        title={"Download " + name}
        description={null}
        isOpen={downloadOpen}
        setIsOpen={setDownloadOpen}
      >
        <DownloadDialog uid={uid} name={name} />
      </ResponsiveDialog>
      {/* Summerize Docs (AI) */}
      <ResponsiveDialog
        title={name + " Ai"}
        description={null}
        isOpen={aiOpen}
        setIsOpen={setAiOpen}
      >
        <AiHero uid={uid} />
      </ResponsiveDialog>
      <div className="flex flex-row justify-end items-center w-fit gap-1 absolute top-19 left-29">
        <Bot 
        className="w-[26px] h-[26px] p-1 text-[#16881E] hover:text-white hover:bg-(--main-n) transition-all duration-150 rounded-full"
        onClick={() => setAiOpen(true)}
        />
        <Download
        className="w-[26px] h-[26px] p-1 text-[#16881E] hover:text-white hover:bg-(--main-n) transition-all duration-150 rounded-full z-10"
        onClick={() => setDownloadOpen(true)}
        />
        <DropdownMenu aria-hidden="false">
          <DropdownMenuTrigger asChild>
            <Menu className="w-[26px] h-[26px] p-1 text-[#16881E] hover:text-white hover:bg-(--main-n) transition-all duration-150 rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <HoverCard>
              <HoverCardTrigger>
                <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
                  <File className="h-4 w-4" />
                  {displayName}
                </DropdownMenuLabel>
              </HoverCardTrigger>
              {name.length > 7 && <HoverCardContent>{name}</HoverCardContent>}
            </HoverCard>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xl"
              onSelect={() => {
                setDownloadOpen(true);
              }}
            >
              <Download />
              Download
            </DropdownMenuItem>
            <HoverCard>
              <HoverCardTrigger>
                <DropdownMenuItem
                  className="text-xl z-50"
                  onSelect={() => {
                    setPublicOpen(true);
                  }}
                  disabled={disableShare}
                >
                  <Link />
                  Public Access
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xl z-50"
                  onSelect={() => {
                    setShareOpen(true);
                  }}
                  disabled={disableShare}
                >
                  <Share />
                  Manage Collaborators
                </DropdownMenuItem>
              </HoverCardTrigger>
              {disableShare && (
                <HoverCardContent>
                  Cannot share docs owned by others
                </HoverCardContent>
              )}
            </HoverCard>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xl text-purple-700"
              onSelect={() => setAiOpen(true)}
            >
              <Bot />
              Summarize
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xl"
              variant="destructive"
              onSelect={() => setDeleteOpen(true)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
