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
      className="px-6 py-1.5 bg-(--text-acc-c) border-2 border-(--bg-c) rounded-md text-lg text-(--bg-acc-c) font-bold hover:bg-(--acc-c) cursor-pointer hover:shadow-lg hover:shadow-amber-400 transition-all"
    >
      {text}
    </button>
  );
}
