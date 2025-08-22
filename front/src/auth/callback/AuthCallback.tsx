import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthCallback() {
  const navigate = useNavigate();
  console.log(import.meta.env.VITE_DEBUG)
  const baseUrl = import.meta.env.VITE_DEBUG === "True" ? import.meta.env.VITE_BACKEND_URL_DEBUG : import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    const handleRedirectSuccess = async () => {
      const res = await fetch(baseUrl + "/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: code }),
      });

      const data = await res.json();
      setLoginStorage(
        data.access_token,
        data.refresh_token,
        JSON.stringify(data.user)
      );

      navigate("/"); // or home/dashboard
    };

    handleRedirectSuccess();
  }, []);

  return <p className="text-white text-xl">Logging you in...</p>;
}

export function setLoginStorage(access: string, refresh: string, user: string) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("user", user);
  localStorage.setItem("showToast", "Logged in successfully");
}
