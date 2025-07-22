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
      className="w-full px-6 py-1.5 bg-black border-2 border-(--bg-c) rounded-md text-lg text-(--text-c) font-bold hover:bg-white hover:text-black cursor-pointer transition-all"
    >
      {text}
    </button>
  );
}
