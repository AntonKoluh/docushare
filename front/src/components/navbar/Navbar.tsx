import mainLogo from '../../../public/main-logo.svg'
import { Link } from "react-router";
import type { userType } from "~/types/accountType";
import DropDownAccount from "./components/DropDownAccount";
import LoginModal from "../loginModal/LoginModal";
import SearchList from '../DocsList/components/search';


type incomingProps = {
  user: userType | null;
  searchTerm: string | null;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>> | null;
};

const Navbar = ({ user, searchTerm, setSearchTerm }: incomingProps) => {
  const displayName = user
    ? user.first_name.slice(0, 1) + user.last_name.slice(0, 1)
    : null;
  
  

  return (
    <>
    <div className="bg-(--bg-navbar)/70  w-full flex">
      <nav className="flex flex-row justify-between items-center h-15 w-full max-w-7xl mx-auto px-2">
        <div>
          <Link
            to="/"
            className="flex flex-row justify-start items-center gap-2 w-full h-full text-(--text-c) text-[32px] font-semibold font-(family-name:--font-main)"
          >
            <img src={mainLogo} className="w-[34px] h-[39px] text-(--acc-c)" />
            Docs
          </Link>
        </div>
        {user && (
        <div>
          <span className="max-w-5xl z-50">
            <SearchList searchTerm={searchTerm} setSearch={setSearchTerm}/>
          </span>
        </div>
        )}
        <div className="flex flex-row gap-4 justify-around items-center">
          <Link
            to="/about"
            className="
              text-xl font-bold! text-(--text-c)! cursor-pointer relative before:content-[''] before:absolute 
              before:left-0 before:-bottom-1 before:w-0 before:h-[3px] before:bg-(--main-n) before:transition-all
              before:duration-300 hover:before:w-full font-(family-name:--font-main) z-0
              "
          >
            About
          </Link>
          {displayName ? (
            <DropDownAccount displayName={displayName.toUpperCase()} />
          ) : (
            <LoginModal text="Login" />
          )}
        </div>
      </nav>
    </div>
    </>
  );
};

export default Navbar;
