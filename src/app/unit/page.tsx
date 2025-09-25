// /admin/courses/CoursesUnitPage.tsx
import React from 'react';
import { api } from '~/trpc/server';
import CoursesUnitPageClient from '~/app/_components/CoursesPageClient';

const fetchUnitCourses = async () => {
  const { courses, courseStatuses } = await api.courses.getUnit({ departmentId: 1, majorId: 1 });
  return { courses, courseStatuses };
};

const CoursesUnitPage: React.FC = async () => {
  const { courses, courseStatuses } = await fetchUnitCourses();
  return (
    <CoursesUnitPageClient courses={courses} courseStatuses={courseStatuses} />
  );
};

export default CoursesUnitPage;
