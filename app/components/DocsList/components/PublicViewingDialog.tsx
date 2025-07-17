import { Copy, CopyCheck } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import usePostData from "~/hooks/usePostData";
import type { FileListType } from "~/types/accountType";
import React from "react";

type incomingProps = {
  id: number;
  link: string;
  publicAccess: boolean;
  data: FileListType[] | null;
  setData: React.Dispatch<React.SetStateAction<FileListType[] | null>>;
};

export default function PublicViewingDialog({
  id,
  link,
  publicAccess,
  setData,
  data,
}: incomingProps) {
  const baseUrl = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }`;
  const [isCopied, setIsCopied] = useState(false);
  const urlRef = useRef<HTMLInputElement | null>(null);
  const allowAccessRef = useRef<HTMLInputElement | null>(null);
  const postData = usePostData();
  function handleCopy() {
    setIsCopied(true);
    navigator.clipboard
      .writeText(urlRef.current!.value)
      .then(() => toast("Copied!"))
      .catch((err) => toast("Failed to copy:", err));
  }

  async function handleAccessChange() {
    const result = await postData("colab/public_access/", {
      id: id,
      allowPublicAccess: allowAccessRef.current!.checked,
    });
    if (result.data.success === true) {
      const newList = data!.map((obj) =>
        obj.id === id
          ? { ...obj, public_access: allowAccessRef.current!.checked }
          : obj
      );
      setData(newList);
    }
    toast(result.data.msg);
  }
  return (
    <div className="flex flex-col items-center justify-start w-full gap-10">
      <div className="w-full flex flex-row justify-center items-center gap-1">
        <input
          type="text"
          name=""
          id=""
          defaultValue={baseUrl + "/edit/" + link}
          ref={urlRef}
          className="text-black text-lg w-full"
        />
        {isCopied ? (
          <CopyCheck
            className="w-fit h-fit text-green-700 hover:bg-gray-400 rounded-md p-1"
            onClick={handleCopy}
          />
        ) : (
          <Copy
            className="w-fit h-fit hover:bg-gray-400 rounded-md p-1"
            onClick={handleCopy}
          />
        )}
      </div>
      <div className="flex flex-row justify-center items-center gap-3">
        <p className="text-black! text-lg!">Allow Public Viewing: </p>
        <input
          type="checkbox"
          defaultChecked={publicAccess}
          onClick={handleAccessChange}
          ref={allowAccessRef}
          className="size-5"
        />
      </div>
    </div>
  );
}
