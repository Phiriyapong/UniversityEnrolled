import React, { useState } from 'react';

interface Course {
  id: number;
  name: string;
}

interface Semester {
  id: number;
  name: string;
  courses: Course[];
}

const CourseSemesterOrganizer: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, name: 'Fall 2023', courses: [] },
    { id: 2, name: 'Spring 2024', courses: [] },
  ]);

  const addCourseToSemester = (semesterId: number, course: Course) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) =>
        semester.id === semesterId
          ? { ...semester, courses: [...semester.courses, course] }
          : semester
      )
    );
  };

  const removeCourseFromSemester = (semesterId: number, courseId: number) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) =>
        semester.id === semesterId
          ? { ...semester, courses: semester.courses.filter(course => course.id !== courseId) }
          : semester
      )
    );
  };

  return (
    <div>
      <h1>Course Semester Organizer</h1>
      {semesters.map((semester) => (
        <div key={semester.id}>
          <h2>{semester.name}</h2>
          <ul>
            {semester.courses.map((course) => (
              <li key={course.id}>
                {course.name}
                <button onClick={() => removeCourseFromSemester(semester.id, course.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={() => addCourseToSemester(semester.id, { id: Date.now(), name: 'New Course' })}>
            Add Course
          </button>
        </div>
      ))}
    </div>
  );
};

export default CourseSemesterOrganizer;