import React, { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Toaster } from "react-hot-toast";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import { updateLocation } from "./store/slice";
import notify from "./util/notify";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLocation = () => {
      // Location Handling
      const success = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        dispatch(updateLocation({ latitude: latitude, longitude: longitude }));
      };
      const error = (error: GeolocationPositionError) => {
        notify(500, "Failed to fetch location");
        console.log(error);
      };
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      if (navigator.geolocation) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.geolocation.watchPosition(success, error, options);
          } else {
            notify(500, "Please enable location to get your attendance");
          }
        });
      }
    };

    const handleTheme = () => {
      // Theme Handling
      if (!localStorage.getItem("theme")) {
        const hour = moment().hour();
        if (hour < 6 || hour > 18) {
          localStorage.setItem("theme", "dark");
        } else {
          localStorage.setItem("theme", "light");
        }
      }

      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // handleLocation();
    handleTheme();
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
