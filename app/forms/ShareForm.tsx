import { zodResolver } from "@hookform/resolvers/zod";
import { Heading1 } from "lucide-react";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useGetData from "~/hooks/useGetData";
import usePostData from "~/hooks/usePostData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { toast } from "sonner";
import { Switch } from "~/components/ui/switch";
import SpinnerCollaborators from "~/components/ui/spinners/SpinnerCollaborators";

const schema = z.object({
  email: z.union([z.string().email(), z.literal("")]).optional(),
  allowPublicAccess: z.boolean(),
  allowEdit: z.boolean(),
});

type FormFields = z.infer<typeof schema>;

type incomingProps = {
  id: number;
  setShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allowPublicAccessProp: boolean;
};

type incomingData = {
  auth: number;
  collaborator: collabType;
  id: number;
};

type collabType = {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};
const ShareForm = ({
  id,
  setShareOpen,
  allowPublicAccessProp,
}: incomingProps) => {
  const [collaborators, setCollaborators] = useState<incomingData[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const postData = usePostData();
  const getData = useGetData();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      allowPublicAccess: allowPublicAccessProp,
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const effectGetData = async () => {
      const result = await getData("colab/" + id + "/");
      setCollaborators(result.data);
      setIsLoading(false);
    };
    effectGetData();
  }, []);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await postData("colab/update_colab/", { ...data, id: id });
      toast(result.data.msg);
      if (result.data.collabs) {
        setCollaborators(result.data.collabs);
      }
    } catch (error) {
      setError("root", {});
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
        placeholder="Email"
        className="text-xl w-full"
      />
      {errors.email && (
        <div className="text-red-500">{errors.email.message}</div>
      )}
      <div className="bg-gray-200 border-2 border-gray-400 w-full px-4 py-2">
        <p className="text-black! mb-2">Current collaborators:</p>
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
      <div className="flex flex-row items-center justify-start w-full gap-10">
        <p className="text-black! text-lg!">Allow Collaborator Editing: </p>
        <input {...register("allowEdit")} type="checkbox" className="size-5" />
      </div>
      <div className="flex flex-row items-center justify-start w-full gap-10">
        <p className="text-black! text-lg!">Allow Public Viewing: </p>
        <input
          {...register("allowPublicAccess")}
          type="checkbox"
          className="size-5"
        />
      </div>
      <div className="flex flex-row justify-center items-center gap-5">
        <button
          disabled={isSubmitting}
          type="submit"
          className={`bg-gray-100 p-3 rounded-md hover:shadow-purple-500 hover:shadow-2xl hover:bg-gray-200 cursor-pointer border-2 ${
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
          className="bg-red-300 p-3 rounded-md hover:shadow-red-600 hover:shadow-2xl hover:bg-red-600 cursor-pointer border-2"
        >
          Cancel
        </button>
      </div>
      {errors.root && <div className="text-red-500">{errors.root.message}</div>}
    </form>
  );
};

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

export default ShareForm;
