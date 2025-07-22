import { toast } from "sonner";
import type { userType } from "~/types/accountType";

const generateUID = (length = 16) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};

type loginCheckTypes = {
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const loginCheck = ({ setUser, setLoading }: loginCheckTypes) => {
  const storedUser = localStorage.getItem("user");
  try {
    const parsed = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsed);
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
  const storageFlag = localStorage.getItem("showToast");
  if (storageFlag) {
    toast(storageFlag);
    localStorage.setItem("showToast", "");
  }
};

export { generateUID, loginCheck };
