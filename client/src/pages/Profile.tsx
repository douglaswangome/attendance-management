import React from "react";
import { useSelector } from "react-redux";
import { InitialState } from "../util/types";
import { useLocation } from "react-router-dom";
import { BsPerson, BsPersonBadge, BsPersonGear } from "react-icons/bs";

const Profile: React.FC = () => {
	const _id = useLocation().pathname.split("/")[2];
	const { user } = useSelector((state: { slice: InitialState }) => state.slice);

	// const updateProfile = async () => {}
	return (
		<div className="w-[300px] flex flex-col items-center gap-2 border border-primary p-2">
			<div className="w-fit ml-auto text-lg">
				<BsPersonGear />
			</div>
			<div className="rounded-full flex items-center justify-center border dark:border-less-dark p-2">
				{user.role === "student" ? (
					<BsPerson className="dark:text-less-dark text-6xl" />
				) : (
					<BsPersonBadge className="dark:text-less-dark text-6xl" />
				)}
			</div>
			<div className="p-2 flex flex-col items-center w-fit">
				<span>Omuya Erick</span>
				<span className="text-xs">{user.email.address}</span>
			</div>
		</div>
	);
};

export default Profile;
