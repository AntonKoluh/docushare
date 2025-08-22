import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useGetData from "~/hooks/useGetData";
import usePostData from "~/hooks/usePostData";
import { toast } from "sonner";
import SpinnerCollaborators from "~/components/ui/spinners/SpinnerCollaborators";
import CollabDisplay from "./Components/CollabDisplay";
import React from "react";
import type { incomingData } from "~/types/docTypes.tsx";

const schema = z.object({
  email: z.string().email(),
  allowEdit: z.boolean(),
});

type FormFields = z.infer<typeof schema>;

type incomingProps = {
  id: number;
  setShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allowPublicAccessProp: boolean;
};

const ShareForm = ({ id, setShareOpen }: incomingProps) => {
  const [collaborators, setCollaborators] = useState<incomingData[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const postData = usePostData();
  const getData = useGetData();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const effectGetData = async () => {
      const result = await getData("colab/" + id + "/");
      setCollaborators(result.data);
      setIsLoading(false);
    };
    effectGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const result = await postData("colab/add_colab/", {
      ...data,
      id: id,
    });
    toast(result.data.msg);
    if (result.data.collabs) {
      setCollaborators(result.data.collabs);
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-3 text-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register("email")}
        type="text"
        placeholder="Add new collaborator by email"
        className="text-sm! w-full bg-gray-200! p-1 rounded-sm text-(--bg-acc-c) border-2 border-(--bg-acc-c)"
      />
      {errors.email && (
        <div className="text-red-500">{errors.email.message}</div>
      )}
      {watch("email") != "" && (
        <div className="flex flex-row items-center justify-start w-full gap-10">
          <p className="text-black! text-lg!">
            Allow {watch("email")} to edit:{" "}
          </p>
          <input
            {...register("allowEdit")}
            type="checkbox"
            className="size-5"
          />
        </div>
      )}
      <div className="bg-gray-200 border-2 border-gray-400 w-full px-4 py-2 rounded-sm">
        <p className="text-black! mb-2 text-sm!">Current collaborators:</p>
        <div className="flex flex-row w-full justify-start items-center gap-2">
          {isLoading ? (
            <SpinnerCollaborators />
          ) : collaborators.length > 0 ? (
            collaborators.map((obj) => (
              <CollabDisplay
                key={obj.collaborator.id}
                id={id}
                auth={obj.auth}
                email={obj.collaborator.email}
                fn={obj.collaborator.first_name}
                ln={obj.collaborator.last_name}
                collaborators={collaborators}
                setCollaborators={setCollaborators}
              />
            ))
          ) : (
            "No collaborators on this doc"
          )}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center gap-3">
        <button
          disabled={isSubmitting}
          type="submit"
          className={`bg-gray-100 p-2 rounded-md hover:shadow-purple-500 hover:shadow-2xl hover:bg-gray-200 cursor-pointer border-2 text-sm! ${
            isSubmitting
              ? "cursor-wait! bg-gray-800 hover:bg-gray-800 text-white shadow-2xl shadow-black"
              : ""
          }`}
        >
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShareOpen(false);
          }}
          className="bg-red-300 p-2 rounded-md hover:shadow-red-600 hover:shadow-2xl hover:bg-red-600 cursor-pointer border-2 text-sm!"
        >
          Cancel
        </button>
      </div>
      {errors.root && <div className="text-red-500">{errors.root.message}</div>}
    </form>
  );
};

export default ShareForm;
