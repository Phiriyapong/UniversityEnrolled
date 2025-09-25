// app/_components/teacherDashboard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarComponent, { AvailabilityByWeekday } from "../_components/calendar";
import { api } from "~/trpc/react";

type SectionTime = {
  id: number;
  date: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  start_time: string | Date;
  end_time: string | Date;
};

type Student = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  availability?: {
    day: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
    start_time: string | Date;
    end_time: string | Date;
  }[];
};

type CourseStudent = { student: Student | null };

type Section = {
  id: number;
  name: string;
  amount: number;
  register_amount: number;
  semester_year_id: number;
  course_id: number;
  teacher_id: string | null;
  section_time: SectionTime[];
  course_student?: CourseStudent[];
};

type Course = {
  id: number;
  name: string;
  code: string;
  unit: number;
  isActive: boolean;
  sections: Section[];
};

type TeacherDashboardProps = {
  teacherId: string;
};

// Day -> JS week index map
const dayToJsIndex: Record<SectionTime["date"], number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacherId }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseSections, setSelectedCourseSections] = useState<Section[]>([]);
  const [availabilityByWeekday, setAvailabilityByWeekday] = useState<AvailabilityByWeekday>({
    0: "none", 1: "none", 2: "none", 3: "none", 4: "none", 5: "none", 6: "none",
  });

  // tRPC
  const { data: teacherCourses } = api.courses.getTeacherCourses.useQuery(
    { teacherId },
    { enabled: !!teacherId }
  );

  const courses = useMemo(() => (teacherCourses ?? []) as Course[], [teacherCourses]);

  // Build availability map for a set of sections
  const buildAvailabilityByWeekday = (sections?: Section[]): AvailabilityByWeekday => {
    const secs = sections ?? [];
    const result: AvailabilityByWeekday = { 0:"none",1:"none",2:"none",3:"none",4:"none",5:"none",6:"none" };
    const counts: Record<number, number> = {0:0,1:0,2:0,3:0,4:0,5:0,6:0};

    const allStudents = secs.flatMap(s => s.course_student ?? []).map(cs => cs?.student).filter((x): x is Student => !!x);
    const total = allStudents.length;
    if (total === 0) return result;

    for (const s of allStudents) {
      const days = (s.availability ?? [])
        .map(a => dayToJsIndex[a.day])
        .filter((d): d is number => d !== undefined);
      for (const d of days) counts[d] = (counts[d] ?? 0) + 1;
    }

    for (let d = 0; d <= 6; d++) {
      if (counts[d] === total) result[d] = "all";
      else if (counts[d] > 0)  result[d] = "some";
      else                     result[d] = "none";
    }
    return result;
  };

  const handleViewCalendar = (courseId: number) => {
    setSelectedCourseId(courseId);
    const c = courses.find(x => x.id === courseId);
    const secs = c?.sections ?? [];
    setSelectedCourseSections(secs);
    setAvailabilityByWeekday(buildAvailabilityByWeekday(secs));
  };

  // Helpers
  const totalStudents = (c: Course) =>
    c.sections.reduce((sum, s) => sum + (s.register_amount || 0), 0);

  const selectedCourseName = useMemo(
    () => (selectedCourseId ? courses.find(c => c.id === selectedCourseId)?.name ?? "" : ""),
    [selectedCourseId, courses]
  );

  const scheduleText = useMemo(() => {
    if (!selectedCourseSections?.length) return "No schedule available";
    const lines = selectedCourseSections.flatMap(section =>
      (section.section_time ?? []).map(t =>
        `${t.date}: ${new Date(t.start_time as string | Date).toLocaleTimeString()} - ${new Date(t.end_time as string | Date).toLocaleTimeString()}`
      )
    );
    return lines.length ? lines.join("\n") : "No schedule available";
  }, [selectedCourseSections]);

  return (
    <div className="mx-auto mt-10 w-11/12 max-w-6xl">

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800/60 to-slate-900/60 p-5 shadow-xl backdrop-blur">
        <h2 className="mb-4 text-lg font-semibold text-slate-200">Courses and Student Count</h2>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="max-h-[480px] overflow-auto">
            <table className="min-w-full text-left">
              <thead className="sticky top-0 z-10 bg-slate-900/80 text-slate-200 backdrop-blur">
                <tr>
                  <th className="px-5 py-3 text-sm font-semibold">Course Name</th>
                  <th className="px-5 py-3 text-sm font-semibold">Course Code</th>
                  <th className="px-5 py-3 text-sm font-semibold">Sections</th>
                  <th className="px-5 py-3 text-sm font-semibold text-center">Student Count</th>
                  <th className="px-5 py-3 text-sm font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-100">
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                      No courses found.
                    </td>
                  </tr>
                )}

                {courses.map((course, idx) => (
                  <tr
                    key={course.id}
                    className={idx % 2 ? "bg-white/0" : "bg-white/[0.02] hover:bg-white/[0.06] transition-colors"}
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium">{course.name}</div>
                      <div className="text-xs text-slate-400">Units: {course.unit}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{course.code}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {course.sections.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-200 ring-1 ring-inset ring-blue-400/30"
                          >
                            {s.name}
                            <span className="text-blue-300/70">·</span>
                            <span className="text-blue-300/80">{s.register_amount}/{s.amount}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-semibold">{totalStudents(course)}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleViewCalendar(course.id)}
                        className="inline-flex items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-0"
                      >
                        View Calendar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar + student list */}
        {selectedCourseId && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
              <h3 className="mb-3 text-lg font-bold text-slate-100">
                Course Calendar for <span className="text-indigo-300">{selectedCourseName}</span>
              </h3>
              <CalendarComponent
                schedule={scheduleText}
                availabilityByWeekday={availabilityByWeekday}
                onDateChange={(date) => console.log("Selected date:", date)}
              />
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                <span className="inline-block h-3 w-3 rounded-sm bg-[rgba(16,185,129,0.6)]"></span>
                All available
                <span className="inline-block h-3 w-3 rounded-sm bg-[rgba(234,179,8,0.6)] ml-4"></span>
                Some available
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
              <h4 className="mb-4 text-lg font-bold text-slate-100">Students Registered</h4>
              <div className="space-y-2">
                {selectedCourseSections.flatMap((section) =>
                  (section.course_student ?? []).map(({ student }) =>
                    student ? (
                      <div
                        key={student.id}
                        className="flex items-center justify-between rounded-xl bg-slate-900/50 px-4 py-3 ring-1 ring-white/10"
                      >
                        <div className="font-medium text-slate-100">
                          {(student.first_name ?? "") + " " + (student.last_name ?? "")}
                        </div>
                        {/* tiny availability preview (days) */}
                        <div className="ml-3 hidden text-xs text-slate-400 sm:block">
                          {(student.availability ?? [])
                            .map(a => a.day)
                            .filter((v, i, arr) => arr.indexOf(v) === i)
                            .join(" • ")}
                        </div>
                      </div>
                    ) : null
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
