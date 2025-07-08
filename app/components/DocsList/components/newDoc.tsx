import { Plus } from "lucide-react";

export default function NewFile() {
  return (
    <button className="flex flex-row justify-center items-center gap-2 border-4 border-purple-900 px-6 py-3 rounded-md hover:bg-(--bg-c) shadow-xl hover:shadow-2xl cursor-pointer">
      <Plus className="text-(--bg-acc-c)" />
      <p className="text-(--bg-acc-c)!">New</p>
    </button>
  );
}
