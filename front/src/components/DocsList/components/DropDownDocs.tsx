import { ArrowDownToLine, File, Share, Trash2 } from "lucide-react";
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

type incomingProps = {
  id: number;
  uid: string;
  name: string;
  public_access: boolean;
  displayOwner: string;
  setData: React.Dispatch<React.SetStateAction<FileListType[] | null>>;
  data: FileListType[] | null;
};

export default function DropDownDocs({
  id,
  uid,
  name,
  public_access,
  displayOwner,
  data,
  setData,
}: incomingProps) {
  let displayName = name;
  if (name.length > 7) {
    displayName = displayName.slice(0, 7) + "...";
  }
  const [shareOpen, setShareOpen] = useState(false);
  const [publicOpen, setPublicOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const disableShare = displayOwner === "Me" ? false : true;
  console.log(data);
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
          data={data}
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
          data={data}
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
      <DropdownMenu aria-hidden="false">
        <DropdownMenuTrigger asChild>
          <span className="flex flex-col w-10 h-10 justify-center items-center gap-1 hover:bg-(--acc-c) rounded-full">
            <span className="rounded-full bg-(--bg-acc-c) w-1 h-1"></span>
            <span className="rounded-full bg-(--bg-acc-c) w-1 h-1"></span>
            <span className="rounded-full bg-(--bg-acc-c) w-1 h-1"></span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <HoverCard>
            <HoverCardTrigger>
              <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
                <File />
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
            <ArrowDownToLine />
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
                <Share />
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
          <DropdownMenuItem className="text-xl text-purple-700">
            <Share />
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
    </>
  );
}
