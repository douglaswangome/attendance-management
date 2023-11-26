import React from "react";
import { useSelector } from "react-redux";
import { InitialState } from "../util/types";
import { useLocation, useNavigate } from "react-router-dom";
import {
	BsBoxArrowRight,
	BsPerson,
	BsPersonBadge,
	BsPersonGear,
} from "react-icons/bs";
import { auth } from "../util/firebase";
import { signOut } from "firebase/auth";
import notify from "../util/notify";
import Button from "../components/Button";

const Profile: React.FC = () => {
	const _id = useLocation().pathname.split("/")[2];
	const navigate = useNavigate();
	const { user } = useSelector((state: { slice: InitialState }) => state.slice);

	// const updateProfile = async () => {}

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			notify(200, "Signed out successfully");
			navigate("/");
		} catch (error) {
			console.log(error);
			notify(500, "Something went wrong, try again later");
		}
	};

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
			<Button icon={BsBoxArrowRight} text="Sign Out" fn={handleSignOut} />
		</div>
	);
};

export default Profile;
