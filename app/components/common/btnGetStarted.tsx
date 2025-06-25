import clsx from "clsx";
import GoogleLogin from "~/auth/login";
import useLogin from "~/auth/login";

export default function GetStartedBtn() {
  return (
    // <button className={clsx("btn", "primary")} onClick={useLogin}>
    //   Get Started
    // </button>
    <GoogleLogin />
  );
}
