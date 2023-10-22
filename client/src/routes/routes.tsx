import { lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Header from "../components/Header";
// Pages
const UserLogin = lazy(() => import("../pages/Login"));
const UserRegister = lazy(() => import("../pages/Register"));
// Layouts
const AuthLayout = () => {
  return (
    <div className="dark:bg-dark dark:text-white">
      <Header page="authentication" />
      <div className="flex items-center justify-center flex-shrink-0 w-screen h-[calc(100vh-70px)] overflow-y-scroll transition-colors duration-300 ease-in-out">
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
]);

export default routes;
