import React from "react";
import { NavLink } from "react-router-dom";
import { CustomLinkProps } from "../util/types";
import { BsPersonBadge, BsPerson } from "react-icons/bs";

const CustomLink: React.FC<CustomLinkProps> = (props) => {
	return (
		<NavLink
			to={props.to}
			className={({ isActive }) =>
				` ${isActive ? "text-primary" : ""} flex items-center gap-1`
			}
		>
			{props.text === "profile" ? (
				props.role === "student" ? (
					<BsPerson />
				) : (
					<BsPersonBadge />
				)
			) : null}
			<span className="capitalize">{props.text}</span>
		</NavLink>
	);
};

export default CustomLink;
