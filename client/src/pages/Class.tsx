import React, { useEffect, useState } from "react";
import { api, socket } from "../App";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
	updateModal,
	updatePoly,
	updatePolygon,
	updateWholePoly,
	updateWholePolygon,
} from "../store/slice";
import { Attendance, InitialState, Unit, User } from "../util/types";
import isPointInPolygon from "geolib/es/isPointInPolygon";
import { getEitherPolygonSide } from "../util/fn/polygon/getEitherPolygonSide";
import moment from "moment/moment";
import { BsCheckCircle, BsPinMap, BsXCircle } from "react-icons/bs";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Button from "../components/Button";
import notify from "../util/notify";
import { AxiosError, isAxiosError } from "axios";

const Class: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { classDetails, location, polygon, poly, units, user, studentModal } =
		useSelector((state: { slice: InitialState }) => state.slice);

	const [isToday, setIsToday] = useState<boolean>(true);
	const [attendances, setAttendances] = useState<Attendance[]>([]);
	const [students, setStudents] = useState<User[]>([]);
	const [lecturerName, setLecturerName] = useState<string>("");
	const [unit, setUnit] = useState<Unit>({
		code: "",
		lecturerID: "",
		semester: { year: "", period: "" },
		school: "",
		department: "",
		title: "",
	});
	// Admin - Fetch Students
	const fetchStudents = async (): Promise<void> => {
		try {
			const result = await api.get(
				`/get_students/?year=${classDetails.semester.year}&period=${classDetails.semester.period}`
			);
			setStudents(result.data);
		} catch (err) {
			if (isAxiosError(err)) {
				const axiosError: AxiosError = err;
				if (axiosError.response) {
					notify(
						axiosError.response.status,
						axiosError.response.data as string
					);
				}
			} else {
				console.log(err);
			}
		}
	};
	// Admin - Fetch Attendance
	const fetchAttendance = async (): Promise<void> => {
		try {
			const result = await api.get(
				`/get_attendance/?unit=${classDetails.code
					.replace(" ", "")
					.toUpperCase()}&moment=${classDetails.date.start.toString()}`
			);
			setAttendances(result.data);
		} catch (err) {
			if (isAxiosError(err)) {
				const axiosError: AxiosError = err;
				if (axiosError.response) {
					notify(
						axiosError.response.status,
						axiosError.response.data as string
					);
				}
			} else {
				console.log(err);
			}
		}
	};
	// Admin - Emit Notification to Students
	const emitNotification = (side: "right" | "left"): void => {
		if (side === "right") {
			socket.emit("send_notification", {
				room: classDetails.code.replace(" ", ""),
				message: "Are you the farthest right student?",
			});
		} else {
			socket.emit("send_notification", {
				room: classDetails.code.replace(" ", ""),
				message: "Are you the farthest left student?",
			});
		}
	};
	// Admin Send Polygon Points
	const sendPolygonPoints = (): void => {
		socket.emit("send_polygon", {
			room: classDetails.code.replace(" ", ""),
			polygon: polygon,
			poly: poly,
		});
	};

	// Student - Fetch Lecturer Name
	const fetchLecturerName = async (): Promise<void> => {
		try {
			const result = await api.get(`/get_lecturer_name/?id=${unit.lecturerID}`);
			setLecturerName(result.data);
		} catch (error) {
			if (isAxiosError(error)) {
				const axiosError: AxiosError = error;
				if (axiosError.response) {
					notify(
						axiosError.response.status,
						axiosError.response.data as string
					);
				} else {
					notify(500, "Something went wrong");
				}
			} else {
				notify(500, "Something went wrong");
			}
		}
	};
	// Student - Check if location is in polygon
	const setAttendance = (): void => {
		let result: boolean = false;
		if (
			location.latitude === polygon.farRight.latitude &&
			location.longitude === polygon.farRight.longitude
		) {
			result = true;
			console.log("far right");
		} else if (
			location.latitude === polygon.nearRight.latitude &&
			location.longitude === polygon.nearRight.longitude
		) {
			result = true;
			console.log("near right");
		} else if (
			location.latitude === polygon.farLeft.latitude &&
			location.longitude === polygon.farLeft.longitude
		) {
			result = true;
			console.log("far left");
		} else if (
			location.latitude === polygon.nearLeft.latitude &&
			location.longitude === polygon.nearLeft.longitude
		) {
			result = true;
			console.log("near left");
		} else {
			result = isPointInPolygon(location, [
				polygon.nearRight,
				polygon.farRight,
				polygon.farLeft,
				polygon.nearLeft,
			]);
		}

		if (result) {
			notify(200, "Kudos! You are in class");
		} else {
			notify(400, "Sorry! You are not in class");
		}

		api.post("/add_attendance", {
			attendance: {
				username: user.username,
				present: result,
				latitude: location.latitude,
				longitude: location.longitude,
			},
		});
	};

	// Get Notifications
	useEffect(() => {
		if (user.role === "student") {
			socket.on("notification", (data) => {
				dispatch(updateModal({ show: true, message: data }));
			});

			socket.on("polygon_markers", (data) => {
				dispatch(updateWholePoly(data.poly));
				dispatch(updateWholePolygon(data.polygon));
				notify("", "Polygon has been updated. You can now mark your location");
			});
		} else if (user.role === "admin") {
			socket.on("polygon", (data) => {
				try {
					const { near, far } = getEitherPolygonSide(
						location,
						data.location,
						data.side
					);
					if (data.side === "right") {
						console.log("first");
						// update far right and near right polygon data
						dispatch(updatePolygon({ position: "nearRight", location: near }));
						dispatch(updatePolygon({ position: "farRight", location: far }));
						dispatch(updatePoly({ position: "doneRight", done: true }));
						console.log(poly);
					} else if (data.side === "left") {
						// update far left and near left polygon data
						dispatch(updatePolygon({ position: "nearLeft", location: near }));
						dispatch(updatePolygon({ position: "farLeft", location: far }));
						dispatch(updatePoly({ position: "doneLeft", done: true }));
					}
				} catch (error) {
					notify(500, "Error: Polygon is not ready");
					console.log(error);
				}
			});
		}

		// CleanUp - Remove listeners
		return () => {
			socket.off("notification");
			socket.off("polygon_markers");
			socket.off("polygon");
		};
	}, [socket]);

	// Check if state is empty for all users
	useEffect(() => {
		setIsToday(
			classDetails.date.start.toString().slice(0, 8) ===
				moment().format("YYYYMMDD")
		);

		if (classDetails.room === "") {
			navigate("/home");
		}

		if (user.role === "admin") {
			fetchStudents();
			fetchAttendance();
			setUnit(units.find((unit) => unit.code === classDetails.code) as Unit);
		} else if (user.role === "student") {
			fetchLecturerName();
		}
	}, []);

	return (
		<div className="flex flex-col w-full h-full gap-2 p-2">
			{user.role === "student" && studentModal?.modal ? (
				<Modal show={studentModal?.modal.show}>
					<div className="flex flex-col gap-2">
						<span>{studentModal?.modal.message}</span>
						<div className="flex items-center gap-2">
							<Button
								icon={BsXCircle}
								text="No"
								fn={() => dispatch(updateModal({ modal: false }))}
								solid
								hover={false}
							/>
							<Button
								icon={BsCheckCircle}
								text="Yes"
								fn={() => {
									socket.emit("update_polygon", {
										room: classDetails.code.replace(" ", ""),
										location: location,
										side: studentModal?.modal.message.split(" ")[4],
									});
									dispatch(updateModal({ modal: false }));
								}}
								hover={false}
							/>
						</div>
					</div>
				</Modal>
			) : null}
			<div className="flex flex-col">
				<span className="text-xl underline">Class Details</span>
				<div className="flex flex-col pl-2 capitalize">
					<div className="flex gap-2">
						<span>Unit:</span>
						<span className="flex gap-1">
							<span className="uppercase">
								{unit.title} ({classDetails.code})
							</span>
						</span>
					</div>
					<div className="flex gap-2">
						<span>Lecturer:</span>
						<span>{unit.lecturerID === user._id ? "You" : lecturerName}</span>
					</div>
					<div className="flex gap-2">
						<span>Room:</span>
						<span>{classDetails.room}</span>
					</div>
					<div className="flex gap-2">
						<span>Date:</span>
						<div className="flex flex-col">
							<div className="flex gap-1">
								<span>Started @</span>
								<span>
									{moment(classDetails.date.start, "YYYYMMDDHHmm").format(
										"YYYY/MM/DD HH:mm"
									)}
								</span>
							</div>
							<div className="flex gap-1">
								<span>Ending @</span>
								<span>
									{moment(classDetails.date.end, "YYYYMMDDHHmm").format(
										"YYYY/MM/DD HH:mm"
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				{isToday ? (
					<>
						<span className="text-xl underline">Location Details</span>
						<div className="flex flex-col capitalize">
							<div className="flex items-center gap-1 normal-case">
								{location.latitude !== 0 && location.longitude !== 0 ? (
									<>
										<BsCheckCircle className="text-green-600" />
										<span>Your location has been updated</span>
									</>
								) : (
									<>
										<Loader />
										<span>Fetching your location</span>
									</>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<span className="text-xl underline">Polygon Details</span>
								<div className="flex flex-col gap-2">
									<div className="flex gap-2">
										{user.role === "admin" ? (
											<Button
												hover={false}
												icon={BsPinMap}
												text="left"
												solid={false}
												fn={() => emitNotification("left")}
												width="fit"
											/>
										) : (
											""
										)}
										<div className="relative w-[200px] h-[200px] border dark:border-less-dark">
											<div
												className={`absolute top-0 right-0 w-1/2 h-full opacity-40 ${
													poly.doneRight ? "bg-green-400" : "bg-red-400"
												}`}
											></div>
											<div
												className={`absolute top-0 left-0 w-1/2 h-full opacity-40 ${
													poly.doneLeft ? "bg-green-400" : "bg-red-400"
												}`}
											></div>
										</div>
										{user.role === "admin" ? (
											<Button
												hover={false}
												icon={BsPinMap}
												text="right"
												solid={false}
												fn={() => emitNotification("right")}
												width="fit"
											/>
										) : (
											""
										)}
									</div>
									<div>
										<Button
											hover
											icon={BsCheckCircle}
											text={
												user.role === "admin"
													? "send polygon"
													: "sign attendance"
											}
											solid={false}
											fn={
												user.role === "admin"
													? sendPolygonPoints
													: setAttendance
											}
											width="fit"
											disabled={!poly.doneRight || !poly.doneLeft}
										/>
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<span className="text-xl underline">Attendance Details</span>
						<div className="flex items-center w-fit ml-auto text-sm">
							<span className="ml-2">
								{students.length} student
								{students.length > 1 ? "s" : ""}
							</span>
						</div>
						<div className="flex flex-col w-full gap-2">
							{attendances.map((attendance, index) => (
								<div
									className="flex items-center w-full p-2 rounded-lg dark:even:bg-less-dark even:bg-gray-100"
									key={index}
								>
									<div className="flex items-center gap-2">
										<span className="text-xl">
											{attendance.present ? (
												<BsCheckCircle className="text-green-600" />
											) : (
												<BsXCircle className="text-red-600" />
											)}
										</span>
										<span className="uppercase">{attendance.username}</span>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Class;
