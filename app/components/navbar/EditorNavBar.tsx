import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import DropDownFile from "./components/DropDownFile";
import DropDownSocial from "./components/DropDownSocial";
import DropDownAI from "./components/DropDownAI";

type incomingProps = {
  filename: string | undefined;
};

export default function EditorNavBar({ filename }: incomingProps) {
  const fileNameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.value = filename ? filename : "New Document";
    }
  }, [filename]);
  return (
    <div className="h-fit sticky w-full bg-gray-100 flex flex-col justify-center items-center text-black">
      <div className="mx-auto max-w-7xl w-full">
        <div className="w-full text-left text-2xl font-bold px-1 my-1">
          <input
            ref={fileNameRef}
            type="text"
            name="fileName"
            id="fileName"
            className="focus:outline-0"
          />
        </div>
        <div className="flex justify-center items-center w-full border-t-2 border-t-gray-500">
          <ul className="list-none flex flex-row justify-start items-center w-full gap-2 bg-gray-100">
            <li className="text-xl px-2 py-1 hover:bg-gray-400 cursor-pointer">
              <DropDownFile />
            </li>
            <li className="text-xl px-2 py-1 hover:bg-gray-400 cursor-pointer">
              <DropDownSocial />
            </li>
            <li className="text-xl px-2 py-1 hover:bg-gray-400 cursor-pointer font-bold">
              <DropDownAI />
            </li>
            <li className="bg-black text-xl px-2 rounded-md ml-auto text-white hover:bg-gray-400 cursor-pointer hover:text-black">
              <Link to="/">Back</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
