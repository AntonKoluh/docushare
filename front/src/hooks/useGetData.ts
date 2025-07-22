import { Logout } from "../helpers/Logout";
import { useNavigate } from "react-router";
import { useCallback } from "react";

export default function useGetData() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const authFetch = useCallback(
    async (endpoint: string) => {
      const access_token = localStorage.getItem("access");
      const refresh_token = localStorage.getItem("refresh");
      const hasLogged = !access_token || !refresh_token ? false : true;
      const res = await fetch(baseUrl + "/api/" + endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(hasLogged ? { Authorization: "Bearer " + access_token } : {}),
        },
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
          return authFetch(endpoint);
        }
      }
      if (res.status === 200) {
        const data = await res.json();
        return { success: true, data };
      } else if (res.status === 401) {
        Logout();
        navigate("/");
        return { success: false, msg: "Please login." };
      } else {
        navigate("/");
        return { success: false, msg: "Please login." };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );
  return authFetch;
}
