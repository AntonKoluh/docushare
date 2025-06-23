export function useLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  return { status: 1, msg: "Loggged out successfully." };
}
