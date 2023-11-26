import React, { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Toaster } from "react-hot-toast";
import notify from "./util/notify";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import {
	updateLocation,
	updateUnits,
	updateTimetable,
	updateUser,
	removeUser,
} from "./store/slice";
import { Timetable, Unit } from "./util/types";
import { io } from "socket.io-client";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./util/firebase";

export const api = axios.create({ baseURL: "http://localhost:3000/api" });
export const socket = io("http://localhost:3000");

const App: React.FC = () => {
	const dispatch = useDispatch();

	// Theme and Location Handling
	// TODO: Add a a way to update location even after the initial fetch
	// TODO: do not handle location on fifth try
	useEffect(() => {
		const handleLocation = (): void => {
			// Location Handling
			const success = (position: GeolocationPosition): void => {
				const { latitude, longitude } = position.coords;
				dispatch(updateLocation({ latitude: latitude, longitude: longitude }));
			};
			const error = (error: GeolocationPositionError): void => {
				notify(500, "Failed to fetch location");
				handleLocation();
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
						navigator.geolocation.getCurrentPosition(success, error, options);
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

	// User and Unit Handling
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			async (user): Promise<void> => {
				if (user) {
					try {
						const userResult = await api.get(
							`/get_user/?username=${user.email
								?.split("@")[0]
								.replace(".", "%2E")}`
						);
						dispatch(updateUser(userResult.data));

						let units: Unit[] = [];
						let timetable: Timetable[] = [];
						if (userResult.data.role === "admin") {
							const unitsResult = await api.get(
								`/get_units/?role=admin&first=${userResult.data.school}&second=${userResult.data.department}`
							);
							const timetableResult = await api.get(
								`/get_timetable/?role=admin&first=${userResult.data.school}&second=${userResult.data.department}`
							);

							units = unitsResult.data;
							timetable = timetableResult.data;
						} else if (userResult.data.role === "student") {
							const unitsResult = await api.get(
								`/get_units/?role=student&first=${userResult.data.student.year}&second=${userResult.data.student.period}`
							);
							const timetableResult = await api.get(
								`/get_timetable/?role=student&first=${userResult.data.school}&second=${userResult.data.department}&third=${userResult.data.student.year}&fourth=${userResult.data.student.period}`
							);
							units = unitsResult.data;
							timetable = timetableResult.data;
						}

						dispatch(updateUnits({ units }));
						dispatch(updateTimetable({ timetable }));
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
