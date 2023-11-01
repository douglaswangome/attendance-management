import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  hover?: boolean;
  icon: IconType;
  text: string;
  solid?: boolean;
  fn(): void;
}

const Button: React.FC<ButtonProps> = ({
  hover = true,
  solid = false,
  ...props
}) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 p-1 border border-black dark:border-less-dark rounded-lg w-full ${
        solid
          ? `bg-black text-white dark:bg-less-dark ${
              hover
                ? "hover:bg-white hover:text-black dark:hover:text-white dark:hover:bg-transparent"
                : ""
            }`
          : `${
              hover
                ? "hover:bg-black hover:text-white dark:hover:bg-lesser-dark"
                : ""
            }`
      } transition-colors duration-300 ease-in-out`}
      onClick={props.fn}
    >
      <props.icon />
      <span>{props.text}</span>
    </button>
  );
};

export default Button;
