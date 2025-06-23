import clsx from "clsx";
import GoogleLogin from "~/scripts/login";
import useLogin from "~/scripts/login";

export default function GetStartedBtn() {
  return (
    // <button className={clsx("btn", "primary")} onClick={useLogin}>
    //   Get Started
    // </button>
    <GoogleLogin />
  );
}
