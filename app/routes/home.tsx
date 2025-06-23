import Welcome from "~/components/welcome/welcome";
import type { Route } from "./+types/home";
import Navbar from "~/components/navbar/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome" },
    { name: "description", content: "Easy to share notes!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full bg-[url(./coverbg.svg)] bg-center bg-no-repeat bg-cover">
      <Navbar />
      <Welcome />
    </div>
  );
}
