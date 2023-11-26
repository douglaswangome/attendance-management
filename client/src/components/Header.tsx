import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useSelector } from "react-redux";
import { InitialState } from "../util/types";
import { auth } from "../util/firebase";
import { signOut } from "firebase/auth";
import CustomLink from "./CustomLink";
import notify from "../util/notify";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useSelector((state: { slice: InitialState }) => state.slice);

	const handleSignOut = (): void => {
		signOut(auth);
		navigate("/");
	};

	useEffect(() => {
		if (!user.hasOwnProperty("department") || !user.hasOwnProperty("school")) {
			notify(200, "Please complete your profile");
			navigate("/profile");
		}
	}, [user]);

	return (
		<div
			className={`flex items-center bg-transparent w-full h-[70px] px-2 mb-2 justify-between`}
		>
			<Link className="flex items-center gap-2" to="/home">
				<img
					className="object-contain h-[40px]"
					src="/logo.png"
					alt="mksu-logo"
				/>
				<div className="flex flex-col uppercase">
					<span className="font-bold">machakos university</span>
					<span className="text-[10px]">class attendance | {user.role}</span>
				</div>
			</Link>
			<div className="flex items-center gap-5">
				<CustomLink to="/home" text="home" />
				<CustomLink to="/history" text="history" />
				<CustomLink
					to={`/profile/${user._id}`}
					text="profile"
					role={user.role}
				/>
				<div className="ml-5">
					<ThemeToggle />
				</div>
			</div>
		</div>
	);
};

export default Header;
