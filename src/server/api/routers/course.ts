// /server/api/routers/courses.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PassStatus } from "@prisma/client";

const courseSectionSchema = z.object({
  courseId: z.number(),
  sectionId: z.number(),
});

const registerCoursesSchema = z.object({
  courses: z.array(courseSectionSchema),
});

export const coursesRouter = createTRPCRouter({
  getDepartments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.department.findMany();
  }),
  getSemesterYears: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.semester_year.findMany();
  }),
  getCourses: protectedProcedure
    .input(
      z.object({
        departmentId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const studentCourses = await ctx.db.course_student.findMany({
        where: {
          student_id: ctx.session.user.id,
          status: {
            in: [PassStatus.Pass, PassStatus.Inprogress, PassStatus.NotPass],
          },
        },
        select: {
          course_id: true,
          status: true,
          creditsEarned: true, // Fetch creditsEarned
        },
      });

      const studentCourseIds = studentCourses
        .map((course) => course.course_id)
        .filter((course_id): course_id is number => course_id !== null);

      const currentSemester = await ctx.db.current_semester.findFirst();

      const courses = await ctx.db.course.findMany({
        where: {
          department_id: input.departmentId,
          NOT: {
            id: {
              in: studentCourseIds,
            },
          },
          AND: [
            {
              OR: [
                {
                  prerequisites: {
                    every: {
                      prerequisite_id: {
                        in: studentCourseIds,
                      },
                    },
                  },
                },
                {
                  prerequisites: {
                    none: {},
                  },
                },
              ],
            },
            {
              sections: {
                some: {
                  semester_year_id: currentSemester?.semester_year_id,
                },
              },
            },
          ],
        },
        include: {
          sections: {
            select: {
              id: true,
              name: true,
              amount: true,
              register_amount: true,
              section_time: {
                select: {
                  date: true,
                  start_time: true,
                  end_time: true,
                },
              },
              course_student: {
                include: {
                  student: {
                    select: {
                      id: true,
                      first_name: true,
                      last_name: true,
                    },
                  },
                },
              },
            },
          },
          mandatory_for: {
            select: {
              id: true,
            },
          },
        },
      });      

      const courseStatuses: { [key: number]: PassStatus } = {};
      const creditsEarned: { [key: number]: number } = {};
      studentCourses.forEach((course) => {
        if (course.course_id !== null) {
          courseStatuses[course.course_id] = course.status;
          creditsEarned[course.course_id] = course.creditsEarned;
        }
      });

      const coursesWithCreditsEarned = courses.map(course => ({
        ...course,
        creditsEarned: creditsEarned[course.id] || 0, // Set default to 0 if not found
      }));

      return { courses: coursesWithCreditsEarned, courseStatuses };
    }),
    
  getUnit: protectedProcedure
    .input(
      z.object({
        departmentId: z.number(),
        majorId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const studentCourses = await ctx.db.course_student.findMany({
        where: {
          student_id: ctx.session.user.id,
        },
        select: {
          course_id: true,
          status: true,
          creditsEarned: true, // Fetch creditsEarned
        },
      });

      const courses = await ctx.db.course.findMany({
        where: {
          department_id: input.departmentId,
        },
        include: {
          mandatory_for: {
            where: {
              major_id: input.majorId,
            },
            select: {
              id: true,
            },
          },
          sections: {
            select: {
              id: true,
              name: true,
              amount: true,
              register_amount: true,
              semester_year_id: true,
              section_time: {
                select: {
                  date: true,
                  start_time: true,
                  end_time: true,
                },
              },
            },
          },
        },
      });

      const courseStatuses: { [key: number]: PassStatus } = {};
      const creditsEarned: { [key: number]: number } = {};
      studentCourses.forEach((course) => {
        if (course.course_id !== null) {
          courseStatuses[course.course_id] = course.status;
          creditsEarned[course.course_id] = course.creditsEarned;
        }
      });

      const coursesWithCreditsEarned = courses.map(course => ({
        ...course,
        creditsEarned: creditsEarned[course.id] || 0, // Set default to 0 if not found
      }));

      return { courses: coursesWithCreditsEarned, courseStatuses };
    }),
    getTeacherCourses: protectedProcedure
  .input(z.object({ teacherId: z.string() }))
  .query(async ({ input, ctx }) => {
    const courses = await ctx.db.course.findMany({
      where: { teacher_id: input.teacherId },
      include: {
        sections: {
          include: {
            section_time: true,
            course_student: {
              where: { status: { not: "Pass" } }, // keep only current students
              include: {
                student: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    availability: {
                      select: { day: true, start_time: true, end_time: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return courses;
  }),


  registerCourses: protectedProcedure
    .input(registerCoursesSchema)
    .mutation(async ({ input, ctx }) => {
      const { courses } = input;

      const sectionIds = courses.map(({ sectionId }) => sectionId);

      const sections = await ctx.db.section_course.findMany({
        where: {
          id: {
            in: sectionIds,
          },
        },
        select: {
          id: true,
          amount: true,
          register_amount: true,
          section_time: {
            select: {
              date: true,
              start_time: true,
              end_time: true,
            },
          },
        },
      });

      const fullSections = sections.filter(
        (section) => section.amount <= section.register_amount,
      );

      if (fullSections.length > 0) {
        throw new Error(
          `Section(s) ${fullSections.map((section) => section.id).join(", ")} are full`,
        );
      }

      // add amount to register_amount
      await ctx.db.section_course.updateMany({
        where: {
          id: {
            in: sectionIds,
          },
        },
        data: {
          register_amount: {
            increment: 1,
          },
        },
      });

      const registrations = courses.map(({ courseId, sectionId }) => ({
        student_id: ctx.session.user.id,
        course_id: courseId,
        section_course_id: sectionId,
        status: PassStatus.Inprogress,
      }));

      await ctx.db.course_student.createMany({
        data: registrations,
      });

      return { success: true, message: "Courses registered successfully" };
    }),
  isRegistered: protectedProcedure.query(async ({ ctx }) => {
    const studentId = ctx.session.user.id;
    const currentSemester = await ctx.db.current_semester.findFirst();
    const registeredCourse = await ctx.db.course_student.findFirst({
      where: {
        student_id: studentId,
        course: {
          sections: {
            some: {
              semester_year_id: {
                equals: currentSemester?.semester_year_id,
              },
            },
          },
        },
      },
    });
    // debug last query
    return !!registeredCourse;
  }),
  getRegisteredCourses: protectedProcedure.query(async ({ ctx }) => {
    const studentId = ctx.session.user.id;
    const currentSemester = await ctx.db.current_semester.findFirst();
    const registeredCourses = await ctx.db.course_student.findMany({
      where: {
        student_id: studentId,
        section_course: {
          semester_year_id: currentSemester?.semester_year_id,
        },
      },
      include: {
        course: true,
        section_course: true,
      },
    });
    return registeredCourses;
  }),
  getCourseByDepartmentId: protectedProcedure
    .input(
      z.object({
        departmentId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.course.findMany({
        where: {
          department_id: input.departmentId,
        },
        include: {
          sections: true, // Include sections here
          department: true,
        },
      });
    }),
  getDetailSectionCourseByIdWithSemesterYearId: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        semesterYearId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.section_course.findMany({
        where: {
          course_id: input.courseId,
          semester_year_id: input.semesterYearId,
        },
        include: {
          section_time: true,
          course: true,
          semester_year: true,
          course_student: {
            include: {
              student: true,
            },
          },
        },
      });
    }),
  updateCourse: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        code: z.string(),
        unit: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedCourse = await ctx.db.course.update({
        where: { id: input.id },
        data: {
          name: input.name,
          code: input.code,
          unit: input.unit,
        },
      });
      return updatedCourse;
    }),
  getSectionsByCourseId: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const sections = await ctx.db.section_course.findMany({
        where: {
          course_id: input.courseId,
        },
      });

      return { sections };
    }),
  addSection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        course_id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const newSection = await ctx.db.section_course.create({
        data: {
          name: input.name,
          course_id: input.course_id,
          amount: 50, // Default value
          register_amount: 0, // Default value
          semester_year_id: 1, // Default value or fetch the current semester_year_id
        },
      });
      return newSection;
    }),
    unregisterCourse: protectedProcedure
  .input(
    z.object({
      courseId: z.number(),
      sectionId: z.number(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { courseId, sectionId } = input;

    // Find the course_student entry for the student and the specific course/section
    const registration = await ctx.db.course_student.findFirst({
      where: {
        student_id: ctx.session.user.id,
        course_id: courseId,
        section_course_id: sectionId,
      },
    });

    if (!registration) {
      throw new Error('You are not registered for this course.');
    }

    // Remove the student registration
    await ctx.db.course_student.delete({
      where: {
        id: registration.id,
      },
    });

    // Decrement the register_amount in the section
    await ctx.db.section_course.update({
      where: { id: sectionId },
      data: {
        register_amount: {
          decrement: 1,
        },
      },
    });

    return { success: true, message: 'Successfully unregistered from the course.' };
  }),
  getTermsWithCourses: protectedProcedure.query(async ({ ctx }) => {
    const terms = await ctx.db.semester_year.findMany({
      include: {
        course: {
          include: {
            department: true,
          },
        },
      },
    });
    return terms;
  }),

  // Assign a course to a term
  assignCourseToTerm: protectedProcedure
    .input(
      z.object({
        termId: z.number(),
        courseId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.course.update({
        where: { id: input.courseId },
        data: {
          semester_year: {
            connect: { id: input.termId },
          },
        },
      });
      return { success: true, message: "Course assigned to term successfully" };
    }),

  // Remove a course from a term
  removeCourseFromTerm: protectedProcedure
    .input(
      z.object({
        termId: z.number(),
        courseId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.course.update({
        where: { id: input.courseId },
        data: {
          semester_year: {
            disconnect: { id: input.termId },
          },
        },
      });
      return { success: true, message: "Course removed from term successfully" };
    }),
});
