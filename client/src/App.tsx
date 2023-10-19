import React from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center flex-shrink-0 w-screen h-screen overflow-y-scroll">
      <Toaster toastOptions={{ duration: 2000 }} />
      <RouterProvider router={routes} />
    </div>
  );
};

export default App;
