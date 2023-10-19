import React, { useState } from "react";
import Field from "../components/Field";
import Button from "../components/Button";
import { BsBoxArrowInRight, BsEyeFill, BsPersonCircle } from "react-icons/bs";
import notify from "../util/notify";

interface AdminLoginCredentials {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  // Is Admin Flag
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const handleIsAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  // Credentials
  const [credentials, setCredentials] = useState<AdminLoginCredentials>({
    username: "",
    password: "",
  });

  const handleUpdateCredentials = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 2000);
  };

  const handleSubmit = () => {
    if (isAdmin) {
      // Admin Login
      notify(200, "Admin Login Successful");
    } else {
      // Student Login
      notify(200, "Student Login Successful");
    }
  };

  return (
    <div className="flex items-center w-[90%] p-2 max-[750px]:flex-col">
      <img
        className="object-contain w-1/2 max-[750px]:w-full"
        src="/images/classroom.png"
        alt="classroom"
      />
      <div className="flex flex-col w-1/2 gap-2 max-[750px]:w-full">
        <span className="font-bold">
          Login to Machakos Attendance Portal | {isAdmin ? "Admin" : "Student"}
        </span>
        <div className="flex gap-1">
          <span className="underline cursor-pointer" onClick={handleIsAdmin}>
            Click
          </span>
          <span>to change role</span>
        </div>
        <Field
          label="username"
          icon={BsPersonCircle}
          name="username"
          type="text"
          value={credentials.username}
          onChange={handleUpdateCredentials}
        />
        <Field
          label="password"
          icon={BsEyeFill}
          name="password"
          type={showPassword ? "text" : "password"}
          value={credentials.password}
          onChange={handleUpdateCredentials}
          changeShowPassword={handleShowPassword}
        />
        <Button
          icon={BsBoxArrowInRight}
          text="Sign In"
          solid={false}
          fn={handleSubmit}
        />
        <span className="underline cursor-pointer">
          Don't have an account? Create one.
        </span>
      </div>
    </div>
  );
};

export default Login;
