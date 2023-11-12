import { lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Header from "../components/Header";
// Pages
const UserLogin = lazy(() => import("../pages/Login"));
const UserRegister = lazy(() => import("../pages/Register"));
const Home = lazy(() => import("../pages/Home"));
const Class = lazy(() => import("../pages/Class"));

// Layouts
const AuthLayout = () => {
	return (
		<div className="transition-colors ease-linear dark:bg-dark dark:text-white">
			<div className="flex items-center justify-center flex-shrink-0 min-h-screen">
				<Outlet />
			</div>
		</div>
	);
};

const MainLayout = () => {
	return (
		<div className="flex flex-col min-h-screen dark:bg-dark dark:text-white">
			<Header />
			<div className="flex items-center justify-center flex-shrink-0 w-screenn">
				<Outlet />
			</div>
		</div>
	);
};

const routes = createBrowserRouter([
	{
		element: <AuthLayout />,
		children: [
			{ path: "/", element: <UserLogin /> },
			{ path: "/register", element: <UserRegister /> },
		],
	},
	{
		element: <MainLayout />,
		children: [
			{ path: "/home", element: <Home /> },
			{ path: "/class/:code/:date", element: <Class /> },
		],
	},
]);

export default routes;
