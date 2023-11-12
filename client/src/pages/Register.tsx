import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // React Router
import Field from "../components/Field"; // Component
import Button from "../components/Button"; // Component
import notify from "../util/notify"; // Component
import {
	BsBoxArrowInRight,
	BsCheckCircle,
	BsEnvelopeFill,
	BsEyeFill,
	BsPersonCircle,
	BsPersonBadge,
	BsXCircle,
} from "react-icons/bs"; // Icons
import usePasswordCheck from "../util/hooks/usePasswordCheck"; // Custom hook to check password strength
import { auth } from "../util/firebase"; // Firebase auth
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	signOut,
} from "firebase/auth"; // Firebase auth method
import { api } from "../App"; // Axios instance

interface RegisterCredentials {
	username: string;
	role: string;
	email: string;
	password: string;
}

const Register: React.FC = () => {
	const navigate = useNavigate();
	// Credentials
	const [credentials, setCredentials] = useState<RegisterCredentials>({
		username: "",
		role: "",
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
		const role = credentials.email.split("@")[1].split(".")[0];

		if (credentials.email) {
			setCredentials({
				...credentials,
				username: credentials.email.split("@")[0],
				role: role === "mksu" ? "admin" : "student",
			});
		}
	};

	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const handleShowPassword = (): void => {
		setShowPassword(true);
		setTimeout(() => setShowPassword(false), 2000);
	};
	const [passwordHandling, setPasswordHandling] = useState<{
		errors: boolean;
		focus: boolean;
		match: boolean;
	}>({
		errors: true,
		focus: false,
		match: false,
	});

	const handlePasswordFocusHandling = (): void => {
		setPasswordHandling((prevPasswordHandling) => {
			return {
				...prevPasswordHandling,
				focus: true,
			};
		});
	};

	const handleSubmit = async (): Promise<void> => {
		if (usePasswordCheck(credentials.password).length > 0) {
			notify(500, "Password is not strong enough");
		} else {
			try {
				const { user } = await createUserWithEmailAndPassword(
					auth,
					credentials.email,
					credentials.password
				);
				await sendEmailVerification(user);
				await api.post("/add_user", {
					user: {
						username: credentials.username,
						role: credentials.role,
						email: { address: user.email, verified: user.emailVerified },
					},
				});
				await signOut(auth);
				navigate("/");
				notify(200, "Sign Up successful. Please verify your email.");
			} catch (error) {
				console.log(error);
				notify(500, "Sign Up failed. Please try again!");
			}
		}
	};

	useEffect(() => {
		if (usePasswordCheck(credentials.password).length > 0) {
			setPasswordHandling((prevPasswordHandling) => {
				return {
					...prevPasswordHandling,
					errors: true,
				};
			});
		} else {
			setPasswordHandling((prevPasswordHandling) => {
				return {
					...prevPasswordHandling,
					errors: false,
				};
			});
		}
	}, [credentials.password]);

	useEffect(() => {
		if (credentials.password !== "") {
			if (credentials.password === confirmPassword) {
				setPasswordHandling((prevPasswordHandling) => {
					return {
						...prevPasswordHandling,
						match: true,
					};
				});
			} else {
				setPasswordHandling((prevPasswordHandling) => {
					return {
						...prevPasswordHandling,
						match: false,
					};
				});
			}
		}
	}, [confirmPassword]);

	return (
		<div className="p-4 mx-2 border border-black rounded-lg w-fit dark:border-lesser-dark">
			<span className="font-bold">Register to Machakos Attendance Portal</span>
			<div className="flex flex-col gap-2">
				<Field
					label="username"
					icon={BsPersonCircle}
					name="username"
					type="text"
					value={credentials.username}
					readOnly
					placeholder="Do not edit this field"
				/>
				<Field
					label="role"
					icon={BsPersonBadge}
					name="role"
					type="text"
					value={credentials.role}
					readOnly
					placeholder="Do not edit this field"
				/>
				<Field
					label="email"
					icon={BsEnvelopeFill}
					name="email"
					type="email"
					value={credentials.email}
					onChange={handleUpdateCredentials}
					parentOnBlur={handleOnParentBlur}
				/>
				<div
					className="relative"
					onFocus={handlePasswordFocusHandling}
					onBlur={handlePasswordFocusHandling}
				>
					<Field
						label="password"
						icon={BsEyeFill}
						name="password"
						type={showPassword ? "text" : "password"}
						value={credentials.password}
						onChange={handleUpdateCredentials}
						changeShowPassword={handleShowPassword}
					/>
					{passwordHandling.errors ? (
						<div
							className={`absolute left-0 flex flex-col w-full px-2 divide-y divide-black dark:divide-less-dark top-full divide-dashed bg-white dark:bg-dark dark:border-less-dark z-[3]  rounded-lg mt-1 text-sm capitalize ${
								passwordHandling.focus
									? "h-fit border border-black opacity-100 pointer-events-auto"
									: "h-0 opacity-0 pointer-events-none"
							}`}
						>
							{usePasswordCheck(credentials.password).map((error, index) => (
								<span key={index}>{error}</span>
							))}
						</div>
					) : (
						<div className="flex items-center gap-1 text-xs text-green-600">
							<BsCheckCircle />
							<span className="text-black dark:text-white">
								Password is strong enough!
							</span>
						</div>
					)}
				</div>
				<div>
					<Field
						label="confirm password"
						icon={BsEyeFill}
						name="confirmPassword"
						type={showPassword ? "text" : "password"}
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						changeShowPassword={handleShowPassword}
					/>
					{credentials.password !== "" &&
						(!passwordHandling.match ? (
							<div className="flex items-center gap-1 text-xs text-red-600">
								<BsXCircle />
								<span className="text-black dark:text-white">
									Passwords do not match!
								</span>
							</div>
						) : (
							<div className="flex items-center gap-1 text-xs text-green-600">
								<BsCheckCircle />
								<span className="text-black dark:text-white">
									Passwords match!
								</span>
							</div>
						))}
				</div>
				<Button
					icon={BsBoxArrowInRight}
					text="Sign Up"
					solid
					fn={handleSubmit}
				/>
				<Link to="/" className="underline cursor-pointer">
					Already have an account? Sign In
				</Link>
			</div>
		</div>
	);
};

export default Register;
