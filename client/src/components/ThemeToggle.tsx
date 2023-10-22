import React from "react";
import { BsMoon, BsSunFill } from "react-icons/bs";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <div
      className="border rounded-2xl border-lesser-dark w-[60px]"
      onClick={changeTheme}
    >
      <div
        className={`grid place-items-center h-[30px] w-[30px] bg-primary text-white dark:bg-less-dark dark:text-primary rounded-full ${
          theme === "dark" ? "mr-0 ml-[30px]" : "ml-0 mr-[30px]"
        } transition-all duration-300 ease-linear`}
      >
        {theme === "dark" ? <BsMoon /> : <BsSunFill />}
      </div>
    </div>
  );
};

export default ThemeToggle;
