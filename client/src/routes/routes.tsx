import { lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Header from "../components/Header";
// Pages
const UserLogin = lazy(() => import("../pages/Login"));
const UserRegister = lazy(() => import("../pages/Register"));
const Home = lazy(() => import("../pages/Home"));
const Class = lazy(() => import("../pages/Class"));
const Summary = lazy(() => import("../pages/Summary"));
const Profile = lazy(() => import("../pages/Profile"));

// Layouts
const AuthLayout = () => {
	return (
		<div className="transition-colors ease-linear dark:bg-dark dark:text-white">
			<div className="flex items-center justify-center flex-shrink-0 h-screen">
				<Outlet />
			</div>
		</div>
	);
};

const MainLayout = () => {
	return (
		<div className="flex flex-col pb-4 dark:bg-dark dark:text-white min-h-screen">
			<Header />
			<div className="flex items-center justify-center flex-shrink-0 h-[calc(100%-72px)] ">
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
			{ path: "/history", element: <Summary /> },
			{ path: "/profile/:id", element: <Profile /> },
		],
	},
]);

export default routes;
