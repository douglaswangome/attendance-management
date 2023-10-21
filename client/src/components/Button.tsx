import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  icon: IconType;
  text: string;
  solid?: boolean;
  fn(): void;
}

const Button: React.FC<ButtonProps> = ({ solid = false, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 p-1 border border-black rounded-lg ${
        solid
          ? "bg-black text-white hover:bg-white hover:text-black"
          : "hover:bg-black hover:text-white"
      } transition-colors duration-300 ease-in-out`}
      onClick={props.fn}
    >
      <props.icon />
      <span>{props.text}</span>
    </button>
  );
};

export default Button;
