import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthCallback() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    console.log("google access: " + code);
    const handleRedirectSuccess = async () => {
      const res = await fetch(baseUrl + "/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: code }),
      });

      const data = await res.json();
      localStorage.setItem("access", data.access_token);
      localStorage.setItem("refresh", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("showToast", "login");

      navigate("/"); // or home/dashboard
    };

    handleRedirectSuccess();
  }, []);

  return <p className="text-white text-xl">Logging you in...</p>;
}
