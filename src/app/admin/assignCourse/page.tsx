"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
interface Department {
  id: number;
  name: string;
  code: string;
  create_at: Date;
  update_at: Date;
  major_id: number;
}

interface Course {
  id: number;
  name: string;
  code: string;
  create_at: Date;
  update_at: Date;
  teacher_id: string | null;
  department: Department;
}

interface Term {
  id: number;
  semester_name: string;
  year_name: string;
  course: Course[];
}

export default function ManageCoursesByTerm() {
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const { data: termsWithCourses, refetch } = api.courses.getTermsWithCourses.useQuery();
  const assignCourseMutation = api.courses.assignCourseToTerm.useMutation();
  const removeCourseMutation = api.courses.removeCourseFromTerm.useMutation();

  const handleAssignCourse = async () => {
    if (selectedTerm && selectedCourse) {
      await assignCourseMutation.mutateAsync({ termId: selectedTerm, courseId: selectedCourse });
      alert("Course assigned successfully");
      refetch();
    }
  };

  const handleRemoveCourse = async (termId: number, courseId: number) => {
    await removeCourseMutation.mutateAsync({ termId, courseId });
    alert("Course removed successfully");
    refetch();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Courses by Term</h1>

      <div className="flex flex-col space-y-4">
        {termsWithCourses?.map((term: Term) => (
          <div key={term.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">
              {term.semester_name} {term.year_name}
            </h2>

            <ul className="mt-2 space-y-2">
              {term.course.map((course: Course) => (
                <li key={course.id} className="flex justify-between items-center">
                  <span>
                    {course.name} ({course.code})
                  </span>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleRemoveCourse(term.id, course.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">Assign a Course to a Term</h2>
        <div className="mt-2 space-y-4">
          <select
            className="w-full px-4 py-2 border rounded"
            onChange={(e) => setSelectedTerm(Number(e.target.value))}
          >
            <option value="">Select Term</option>
            {termsWithCourses?.map((term: Term) => (
              <option key={term.id} value={term.id}>
                {term.semester_name} {term.year_name}
              </option>
            ))}
          </select>

          <select
            className="w-full px-4 py-2 border rounded"
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
          >
            <option value="">Select Course</option>
            {termsWithCourses
              ?.flatMap((term) => term.course)
              ?.map((course: Course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
          </select>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleAssignCourse}
          >
            Assign Course
          </button>
        </div>
      </div>
    </div>
  );
}