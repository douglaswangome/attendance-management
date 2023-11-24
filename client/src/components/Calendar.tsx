import React, { useEffect, useState } from "react";
import { EventClickArg, EventDropArg, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment/moment";
import { timetable } from "../offline/timetable.json";
import { InitialState } from "../util/types";
import { useNavigate } from "react-router-dom";
import notify from "../util/notify";
import { useDispatch } from "react-redux";
import { updateClass } from "../store/slice";
import { socket } from "../App";
import { useSelector } from "react-redux";

const Calendar: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state: { slice: InitialState }) => state.slice);
	const [events, setEvents] = useState<EventInput[]>([]);

	const handleEventDrop = (event: EventDropArg) => {
		const day = event.event.start?.getDay();

		if (moment(event.event.start).isBefore(moment())) {
			event.revert();
			notify(500, "You can't schedule a class in the past");
		}
		if (day === 0 || day === 6) {
			event.revert();
			notify(500, "You can't schedule a class on a weekend");
		}
	};

	const handleEventClick = (event: EventClickArg) => {
		console.log(event.event);
	};

	useEffect(() => {
		const classes: EventInput[] = timetable.map((event, index) => {
			return {
				id: index.toString(),
				title: `${event.unit}`,
				start: moment(event.date.start, "YYYYMMDDHHmm").toDate(),
				end: moment(event.date.end, "YYYYMMDDHHmm").toDate(),
				constraint: user.role === "admin" ? "businessHours" : "",
			};
		});
		setEvents(classes);
	}, []);

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
				businessHours={{
					daysOfWeek: [1, 2, 3, 4, 5],
					startTime: "07:00",
					endTime: "19:00",
				}}
			/>
		</div>
	);
};

export default Calendar;
