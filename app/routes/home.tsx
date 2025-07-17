import Welcome from "~/components/welcome/welcome";
import Navbar from "~/components/navbar/navbar";
import { useEffect, useState } from "react";
import type { userType } from "~/types/accountType";
import { toast } from "sonner";
import DocList from "~/components/DocsList/DocList";

export function meta() {
  return [
    { title: "Welcome" },
    { name: "description", content: "Easy to share notes!" },
  ];
}

const Home = () => {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (storageFlag) {
      toast(storageFlag);
      localStorage.setItem("showToast", "");
    }
  }, []);

  if (loading)
    return (
      <div className="w-full h-full bg-black">
        <p className="text-4xl text-(--bg-acc-c) text-center">Loading....</p>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full bg-(--bg-c)/80">
      <Navbar user={user} />
      {user ? <DocList /> : <Welcome />}
    </div>
  );
};

export default Home;
