import React from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  page: "authentication" | "home";
}

const Header: React.FC<HeaderProps> = ({ page = "home" }) => {
  return (
    <div
      className={`flex items-center bg-transparent w-full h-[70px] px-2 ${
        page === "authentication" ? "justify-end" : "justify-normal"
      }`}
    >
      <ThemeToggle />
    </div>
  );
};

export default Header;
