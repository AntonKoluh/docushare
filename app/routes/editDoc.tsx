import { useEffect, useState } from "react";
import type { Route } from "./+types/editDoc";
import SimpleRichTextEditor from "~/components/edit/editHero";
import EditorNavBar from "~/components/navbar/EditorNavBar";
import { useParams } from "react-router";

const data = {
  id: 1,
  filename: "my dummy file",
  content: "This is a dummy file to insert.",
};

type dataType = {
  id: number;
  filename: string;
  content: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit" },
    { name: "description", content: "Easy to share notes!" },
  ];
}

export default function FileListRoute() {
  const [doc, setDoc] = useState<dataType | null>(null);
  const { id } = useParams<{ id: string | undefined }>();
  useEffect(() => {
    setDoc(null);
    // real data retrieval goes in here
    if (id) {
      setDoc(data);
    }
  }, [id]);
  return (
    <div className="flex flex-col w-full h-full bg-gray-200 bg-center bg-no-repeat bg-cover">
      <EditorNavBar filename={doc?.filename} />
      <SimpleRichTextEditor content={doc?.content} />
    </div>
  );
}
