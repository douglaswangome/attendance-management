import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
// Pages
const UserLogin = lazy(() => import("../pages/Login"));

const routes = createBrowserRouter([{ path: "/", element: <UserLogin /> }]);

export default routes;
