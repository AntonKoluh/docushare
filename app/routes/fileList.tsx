import Navbar from "~/components/navbar/navbar";
import type { Route } from "./+types/fileList";
import FileList from "~/components/DocsList/DocsList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome" },
    { name: "description", content: "Easy to share notes!" },
  ];
}

export default function FileListRoute() {
  return (
    <div className="flex flex-col w-full h-full bg-[url(./coverbg.svg)] bg-center bg-no-repeat bg-cover">
      <Navbar />
      <FileList />
    </div>
  );
}
