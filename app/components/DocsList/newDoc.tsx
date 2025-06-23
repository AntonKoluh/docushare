import { Plus } from "lucide-react";

export default function NewFile() {
  return (
    <button className="flex flex-row justify-center items-center gap-2 border-4 border-purple-900 px-6 py-3 rounded-md hover:bg-gray-700">
      <Plus />
      <p>New</p>
    </button>
  );
}
