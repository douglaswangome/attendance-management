import React, { Suspense, useEffect } from "react";
// React Router Dom is a library for handling routes in React
// Routes is a custom component for handling routes in React
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
// React Hot Toast is a library for handling notifications
// Notify is a custom function for handling notifications
import { Toaster } from "react-hot-toast";
import notify from "./util/notify";
// Moment is a library for handling time in JS
import moment from "moment/moment";
// React Redux is a library for handling state in React
// Redux Toolkit is a library for handling state in React
import { useDispatch } from "react-redux";
import { updateLocation, updateUser, removeUser } from "./store/slice";
// Socket.io is a library for handling real-time communication
import { io } from "socket.io-client";
// Axios is a library for handling HTTP requests
import axios from "axios";
// Firebase is a library for handling authentication
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./util/firebase";

export const api = axios.create({ baseURL: "http://localhost:3000/api" });
export const socket = io("http://localhost:3000");

const App: React.FC = () => {
	const dispatch = useDispatch();

	// Theme and Location Handling
	useEffect(() => {
		const handleLocation = (): void => {
			// Location Handling
			const success = (position: GeolocationPosition): void => {
				const { latitude, longitude } = position.coords;
				dispatch(updateLocation({ latitude: latitude, longitude: longitude }));
			};
			const error = (error: GeolocationPositionError): void => {
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

		const handleTheme = (): void => {
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

		handleLocation();
		handleTheme();
	}, []);

	// User Handling
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			async (user): Promise<void> => {
				if (user) {
					try {
						const { data } = await api.get(`/get_user/${user.email}`);
						const { username, email, role } = data;
						dispatch(updateUser({ username, email, role }));
					} catch (error) {
						console.log(error);
						dispatch(removeUser());
						notify(500, "Failed to fetch user details");
					}
				} else {
					dispatch(removeUser());
				}
			}
		);

		return () => {
			unsubscribe();
		};
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
