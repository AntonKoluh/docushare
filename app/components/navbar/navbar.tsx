import { BookOpenText } from "lucide-react";
import { Link } from "react-router";
import type { userType } from "~/types/accountType";
import DropDownAccount from "./components/DropDownAccount";
import Login from "~/auth/login";

type incomingProps = {
  user: userType | null;
};

const Navbar = ({ user }: incomingProps) => {
  const displayName = user
    ? user.first_name.slice(0, 1) + user.last_name.slice(0, 1)
    : null;

  return (
    <div className="bg-(--bg-acc-c)/50  w-full shadow-2xl">
      <nav className="flex flex-row justify-between items-center h-18 w-full max-w-7xl mx-auto">
        <div>
          <Link
            to="/"
            className="flex flex-row justify-start items-center gap-2 w-full h-full text-(--text-c) text-4xl font-bold"
          >
            <BookOpenText className="size-10 h-full text-(--acc-c)" />
            Docs
          </Link>
        </div>
        <div>
          {/* <p className="text-2xl text-red-600" onClick={handleCheckLogin}>
            Test
          </p> */}
        </div>
        <div>
          {displayName ? (
            <DropDownAccount displayName={displayName} />
          ) : (
            <Login text="Login" />
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
