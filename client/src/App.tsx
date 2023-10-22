import React, { Suspense, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Toaster } from "react-hot-toast";
import moment from "moment";
import Header from "./components/Header";

const App: React.FC = () => {
  const [page, setPage] = useState<string>("home");

  useEffect(() => {
    // Theme Handling
    const hour = moment().hour();
    if (hour < 6 || hour > 18) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }

    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toaster
        toastOptions={{
          className:
            "dark:bg-dark dark:text-white shadow-round dark:shadow-lesser-dark",
          duration: 2000,
        }}
      />
      <RouterProvider router={routes} />
    </Suspense>
  );
};

export default App;
