export function Logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  localStorage.setItem("showToast", "Logged out successfully");
}
