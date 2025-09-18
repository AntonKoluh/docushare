import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import SpinnerDownload from "@/components/ui/spinners/SpinnerDownload";
import usePostData from "@/hooks/usePostData";
import { toast } from "sonner";

type LoginInnerType = {
  setState: React.Dispatch<
    React.SetStateAction<"Login" | "Register" | "Loading">
  >;
};

const schema = z
  .object({
    email: z.string().email(),
    password1: z.string().min(6, "Password must be atleast 6 characters long"),
    password2: z.string().min(1, "Password confirmation is required"),
    fname: z.string().min(1, "Name is required"),
    lname: z.string().min(1, "Last name is required"),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

type FormFields = z.infer<typeof schema>;

const RegisterInner = ({ setState }: LoginInnerType) => {
  const postData = usePostData();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const result = await postData("register/", data, false);
    if (!result.data.success) {
      result.data.errors.forEach(
        (err: {
          field: "email" | "password1" | "password2" | "fname" | "lname";
          msg: string;
        }) => {
          setError(err.field, {
            type: "manual",
            message: err.msg,
          });
        }
      );
    } else {
      toast(data.email + " has been registered");
      setState("Login");
    }
  };

  return (
    <div className=" border-2 p-6 rounded-md h-fit">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-start items-center w-full h-full"
      >
        {errors.root && (
          <span className="text-red-500 h-6">{errors.root.message}</span>
        )}
        <div
          className={clsx(
            "flex justify-between items-center w-full relative h-11 border-2 rounded-md",
            errors.email ? "border-red-500" : "border-(--acc-c)"
          )}
        >
          <input
            {...register("email")}
            type="email"
            name="email"
            id="email"
            className="w-full h-11 absolute outline-0 z-20 px-2 text-lg"
          />
          <p className="absolute bg-white! z-10 bottom-7 left-5 text-[20px]! text-(--acc-c)! px-2! py-0! border-0! shadow-none! outline-0!">
            Email
          </p>
        </div>
        {errors.email ? (
          <span className="text-red-500 h-6">{errors.email.message}</span>
        ) : (
          <span className="h-6"></span>
        )}
        <div
          className={clsx(
            "flex justify-between items-center w-full relative h-11 border-2 rounded-md mt-2",
            errors.password1 ? "border-red-500" : "border-(--acc-c)"
          )}
        >
          <input
            {...register("password1")}
            type="password"
            name="password1"
            id="password1"
            className="w-full h-11 absolute outline-0 z-20 px-2 text-lg"
          />
          <p className="absolute bg-white! z-10 bottom-7 left-5 text-[20px]! text-(--acc-c)! px-2! py-0! border-0! shadow-none! outline-0!">
            Password
          </p>
        </div>
        {errors.password1 ? (
          <span className="text-red-500">{errors.password1.message}</span>
        ) : (
          <span className="h-6"></span>
        )}
        <div
          className={clsx(
            "flex justify-between items-center w-full relative h-11 border-2 rounded-md mt-2",
            errors.password2 ? "border-red-500" : "border-(--acc-c)"
          )}
        >
          <input
            {...register("password2")}
            type="password"
            name="password2"
            id="password2"
            className="w-full h-11 absolute outline-0 z-20 px-2 text-lg"
          />
          <p className="absolute bg-white! z-10 bottom-7 left-5 text-[20px]! text-(--acc-c)! px-2! py-0! border-0! shadow-none! outline-0!">
            Password
          </p>
        </div>
        {errors.password2 ? (
          <span className="text-red-500">{errors.password2.message}</span>
        ) : (
          <span className="h-6"></span>
        )}
        <div
          className={clsx(
            "flex justify-between items-center w-full relative h-11 border-2 rounded-md mt-2",
            errors.fname ? "border-red-500" : "border-(--acc-c)"
          )}
        >
          <input
            {...register("fname")}
            type="text"
            name="fname"
            id="fname"
            className="w-full h-11 absolute outline-0 z-20 px-2 text-lg"
          />
          <p className="absolute bg-white! z-10 bottom-7 left-5 text-[20px]! text-(--acc-c)! px-2! py-0! border-0! shadow-none! outline-0!">
            First Name
          </p>
        </div>
        {errors.fname ? (
          <span className="text-red-500">{errors.fname.message}</span>
        ) : (
          <span className="h-6"></span>
        )}
        <div
          className={clsx(
            "flex justify-between items-center w-full relative h-11 border-2 rounded-md mt-2",
            errors.fname ? "border-red-500" : "border-(--acc-c)"
          )}
        >
          <input
            {...register("lname")}
            type="text"
            name="lname"
            id="lname"
            className="w-full h-11 absolute outline-0 z-20 px-2 text-lg"
          />
          <p className="absolute bg-white! z-10 bottom-7 left-5 text-[20px]! text-(--acc-c)! px-2! py-0! border-0! shadow-none! outline-0!">
            Last Name
          </p>
        </div>
        {errors.lname ? (
          <span className="text-red-500">{errors.lname.message}</span>
        ) : (
          <span className="h-6"></span>
        )}
        <div className="mt-4 flex flex-row gap-4 justify-end items-center w-full">
          <Button
            variant="ghost"
            onClick={() => setState("Login")}
            className="text-lg cursor-pointer"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="cursor-pointer text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="text-white flex flex-row justify-center items-center gap-2">
                <SpinnerDownload /> <span>Loading...</span>
              </span>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterInner;
