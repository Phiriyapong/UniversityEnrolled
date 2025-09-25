"use client";

import React from 'react';

type Course = {
  id: number;
  name: string;
  code: string;
  unit: number;
  department_id: number;
  creditsEarned: number; // Add this field
  mandatory_for: {
    id: number;
  }[];
};

type CourseStatus = 'Pass' | 'Inprogress' | 'NotPass';

type CoursesUnitPageClientProps = {
  courses: Course[];
  courseStatuses: { [key: number]: CourseStatus };
};

const CoursesUnitPageClient: React.FC<CoursesUnitPageClientProps> = ({ courses, courseStatuses }) => {
  const allCoursesPassed = courses.every(course => courseStatuses[course.id] === 'Pass');

  return (
    <div className="flex flex-col items-center p-6 min-h-screen" style={{ backgroundColor: '#121826' }}>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Course Name</th>
              <th className="py-3 px-4 text-left">Course Code</th>
              <th className="py-3 px-4 text-left">Units</th>
              <th className="py-3 px-4 text-left">Credits Earned</th> {/* New column */}
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className={`${course.mandatory_for.length > 0 ? 'bg-yellow-100 text-black' : 'bg-gray-700 text-white'} hover:bg-gray-600`}>
                <td className="py-3 px-4 border-b border-gray-600">{course.name}</td>
                <td className="py-3 px-4 border-b border-gray-600">{course.code}</td>
                <td className="py-3 px-4 border-b border-gray-600">{course.unit}</td>
                <td className="py-3 px-4 border-b border-gray-600">{course.creditsEarned}</td> {/* Display credits earned */}
                <td className="py-3 px-4 border-b border-gray-600">
                  {courseStatuses[course.id] ?? 'Not Registered'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {allCoursesPassed && (
        <button
          className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-lg transition duration-300"
          onClick={() => alert("Confirm Graduate")} // Mock function
        >
          ยื่นสำเร็จการศึกษา
        </button>
      )}
    </div>
  );
};

export default CoursesUnitPageClient;
