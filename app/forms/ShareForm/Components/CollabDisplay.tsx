import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { useState } from "react";
import { toast } from "sonner";
import { HoverCard, HoverCardContent } from "~/components/ui/hover-card";
import { Switch } from "~/components/ui/switch";
import usePostData from "~/hooks/usePostData";
import React from "react";
import type { incomingData } from "~/types/docTypes.tsx";

type CollabDisplayType = {
  id: number;
  email: string;
  fn: string;
  ln: string;
  auth: number;
  collaborators: incomingData[] | [];
  setCollaborators: React.Dispatch<React.SetStateAction<incomingData[] | []>>;
};

const CollabDisplay = ({
  id,
  email,
  fn,
  ln,
  auth,
  collaborators,
  setCollaborators,
}: CollabDisplayType) => {
  const postData = usePostData();
  const [isDelete, setIsDelete] = useState(false);

  const handleRemoveCollaborator = async () => {
    setIsDelete(true);
    try {
      const result = await postData("colab/delete/", { id: id, user: email });
      toast(result.data.msg);
      if (result.data.success && collaborators) {
        const index = collaborators.findIndex(
          (obj) => obj.collaborator.id === id
        );
        const newList = [...collaborators];
        newList.splice(index, 1);
        setCollaborators(newList);
      }
    } finally {
      setIsDelete(false);
    }
  };

  const handleChangeEditRight = async () => {
    const result = await postData("colab/access/", { id: id, user: email });
    toast(result.data.msg);
    if (result.data.success) {
      const newList = collaborators.map((obj) =>
        obj.collaborator.email === email
          ? { ...obj, auth: result.data.auth }
          : obj
      );
      console.log(newList, id);
      setCollaborators(newList);
    }
  };

  return (
    <HoverCard key={id}>
      <HoverCardTrigger>
        <div
          className={`p-2 text-xl rounded-full w-12 h-12 flex justify-center items-center cursor-pointer font-bold ${
            auth === 1 ? "bg-green-400" : "bg-red-400"
          }`}
        >
          {fn.slice(0, 1) + ln.slice(0, 1)}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="font-bold text-lg">Email: {email}</div>{" "}
        <div className="font-bold mt-2 text-lg">
          {auth === 1 ? "Can" : "Cannot"} Edit{" "}
          <Switch
            defaultChecked={auth === 1 ? true : false}
            onCheckedChange={handleChangeEditRight}
          />
        </div>
        <div>
          <button
            className={`mt-5 border-2 p-2 border-white bg-red-400 rounded-md cursor-pointer hover:text-white hover:shadow-2xl hover:bg-red-500 hover:shadow-red-500 ${
              isDelete
                ? "bg-gray-400! hover:bg-gray-400! hover:shadow-none hover:text-black! cursor-wait!"
                : ""
            }`}
            onClick={handleRemoveCollaborator}
            disabled={isDelete}
          >
            {isDelete ? "Removing..." : "Remove"}
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CollabDisplay;
