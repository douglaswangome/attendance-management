import React, { useState } from "react";
import { IconType } from "react-icons";

interface FieldProps {
  label: string;
  icon: IconType;
  name: string;
  type: string;
  value: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  changeShowPassword?(): void;
}

const Field: React.FC<FieldProps> = (props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlurFocus = () => {
    if (props.value) {
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
  };

  return (
    <div
      className={`relative flex items-end h-[38px] focus-within:h-[68px] ${
        props.value && "h-[68px]"
      } transition-all duration-300 ease-in-out`}
    >
      <div
        className={`absolute top-[50%] flex items-center gap-1 capitalize ${
          isFocused ? "-translate-y-[125%] left-0" : "-translate-y-[50%] left-1"
        } transition-all duration-300 ease-in-out z-[2]`}
      >
        {props.type === "password" ? (
          <div onClick={props.changeShowPassword}>
            <props.icon />
          </div>
        ) : (
          <div>
            <props.icon />
          </div>
        )}
        <label htmlFor={props.name}>{props.label}</label>
      </div>
      <input
        className="w-full px-2 py-1 bg-transparent border border-black rounded-lg group focus:outline-none"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        type={props.type}
        onFocus={handleFocus}
        onBlur={handleBlurFocus}
      />
    </div>
  );
};

export default Field;
