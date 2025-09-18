import { useRef, useState } from "react";
import { ResponsiveDialog } from "../common/ResponsiveDialog";
import { Button } from "../ui/button";
import Login from "@/auth/login";
import SpinnerLogin from "../ui/spinners/LoginSpinner";
import RegisterInner from "./components/LoginModalRegister";
import usePostData from "@/hooks/usePostData";
import { toast } from "sonner";
import { setLoginStorage } from "@/auth/callback/AuthCallback";
import { useNavigate } from "react-router";

type incomingProps = {
  text: string;
};

const LoginModal = ({ text }: incomingProps) => {
  const [modalState, setModalState] = useState<
    "Login" | "Register" | "Loading"
  >("Login");
  const [loginOpen, setLoginOpen] = useState(false);
  const renderSwith = () => {
    switch (modalState) {
      case "Login":
        return <LoginInner setState={setModalState} />;
      case "Loading":
        return (
          <div className="h-[316px] flex justify-center items-center">
            <SpinnerLogin />
          </div>
        );
      case "Register":
        return <RegisterInner setState={setModalState} />;
    }
  };
  return (
    <>
      <ResponsiveDialog
        title={modalState}
        description=" "
        isOpen={loginOpen}
        setIsOpen={setLoginOpen}
      >
        {renderSwith()}
      </ResponsiveDialog>
      <Button
        onClick={() => setLoginOpen(true)}
        className="text-lg py-3 hover:shadow-lg border-4 border-black shadow-amber-500 hover:bg-gray-800 cursor-pointer"
      >
        {text}
      </Button>
    </>
  );
};

type LoginInnerType = {
  setState: React.Dispatch<
    React.SetStateAction<"Login" | "Register" | "Loading">
  >;
};

const LoginInner = ({ setState }: LoginInnerType) => {
  const navigate = useNavigate();
  const postData = usePostData();
  const userRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = async () => {
    if (!userRef.current?.value || !passRef.current?.value) {
      toast("Email / Password cannot be empty!");
      return;
    }
    const user = userRef.current.value;
    const pass = passRef.current.value;
    setState("Loading");
    const result = await postData(
      "login/",
      { username: user, password: pass },
      false
    );
    if (!result.data.success) {
      toast(result.data.msg);
      setState("Login");
    } else {
      setLoginStorage(
        result.data.access_token,
        result.data.refresh_token,
        JSON.stringify(result.data.user)
      );
      navigate(0);
    }
  };

  const handleRegister = () => {
    setState("Register");
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center border-2 p-6 rounded-md h-[316px]">
      <div className="flex justify-between items-center w-full relative h-11 border-2 border-(--acc-c) rounded-md">
        <input
          ref={userRef}
          type="email"
          name="email"
          id="email"
          className="w-full h-11 absolute outline-0 z-20 px-2 text-lg"
        />
        <p className="absolute bg-white! z-10 bottom-7 left-5 text-[20px]! text-(--acc-c)! px-2! py-0! border-0! shadow-none! outline-0!">
          Email
        </p>
      </div>
      <div className="flex justify-between items-center w-full relative h-11 border-2 border-(--acc-c) rounded-md">
        <input
          ref={passRef}
          type="password"
          name="pass"
          id="pass"
          className="w-full h-11 absolute outline-0 z-20 px-2 text-lg"
        />
        <p className="absolute bg-white! z-10 bottom-7 left-5 text-[20px]! text-(--acc-c)! px-2! py-0! border-0! shadow-none! outline-0!">
          Password
        </p>
      </div>
      <div className="flex flex-row justify-end items-center w-full gap-4">
        <span
          className="hover:text-blue-700 cursor-pointer"
          onClick={handleRegister}
        >
          Register
        </span>
        <Button
          className="text-lg hover:shadow-sm border-2 border-black shadow-amber-500 hover:bg-(--acc-c) cursor-pointer"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
      <span className="border-b-2 w-full"></span>
      <div className="w-full px-3">
        <Login text="Login with Google" />
      </div>
    </div>
  );
};

export default LoginModal;
