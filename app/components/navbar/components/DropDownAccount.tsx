import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useLogout } from "~/hooks/useLogout";

type incomingProps = {
  displayName: string;
};

export default function DropDownAccount({ displayName }: incomingProps) {
  function onLogout() {
    useLogout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-purple-800 p-3 rounded-full cursor-pointer text-2xl text-gray-200 font-bold">
        {displayName}
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={25}>
        <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xl">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-xl"
          variant="destructive"
          onClick={onLogout}
        >
          <Link to="/">Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
