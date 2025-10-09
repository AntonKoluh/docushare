import { useNavigate } from "react-router";
import { toast } from "sonner";
import usePostData from "~/hooks/usePostData";
import type { FileListType } from "~/types/accountType";
import React from "react";

type incomingProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  setData: React.Dispatch<React.SetStateAction<FileListType[] | null>> | null;
  data: FileListType[] | null;
};

export default function DeleteDialog({
  setIsOpen,
  id,
  data,
  setData,
}: incomingProps) {
  const postData = usePostData();
  const navigate = useNavigate();
  const deleteDoc = async () => {
    const result = await postData("docs/delete/", { id: id });
    toast(result.data.msg);
    if (result.data.success && data && setData) {
      const index = data?.findIndex((obj) => obj.id === id);
      const newList = [...data];
      newList.splice(index, 1);
      setData(newList);
    } else {
      navigate("/");
    }
  };
  return (
    <div className="flex flex-col justify-start items-center w-full border-1 p-2 border-(--main-n)">
      <p className="text-sm! text-red-400! w-full">
        Are you sure you want to delete this doc?
      </p>
      <p className="text-sm! text-black! w-full mb-5 mt-1">
        If you are not the owner of the doc, it will remove you as a
        collaborator
      </p>
      <div className="flex flex-row justify-center items-center gap-5">
        <button
          className="text-sm border-2 p-2 rounded-md bg-red-400 hover:bg-red-600 hover:text-white cursor-pointer h-8 flex justify-center items-center"
          onClick={deleteDoc}
        >
          Delete
        </button>
        <button
          className="text-sm border-2 p-2 rounded-md bg-gray-300 hover:bg-gray-400 hover:text-white cursor-pointer h-8 flex justify-center items-center"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
