import { useState } from "react";
import { toast } from "sonner";
import usePostData from "~/hooks/usePostData";
import type { FileListType } from "~/types/accountType";

type incomingProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  setData: React.Dispatch<React.SetStateAction<FileListType[] | null>>;
  data: FileListType[] | null;
};

export default function DeleteDialog({
  setIsOpen,
  id,
  data,
  setData,
}: incomingProps) {
  const postData = usePostData();
  const deleteDoc = async () => {
    const result = await postData("docs/delete/", { id: id });
    toast(result.data.msg);
    if (result.data.success && data) {
      const index = data?.findIndex((obj) => obj.id === id);
      const newList = [...data];
      newList.splice(index, 1);
      console.log(newList);
      setData(newList);
    }
  };
  return (
    <div className="flex flex-col justify-start items-center w-full">
      <p className="text-lg! text-red-400! w-full">
        Are you sure you want to delete this doc?
      </p>
      <p className="text-lg! text-black! mt-4">
        If you are not the owner of the doc, it will remove you as a
        collaborator
      </p>
      <div className="flex flex-row justify-center items-center gap-5">
        <button
          className="text-xl border-2 p-2 rounded-md bg-red-400 hover:bg-red-600 hover:text-white hover:shadow-2xl hover:shadow-red-600"
          onClick={deleteDoc}
        >
          Delete
        </button>
        <button
          className="text-xl border-2 p-2 rounded-md bg-gray-300 hover:bg-gray-400 hover:text-white hover:shadow-2xl hover:shadow-purple-400"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
