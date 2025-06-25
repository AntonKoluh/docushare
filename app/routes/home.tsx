import Welcome from "~/components/welcome/welcome";
import type { Route } from "./+types/home";
import Navbar from "~/components/navbar/navbar";
import { useEffect, useState } from "react";
import type { userType } from "~/types/accountType";
import useGetData from "~/hooks/useGetData";
import { useNavigate } from "react-router";
import FileList from "~/components/DocsList/DocsList";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome" },
    { name: "description", content: "Easy to share notes!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);
  const getData = useGetData();

  const handleCheckLogin = async () => {
    const result = await getData("test/");
    console.log("result: " + result.success);
  };

  useEffect(() => {
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
    if (storageFlag === "login") {
      toast("Logged in successfully");
      localStorage.removeItem("showToast");
    } else if (storageFlag === "logout") {
      toast("Logged out successfully");
      localStorage.removeItem("showToast");
    }
  }, []);

  if (loading)
    return (
      <div className="w-full h-full bg-black">
        <p className="text-4xl text-gray-200 text-center">Loading....</p>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full bg-[url(/coverbg.svg)] bg-center bg-no-repeat bg-cover">
      <Navbar user={user} />
      {user ? <FileList /> : <Welcome handleCheckLogin={handleCheckLogin} />}
    </div>
  );
}
