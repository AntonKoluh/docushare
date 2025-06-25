import { BookOpenText } from "lucide-react";
import styles from "./navbar.module.css";
import { Link } from "react-router";
import type { userType } from "~/types/accountType";
import DropDownAccount from "./components/dropDownAccount";
import { useEffect, useState } from "react";
import Login from "~/scripts/login";

type incomingProps = {
  user: userType | null;
};

export default function Navbar({ user }: incomingProps) {
  const displayName = user
    ? user.first_name.slice(0, 1) + user.last_name.slice(0, 1)
    : null;
  return (
    <div className="bg-[rgba(0,0,0,0.5)] w-full">
      <nav className="flex flex-row justify-between items-center h-24 w-full max-w-7xl mx-auto">
        <div>
          <Link
            to="/"
            className="flex flex-row justify-start items-center gap-2 w-full h-full text-gray-200 text-4xl font-bold"
          >
            <BookOpenText className="size-10 h-full" />
            Docs
          </Link>
        </div>
        <div>
          {displayName ? (
            <DropDownAccount displayName={displayName} />
          ) : (
            <p className={styles.link}>
              <Login text="Login" />
            </p>
          )}
        </div>
      </nav>
    </div>
  );
}
