import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Logout } from "~/helpers/Logout";

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
      <DropdownMenuTrigger className="bg-(--acc-c) p-3 rounded-full cursor-pointer text-lg text-(--text-c) font-bold w-10 h-10 hover:shadow-xl flex justify-center items-center">
        {displayName}
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={25}>
        <DropdownMenuLabel className="text-2xl w-full flex flex-row justify-start items-center gap-3">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/">
          <DropdownMenuItem className="text-xl cursor-pointer">
            Docs
          </DropdownMenuItem>
        </Link>
        <Link to="profile/">
          <DropdownMenuItem className="text-xl cursor-pointer">
            Settings
          </DropdownMenuItem>
        </Link>
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
