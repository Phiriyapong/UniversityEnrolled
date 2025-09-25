// app/_components/calendar.tsx
"use client";
import { useState } from 'react';
import { Calendar, Panel } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

type WeekdayStatus = 'all' | 'some' | 'none';
export type AvailabilityByWeekday = Record<number, WeekdayStatus>; // 0..6

interface CalendarComponentProps {
  schedule?: string;
  onDateChange?: (date: Date) => void;
  availabilityByWeekday?: AvailabilityByWeekday; // NEW
}

export default function CalendarComponent({
  schedule,
  onDateChange,
  availabilityByWeekday,
}: CalendarComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  return (
    <>
      <style>{`
        .avail-all  { background-color: rgba(16, 185, 129, 0.35); } /* green */
        .avail-some { background-color: rgba(234, 179, 8, 0.35); }  /* amber */
      `}</style>

      <Panel bordered>
        {schedule && <h4 className="mb-4 whitespace-pre-line">Schedule: {schedule}</h4>}

        <Calendar
          compact
          value={selectedDate}
          onChange={handleDateChange}
          cellClassName={date => {
            if (!availabilityByWeekday) return undefined;
            const js = date.getDay(); // 0..6 (Sun..Sat)
            const status = availabilityByWeekday[js];
            if (status === 'all') return 'avail-all';
            if (status === 'some') return 'avail-some';
            return undefined; // none
          }}
        />
        <p className="mt-4">Selected Date: {selectedDate.toDateString()}</p>
      </Panel>
    </>
  );
}
