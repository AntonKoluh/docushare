import Welcome from "~/components/welcome/welcome";
import Navbar from "@/components/navbar/Navbar";
import { useEffect, useState } from "react";
import DocList from "~/components/DocsList/DocList";
import { loginCheck } from "~/helpers/helpers";
import SpinnerPageLoading from "~/components/ui/spinners/SpinnerPageLoading";
import type { userType } from "@/types/accountType";

const Home = () => {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loginCheck({ setUser, setLoading });
  }, []);

  if (loading) return <SpinnerPageLoading />;

  return (
    <div className="flex flex-col w-full h-full bg-(--bg-n)/80">
      <Navbar
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {user ? <DocList searchTerm={searchTerm} /> : <Welcome />}
    </div>
  );
};

export default Home;
