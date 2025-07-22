import Welcome from "~/components/welcome/welcome";
import Navbar from "~/components/navbar/navbar";
import { useEffect, useState } from "react";
import DocList from "~/components/DocsList/DocList";
import { loginCheck } from "~/helpers/helpers";
import SpinnerPageLoading from "~/components/ui/spinners/SpinnerPageLoading";
import type { userType } from "@/types/accountType";

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
    loginCheck({ setUser, setLoading });
  }, []);

  if (loading) return <SpinnerPageLoading />;

  return (
    <div className="flex flex-col w-full h-full bg-(--bg-c)/80">
      <Navbar user={user} />
      {user ? <DocList /> : <Welcome />}
    </div>
  );
};

export default Home;
