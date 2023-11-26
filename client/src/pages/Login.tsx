import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field"; // Component
import Button from "../components/Button"; // Component
import notify from "../util/notify"; // Component
import {
	BsBoxArrowInRight,
	BsEyeFill,
	BsEyeSlashFill,
	BsPersonCircle,
} from "react-icons/bs"; // Icons
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase auth method
import { auth } from "../util/firebase"; // Firebase auth
import { Credentials } from "../util/types"; // Types

const Login: React.FC = () => {
	const navigate = useNavigate();
	// Is Admin Flag
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	// Credentials
	const [credentials, setCredentials] = useState<Credentials>({
		username: "",
		email: "",
		password: "",
	});

	const handleUpdateCredentials = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		const { name, value } = event.target;
		setCredentials({ ...credentials, [name]: value });
	};

	const handleOnParentBlur = (): void => {
		if (credentials.username.split("-").length === 1) {
			setIsAdmin(true);
			setCredentials((prevCredentials) => {
				return {
					...prevCredentials,
					email: `${credentials.username}@mksu.ac.ke`.toLowerCase(),
				};
			});
		} else {
			setIsAdmin(false);
			setCredentials((prevCredentials) => {
				return {
					...prevCredentials,
					email: `${credentials.username}@student.mksu.ac.ke`.toLowerCase(),
				};
			});
		}
	};

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const handleShowPassword = (): void => {
		setShowPassword(true);
		setTimeout(() => setShowPassword(false), 2000);
	};

	const handleSubmit = async (): Promise<void> => {
		try {
			await signInWithEmailAndPassword(
				auth,
				credentials.email,
				credentials.password
			);
			navigate("/home");
			notify(
				200,
				"Sign In successful. Welcome to Class Machakos Attendance Portal!"
			);
		} catch (error) {
			notify(500, "Sign In failed. Please try again!");
		}
	};

	useEffect(() => {
		if (auth.currentUser === null) {
			return;
		}
		navigate("/home");
	}, []);

	return (
		<div className="flex flex-col gap-2 p-4 mx-2 border border-black rounded-lg w-fit dark:border-lesser-dark">
			<span className="font-bold" onClick={() => setIsAdmin(!isAdmin)}>
				Login to Machakos Attendance Portal | {isAdmin ? "Admin" : "Student"}
			</span>
			<div className="flex flex-col gap-2">
				<Field
					label="username"
					icon={BsPersonCircle}
					name="username"
					type="text"
					value={credentials.username}
					onChange={handleUpdateCredentials}
					parentOnBlur={handleOnParentBlur}
				/>
				<Field
					label="password"
					icon={showPassword ? BsEyeSlashFill : BsEyeFill}
					name="password"
					type={showPassword ? "text" : "password"}
					value={credentials.password}
					onChange={handleUpdateCredentials}
					changeShowPassword={handleShowPassword}
				/>
				<Button icon={BsBoxArrowInRight} text="Sign In" fn={handleSubmit} />
				<Link to="/register" className="underline cursor-pointer">
					Don't have an account? Sign Up.
				</Link>
			</div>
		</div>
	);
};

export default Login;
