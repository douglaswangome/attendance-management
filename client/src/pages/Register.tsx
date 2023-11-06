import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/Field";
import Button from "../components/Button";
import {
	BsBoxArrowInRight,
	BsCheckCircle,
	BsEnvelopeFill,
	BsEyeFill,
	BsPersonCircle,
	BsPersonBadge,
	BsXCircle,
} from "react-icons/bs";
import notify from "../util/notify";
import usePasswordCheck from "../util/hooks/usePasswordCheck";

interface RegisterCredentials {
	username: string;
	role: string;
	email: string;
	password: string;
}

const Register: React.FC = () => {
	// Credentials
	const [credentials, setCredentials] = useState<RegisterCredentials>({
		username: "",
		role: "",
		email: "",
		password: "",
	});

	const handleUpdateCredentials = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		setCredentials({ ...credentials, [name]: value });
	};

	const handleOnParentBlur = () => {
		if (credentials.email) {
			setCredentials({
				...credentials,
				username: credentials.email.split("@")[0],
				role: credentials.email.split("@")[1].split(".")[0],
			});
		}
	};

	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const handleShowPassword = () => {
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

	const handlePasswordFocusHandling = () => {
		setPasswordHandling((prevPasswordHandling) => {
			return {
				...prevPasswordHandling,
				focus: true,
			};
		});
	};

	const handleSubmit = () => {
		if (usePasswordCheck(credentials.password).length > 0) {
			notify(500, "Password is not strong enough");
		} else {
			notify(200, "Registration Successful");
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
	}, [credentials.password, confirmPassword]);

	return (
		<div className="p-4 mx-2 border border-black w-fit rounded-lg dark:border-lesser-dark">
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
							className={`absolute left-0 flex flex-col w-full px-2 divide-y divide-black top-full divide-dashed bg-white z-[3]  rounded-lg mt-1 text-sm capitalize ${
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
							<span className="text-black">Password is strong enough!</span>
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
								<span className="text-black">Passwords do not match!</span>
							</div>
						) : (
							<div className="flex items-center gap-1 text-xs text-green-600">
								<BsCheckCircle />
								<span className="text-black">Passwords match!</span>
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
