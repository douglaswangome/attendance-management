import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";

interface FieldProps {
	label: string;
	icon: IconType;
	name: string;
	type: string;
	value: string;
	onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
	changeShowPassword?(): void;
	readOnly?: boolean;
	parentOnBlur?(): void;
	placeholder?: string;
}

const Field: React.FC<FieldProps> = ({
	onChange = null,
	readOnly = false,
	parentOnBlur = null,
	placeholder = "",
	...props
}) => {
	const [isFocused, setIsFocused] = useState<boolean>(readOnly);
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

	useEffect(() => {
		if (!readOnly && props.value) {
			setIsFocused(true);
		}
	}, [props.value]);

	return (
		<div
			className={`relative flex items-end h-[38px] focus-within:h-[68px] ${
				readOnly ? "h-[68px]" : ""
			} ${
				props.value ? "h-[68px]" : ""
			} transition-[height] duration-300 ease-in-out`}
			onBlur={parentOnBlur === null ? () => {} : parentOnBlur}
		>
			<div
				className={`absolute top-[50%] flex items-center gap-1 capitalize ${
					isFocused ? "-translate-y-[125%] left-0" : "-translate-y-[50%] left-1"
				} transition-[transform] duration-300 ease-in-out z-[2]`}
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
			<div className="relative flex items-center w-full">
				<input
					className={`w-full px-2 py-1 bg-transparent border border-black dark:border-less-dark rounded-lg group focus:outline-none ${
						readOnly && "cursor-not-allowed"
					}`}
					name={props.name}
					value={props.value}
					onChange={onChange === null ? () => {} : onChange}
					type={props.type}
					onFocus={readOnly ? () => {} : handleFocus}
					onBlur={readOnly ? () => {} : handleBlurFocus}
					readOnly={readOnly}
					placeholder={placeholder}
				/>
			</div>
		</div>
	);
};

export default Field;
