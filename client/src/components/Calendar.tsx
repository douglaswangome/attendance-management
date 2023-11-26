import React, { useEffect, useState } from "react";
import { EventClickArg, EventDropArg, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";
import { InitialState } from "../util/types";
import { useNavigate } from "react-router-dom";
import notify from "../util/notify";
import { useDispatch } from "react-redux";
import { updateClass } from "../store/slice";
import { AxiosError, isAxiosError } from "axios";
import { api, socket } from "../App";
import { useSelector } from "react-redux";

const Calendar: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, timetable } = useSelector(
		(state: { slice: InitialState }) => state.slice
	);
	const [events, setEvents] = useState<EventInput[]>([]);

	const handleEventDrop = (event: EventDropArg): void => {
		const day = event.event.start?.getDay();
		if (day === 0 || day === 6) {
			event.revert();
			notify(500, "You can't schedule a class on a weekend");
		}
	};

	const handleEventClick = async (event: EventClickArg): Promise<void> => {
		const isToday =
			timetable[parseInt(event.event.id)].date.start.toString().slice(0, 8) ===
			moment().format("YYYYMMDD");
		dispatch(updateClass(timetable[parseInt(event.event.id)]));
		try {
			if (user.role === "admin") {
				if (user._id === timetable[parseInt(event.event.id)].lecturerID) {
					const result = await api.post("/create_attendance_collection", {
						code: timetable[parseInt(event.event.id)].code
							.replace(" ", "")
							.toUpperCase(),
						moment: timetable[parseInt(event.event.id)].date.start.toString(),
					});
					notify(200, result.data);
					dispatch(updateClass(timetable[parseInt(event.event.id)]));
					navigate(
						`/class/${timetable[parseInt(event.event.id)].code}/${
							timetable[parseInt(event.event.id)].date.start
						}`
					);
					if (isToday) {
						socket.emit(
							"join_class",
							timetable[parseInt(event.event.id)].code
								.replace(" ", "")
								.toUpperCase()
						);
					}
				} else {
					notify(500, "You can't edit/view this class");
				}
			} else {
				notify(500, "You can't edit/view this class");
			}
		} catch (err) {
			if (isAxiosError(err)) {
				const axiosError: AxiosError = err;
				if (axiosError.response) {
					if (axiosError.response.status === 400) {
						navigate(
							`/class/${timetable[parseInt(event.event.id)].code}/${
								timetable[parseInt(event.event.id)].date.start
							}`
						);
						notify("", axiosError.response.data as string);
					} else {
						notify(
							axiosError.response.status,
							axiosError.response.data as string
						);
					}
				} else {
					notify(500, "Something went wrong");
				}
			}
		}
	};

	useEffect(() => {
		const classes: EventInput[] = timetable.map((event, index) => {
			return {
				id: index.toString(),
				title: `${event.code.toUpperCase()}`,
				start: moment(event.date.start, "YYYYMMDDHHmm").toDate(),
				end: moment(event.date.end, "YYYYMMDDHHmm").toDate(),
				constraint:
					user.role === "admin" &&
					moment().isBefore(moment(event.date.start, "YYYYMMDDHHmm")) &&
					user._id === event.lecturerID
						? `businessHours`
						: "",
			};
		});
		setEvents(classes);
	}, [user.role, timetable]);

	return (
		<div className="w-[90vw] max-[425px]:w-[98vw] !capitalize">
			<FullCalendar
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay",
				}}
				initialView="dayGridMonth"
				plugins={[
					dayGridPlugin,
					timeGridPlugin,
					interactionPlugin,
					momentPlugin,
				]}
				editable={user.role === "admin" ? true : false}
				eventColor="#407BFF"
				eventClick={handleEventClick}
				events={events}
				eventDrop={handleEventDrop}
				eventOverlap={false}
				businessHours={{
					daysOfWeek: [1, 2, 3, 4, 5],
					startTime: "06:30",
					endTime: "19:00",
				}}
			/>
		</div>
	);
};

export default Calendar;
