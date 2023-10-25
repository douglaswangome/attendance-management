import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { timetable } from "../offline/timetable.json";

const MCalendar: React.FC = () => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState<
    { title: string; start: Date; end: Date }[]
  >([]);

  useEffect(() => {
    const e = timetable.map((event) => {
      return {
        title: `${event.unit} (${event.code}) - ${event.lecturer}`,
        start: moment(event.date.start, "YYYYMMDDHHmm").toDate(),
        end: moment(event.date.end, "YYYYMMDDHHmm").toDate(),
      };
    });
    setEvents(e);
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] w-[90vw]">
      <Calendar
        events={events}
        localizer={localizer}
        style={{ height: "100%", width: "100%" }}
        onSelectEvent={(event) => console.log(event)}
      />
    </div>
  );
};

export default MCalendar;
