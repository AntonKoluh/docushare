import Welcome from "~/components/welcome/welcome";
import Navbar from "@/components/navbar/Navbar";
import { useEffect, useState } from "react";
import type { userType } from "~/types/accountType";
import { loginCheck } from "~/helpers/helpers";
import ProfileSettings from "~/components/settings/ProfileSettings";

export function meta() {
  return [
    { title: "Settings" },
    { name: "description", content: "Easy to share notes!" },
  ];
}

const Settings = () => {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loginCheck({ setUser, setLoading });
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
      {user ? <ProfileSettings /> : <Welcome />}
    </div>
  );
};

export default Settings;
