import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const sectionTimeSchema = z.object({
  date: z.enum(["Mon","Tue","Wed","Thu","Fri"]),
   start_time: z.string(),
  end_time: z.string(),
});

const sectionSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  amount: z.number(),
  register_amount: z.number().optional(),
  semester_year_id: z.number(),
  section_time: z.array(sectionTimeSchema).optional(),
});

const courseSchema = z.object({
  name: z.string(),
  code: z.string(),
  unit: z.number(),
  department_id: z.number(),
  isActive: z.boolean().optional(),
  sections: z.array(sectionSchema).optional(),
});

const editCourseSchema = courseSchema.extend({
  id: z.number(),
});

export const editCourseRouter = createTRPCRouter({
  addCourse: protectedProcedure
    .input(courseSchema)
    .mutation(async ({ input, ctx }) => {
      const newCourse = await ctx.db.course.create({
        data: {
          name: input.name,
          code: input.code,
          unit: input.unit,
          department_id: input.department_id,
          isActive: input.isActive ?? true,
          sections: {
            create: input.sections?.map((section) => ({
              name: section.name,
              amount: section.amount,
              register_amount: section.register_amount ?? 0,
              semester_year_id: section.semester_year_id,
              section_time: {
                create: section.section_time?.map((time) => ({
                  date: time.date,
                  start_time: new Date(time.start_time),
                  end_time: new Date(time.end_time),
                })),
              },
            })),
          },
        },
        include: {
          sections: true,
        },
      });
      return newCourse;
    }),

  editCourse: protectedProcedure
    .input(editCourseSchema)
    .mutation(async ({ input, ctx }) => {
      const updatedCourse = await ctx.db.course.update({
        where: { id: input.id },
        data: {
          name: input.name,
          code: input.code,
          unit: input.unit,
          department_id: input.department_id,
          isActive: input.isActive,
        },
        include: {
          sections: true,
        },
      });

      const existingSectionIds = input.sections?.filter((section) => section.id).map((section) => section.id) || [];
      const existingSections = await ctx.db.section_course.findMany({
        where: { course_id: input.id },
      });

      for (const section of existingSections) {
        if (!existingSectionIds.includes(section.id)) {
          await ctx.db.section_course.delete({
            where: { id: section.id },
          });
        }
      }

      for (const section of input.sections || []) {
        if (section.id) {
          await ctx.db.section_course.update({
            where: { id: section.id },
            data: {
              name: section.name,
              amount: section.amount,
              register_amount: section.register_amount ?? 0,
              semester_year_id: section.semester_year_id,
              section_time: {
                deleteMany: {},
                create: section.section_time?.map((time) => ({
                  date: time.date,
                  start_time: new Date(time.start_time),
                  end_time: new Date(time.end_time),
                })),
              },
            },
          });
        } else {
          await ctx.db.section_course.create({
            data: {
              name: section.name,
              amount: section.amount,
              register_amount: section.register_amount ?? 0,
              semester_year_id: section.semester_year_id,
              course_id: input.id,
              section_time: {
                create: section.section_time?.map((time) => ({
                  date: time.date,
                  start_time: new Date(time.start_time),
                  end_time: new Date(time.end_time),
                })),
              },
            },
          });
        }
      }

      return updatedCourse;
    }),

  deactivateCourse: protectedProcedure
    .input(z.object({ id: z.number(), isActive: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const updatedCourse = await ctx.db.course.update({
        where: { id: input.id },
        data: {
          isActive: input.isActive,
        },
      });
      return updatedCourse;
    }),
});