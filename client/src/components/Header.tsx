import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useSelector } from "react-redux";
import { InitialState } from "../store/slice";

interface HeaderProps {
  page: "authentication" | "home";
}

const Header: React.FC<HeaderProps> = ({ page = "home" }) => {
  const { user } = useSelector((state: { slice: InitialState }) => state.slice);

  return (
    <div
      className={`flex items-center bg-transparent w-full h-[70px] px-2 ${
        page === "authentication" ? "justify-end" : "justify-between"
      }`}
    >
      {page === "home" ? (
        <>
          <Link className="flex items-center gap-2" to="/home">
            <img
              className="object-contain h-[40px]"
              src="/logo.png"
              alt="mksu-logo"
            />
            <div className="flex flex-col uppercase">
              <span className="font-bold">machakos university</span>
              <span className="text-[10px]">
                class attendance | {user.role}
              </span>
            </div>
          </Link>
          <div>
            <ThemeToggle />
          </div>
        </>
      ) : (
        <ThemeToggle />
      )}
    </div>
  );
};

export default Header;
