import { toast } from "sonner";

export function useLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  localStorage.setItem("showToast", "logout");
  window.location.reload();
  return { status: 1, msg: "Loggged out successfully." };
}
