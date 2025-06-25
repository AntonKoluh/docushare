import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import type { userType } from "~/types/accountType";

type incomingProps = {
  text: string;
};

export default function Login({ text }: incomingProps) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch(baseUrl + "/auth/google/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: tokenResponse.access_token,
        }),
      });

      const data = await res.json();
      localStorage.setItem("access", data.access_token);
      localStorage.setItem("refresh", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("showToast", "login");
      window.location.reload();
    },
    onError: () => console.log("Login Failed"),
    flow: "implicit", // required for frontend-only OAuth
    scope: "openid email profile",
  });

  return (
    <button
      onClick={() => login()}
      className="text-gray-100 cursor-pointer bg-purple-800 p-2 border-2 border-black rounded-md text-2xl"
    >
      {text}
    </button>
  );
}
