import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google access_token:", tokenResponse.access_token);

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
      console.log("Access:", data.access_token);
      console.log("Refresh:", data.refresh_token);
      console.log("User:", data.user);
    },
    onError: () => console.log("Login Failed"),
    flow: "implicit", // required for frontend-only OAuth
    scope: "openid email profile",
  });

  return <button onClick={() => login()}>Sign in with Google</button>;
}
