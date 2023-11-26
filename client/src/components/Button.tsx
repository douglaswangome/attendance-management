import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
	disabled?: boolean;
	hover?: boolean;
	icon: IconType;
	text: string;
	solid?: boolean;
	fn(): void;
	width?: string;
}

const Button: React.FC<ButtonProps> = ({
	disabled = false,
	hover = true,
	solid = false,
	width = "full",
	...props
}) => {
	return (
		<button
			className={`flex items-center justify-center gap-2 p-1 h-fit border border-black dark:border-less-dark rounded-lg capitalize disabled:opacity-40 disabled:cursor-not-allowed 
      ${width === "full" ? "w-full" : "w-fit"} 
      ${
				solid
					? `bg-black text-white dark:bg-less-dark ${
							hover && !disabled
								? "hover:bg-white hover:text-black dark:hover:text-white dark:hover:bg-transparent"
								: ""
					  }`
					: `${
							hover && !disabled
								? "hover:bg-black hover:text-white dark:hover:bg-lesser-dark"
								: ""
					  }`
			} transition-colors duration-300 ease-in-out`}
			disabled={disabled}
			onClick={props.fn}
		>
			<props.icon />
			<span>{props.text}</span>
		</button>
	);
};

export default Button;
