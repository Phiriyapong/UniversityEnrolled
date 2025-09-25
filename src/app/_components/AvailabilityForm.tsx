// app/_components/AvailabilityForm.tsx
"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { api } from "~/trpc/react";
import type { Day } from "@prisma/client";

const jsToDayEnum: Record<number, Day | undefined> = {
  0: undefined, // Sun not stored
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: undefined, // Sat not stored
};

export default function AvailabilityForm() {
  const [selected, setSelected] = useState<Date[]>([]);
  const [saving, setSaving] = useState(false);

  const addAvailability = api.availability.add.useMutation();

  const onDayClick = (date: Date) => {
    setSelected((prev) =>
      prev.some((d) => d.toDateString() === date.toDateString())
        ? prev.filter((d) => d.toDateString() !== date.toDateString())
        : [...prev, date]
    );
  };

  const selectedWeekdays = useMemo(
    () =>
      selected
        .map((d) => d.getDay())
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
        .join(" • "),
    [selected]
  );

  const save = async () => {
    if (!selected.length) return;

    setSaving(true);
    try {
      for (const d of selected) {
        const dayEnum = jsToDayEnum[d.getDay()];
        if (!dayEnum) continue;
        await addAvailability.mutateAsync({
          day: dayEnum,
          startTime: "09:00",
          endTime: "17:00",
        });
      }
      setSelected([]);
    } catch (e) {
      console.error(e);
      // Optionally show a toast here
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dark theme overrides for DayPicker */}
      <style>{`
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: rgb(99 102 241);
          --rdp-background-color: rgba(99, 102, 241, 0.15);
          margin: 0;
        }
        .rdp,
        .rdp-caption_label,
        .rdp-head_cell,
        .rdp-day {
          color: rgb(226 232 240); /* slate-200 */
        }
        .rdp-day_outside {
          color: rgb(148 163 184); /* slate-400 */
        }
        .rdp-day_selected,
        .rdp-day_selected:focus-visible,
        .rdp-day_selected:hover {
          background: var(--rdp-background-color);
          color: rgb(199 210 254); /* indigo-200 */
          border: 1px solid rgba(99,102,241,.35);
        }
        .rdp-day_today {
          outline: 1px dashed rgba(234,179,8,.6); /* amber */
          outline-offset: 2px;
        }
      `}</style>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-md">
        <DayPicker
          mode="multiple"
          selected={selected}
          onDayClick={onDayClick}
          defaultMonth={new Date()}
          className="rdp-dark"
          classNames={{
            months: "flex gap-6",
            month: "",
            caption: "mb-3 text-slate-300",
            table: "w-full border-collapse",
            head_cell: "pb-2 text-xs font-medium text-slate-400",
            row: "rdp-row",
            cell:
              "rdp-cell text-slate-200 hover:bg-white/[0.05] rounded-md transition-colors",
            day: "rdp-day rounded-md",
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-300">
          {selected.length ? (
            <>
              <span className="font-medium text-slate-200">Selected:</span>{" "}
              {selectedWeekdays}
            </>
          ) : (
            "No days selected"
          )}
        </div>

        <button
          onClick={save}
          disabled={saving || selected.length === 0}
          className="inline-flex items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Availability"}
        </button>
      </div>

      <p className="text-xs text-slate-400">
        Tip: Only Mon–Fri will be saved (09:00–17:00). Weekends are ignored.
      </p>
    </div>
  );
}
