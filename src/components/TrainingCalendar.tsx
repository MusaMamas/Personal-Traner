import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Training } from "../types";
import { CalendarEvent } from "../types";

export default function TrainingCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings")
      .then(res => res.json())
      .then(data => {
        const calendarEvents = data.map((t: Training) => ({
          title: `${t.activity} - ${t.customer.firstname} ${t.customer.lastname}`,
          start: t.date,
          allDay: false
        }));
        setEvents(calendarEvents);
      });
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={events}
        height={650}
      />
    </div>
  );
}
