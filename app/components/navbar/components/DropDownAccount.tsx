import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Logout } from "~/hooks/Logout";

type incomingProps = {
  displayName: string;
};

export default function DropDownAccount({ displayName }: incomingProps) {
  const navigate = useNavigate();
  function onLogout() {
    Logout();
    navigate(0);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-purple-800 p-3 rounded-full cursor-pointer text-xl text-gray-200 font-bold">
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
