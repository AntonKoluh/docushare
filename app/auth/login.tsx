import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import type { userType } from "~/types/accountType";

type incomingProps = {
  text: string;
};

export default function Login({ text }: incomingProps) {
  const handleRedirectLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "openid email profile";

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&prompt=select_account`;
    console.log("Redirecting to:", authUrl);
    window.location.href = authUrl;
    console.log("Redirecting to:", authUrl);
  };

  return (
    <button
      onClick={() => handleRedirectLogin()}
      className="text-gray-100 cursor-pointer bg-purple-800 p-2 border-2 border-black rounded-md text-2xl"
    >
      {text}
    </button>
  );
}
