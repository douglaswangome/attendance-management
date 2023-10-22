import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/Field";
import Button from "../components/Button";
import { BsBoxArrowInRight, BsEyeFill, BsPersonCircle } from "react-icons/bs";
import notify from "../util/notify";

interface LoginCredentials {
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
  const [credentials, setCredentials] = useState<LoginCredentials>({
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
    <div className="flex flex-col gap-2 p-4 mx-2 border border-black rounded-lg dark:border-lesser-dark">
      <span className="font-bold">
        Login to Machakos Attendance Portal | {isAdmin ? "Admin" : "Student"}
      </span>
      <div className="flex gap-1">
        <span className="underline cursor-pointer" onClick={handleIsAdmin}>
          Click
        </span>
        <span>to change role</span>
      </div>
      <div className="flex flex-col gap-2">
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
        <Button icon={BsBoxArrowInRight} text="Sign In" fn={handleSubmit} />
        <Link to="/register" className="underline cursor-pointer">
          Don't have an account? Sign Up.
        </Link>
      </div>
    </div>
  );
};

export default Login;
