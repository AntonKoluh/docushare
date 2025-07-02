import { Logout } from "./Logout";
import { useNavigate } from "react-router";
import { useCallback } from "react";

export default function usePostData() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const authFetch = useCallback(
    async (endpoint: string, data: any) => {
      const access_token = localStorage.getItem("access");
      const refresh_token = localStorage.getItem("refresh");
      const res = await fetch(baseUrl + "/api/" + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401 && refresh_token) {
        const refresh = await fetch(baseUrl + "/api/token/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refresh_token }),
        });
        const refreshData = await refresh.json();
        if (refresh.status === 200) {
          localStorage.setItem("access", refreshData.access);
          localStorage.setItem("refresh", refreshData.refresh);
          return authFetch(endpoint, data);
        }
      }
      if (res.status === 200) {
        const data = await res.json();
        return { success: true, data };
      } else {
        Logout();
        navigate("/");
        return { success: false, msg: "Please login." };
      }
    },
    [navigate]
  );
  return authFetch;
}
