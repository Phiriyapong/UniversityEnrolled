"use client";
import { useEffect } from "react";

type CourseWithSection = {
  courseName: string;
  sectionName: string;
};

type Props = {
  courses: CourseWithSection[];
  open: boolean;
  onClose: () => void;
};

export default function CourseRegistrationModal({ courses, open, onClose }: Props) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-black/80 p-6 rounded-lg shadow-lg w-3/4">
        <h2 className="text-2xl font-bold mb-4 text-white">You have successfully registered for the following courses:</h2>
        <table className="min-w-full bg-black/80">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-white">Course Name</th>
              <th className="py-2 px-4 border-b text-white">Section Name</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-white">{course.courseName}</td>
                <td className="py-2 px-4 border-b text-white">{course.sectionName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
