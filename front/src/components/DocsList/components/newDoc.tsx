import { Plus } from "lucide-react";

export default function NewFile() {
  return (
    <button className="flex flex-row justify-center items-center gap-1 border-2 border-purple-900 px-4 py-1 rounded-md hover:bg-(--bg-c) shadow-xl hover:shadow-2xl cursor-pointer">
      <Plus className="text-(--bg-acc-c)" />
      <p className="text-(--bg-acc-c)!">New</p>
    </button>
  );
}
