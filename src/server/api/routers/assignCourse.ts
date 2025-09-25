import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"; 
import { db } from '~/server/db';

export const assignCourseRouter = createTRPCRouter({
  // Get all courses
  getAllCourses: protectedProcedure
    .query(async () => {
      const courses = await db.course.findMany();
      return courses;
    }),

  // Get all semesters
  getAllSemesters: protectedProcedure
    .query(async () => {
      const semesters = await db.semester_year.findMany();
      return semesters;
    }),

  // Assign a course to a semester
  assignCourseToSemester: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        semesterId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const updatedCourse = await db.course.update({
        where: { id: input.courseId },
        data: {
          semester_year: {
            connect: { id: input.semesterId },
          },
        },
      });
      return updatedCourse;
    }),
});
