// app/dashboard/page.tsx
"use client";

import AvailabilityForm from "../_components/AvailabilityForm";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="mx-auto w-11/12 max-w-5xl pb-16 pt-10">
        <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-slate-100">
          Student Dashboard
        </h1>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800/60 to-slate-900/60 p-6 shadow-xl backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-slate-200">
            Set Your Availability
          </h2>

          <AvailabilityForm />
        </div>
      </div>
    </div>
  );
}
