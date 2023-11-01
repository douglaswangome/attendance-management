import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { timetable } from "../offline/timetable.json";
import notify from "../util/notify";
import { useDispatch } from "react-redux";
import { updateClass } from "../store/slice";
import { socket } from "../App";

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

const MCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState<Event[]>([]);

  const handleOnSelectEvent = (event: Event) => {
    if (moment().isBefore(event.start)) {
      const difference: string =
        moment(event.start).diff(moment(), "hours") === 0
          ? `${moment(event.start).diff(moment(), "minutes")} minute${
              moment(event.start).diff(moment(), "minutes") > 1 ? "s" : ""
            }`
          : `${moment(event.start).diff(moment(), "hours")} hour${
              moment(event.start).diff(moment(), "hours") > 1 ? "s" : ""
            }`;
      notify(200, `Class coming up in ${difference}`);
    } else if (moment().isAfter(event.end)) {
      const difference: string =
        moment().diff(moment(event.end), "hours") === 0
          ? `${moment().diff(moment(event.end), "minutes")} minute${
              moment().diff(moment(event.end), "minutes") > 1 ? "s" : ""
            }`
          : `${moment().diff(moment(event.end), "hour")} hour${
              moment().diff(moment(event.end), "hour") > 1 ? "s" : ""
            }`;
      notify(500, `Class ended ${difference} ago`);
    } else if (moment().isBetween(event.start, event.end)) {
      notify("", "Class is ongoing");
      dispatch(updateClass(timetable[event.id]));
      navigate(
        `/class/${timetable[event.id].code.replace(" ", "")}/${moment().format(
          "YYYYMMDD"
        )}`
      );
      socket.emit("join_class", timetable[event.id].code.replace(" ", ""));
    }
  };

  useEffect(() => {
    // Edit the timetable - add color, room
    const e = timetable.map((event, index) => {
      return {
        id: index,
        title: `${event.unit} (${event.code}) - ${event.lecturer} @ general lab`,
        start: moment(event.date.start, "YYYYMMDDHHmm").toDate(),
        end: moment(event.date.end, "YYYYMMDDHHmm").toDate(),
      };
    });
    setEvents(e);
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] min-h-[600px] w-[90vw]">
      <Calendar
        events={events}
        localizer={localizer}
        style={{ height: "100%", width: "100%" }}
        onSelectEvent={(event) => handleOnSelectEvent(event)}
      />
    </div>
  );
};

export default MCalendar;
