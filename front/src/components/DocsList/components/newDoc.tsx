import { Plus } from "lucide-react";

export default function NewFile() {
  return (
    <button className="flex flex-row justify-center items-center gap-1 text-black! font-semibold hover:text-(--bg-n)! border-2 border-(--main-n) hover:border-black transition-all duration-150 px-4 py-1 rounded-md hover:bg-(--main-n) cursor-pointer">
      <Plus className="" />
      New
    </button>
  );
}
