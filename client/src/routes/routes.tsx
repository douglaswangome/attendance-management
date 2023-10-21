import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
// Pages
const UserLogin = lazy(() => import("../pages/Login"));
const UserRegister = lazy(() => import("../pages/Register"));

const routes = createBrowserRouter([
  { path: "/", element: <UserLogin /> },
  {
    path: "/register",
    element: <UserRegister />,
  },
]);

export default routes;
