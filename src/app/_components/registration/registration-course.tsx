"use client";

import type { Day, course } from "@prisma/client";
import SelectCourse from "./form/select-course";
import ShowCourseSelected from "./form/show-course-selected";
import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import TableShowCourse from "./table-show-course";
import { useRouter } from "next/navigation";
import { Drawer, Button } from "rsuite";

type Props = {
  courses: ({
    sections: {
      section_time: { date: Day; start_time: Date; end_time: Date }[];
      name: string;
      id: number;
      amount: number;
      register_amount: number;
    }[];
  } & course)[];
};

export type TListCourseSelected = Array<{
  course: {
    name: string;
    id: number;
  };
  section: {
    name: string;
  };
} | null>;

export type TSelectCourse = {
  id: string;
  courseId: number;
  courseName?: string;
  sectionId: number;
  error?: {
    course?: {
      message: string;
    };
    section?: {
      message: string;
    };
  };
};

export default function RegistrationCourse(props: Readonly<Props>) {
  const route = useRouter();
  const [isCourseSelectedShown, setIsCourseSelectedShown] =
    useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // Drawer state
  const [selectCourse, setSelectCourse] = useState<Array<TSelectCourse>>([]);

  const { mutate: createRegistration, status } =
    api.courses.registerCourses.useMutation({
      onSuccess: () => {
        setSelectCourse([]);
        route.push("/dashboard");
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const submitCreateRegistrationCourse = async () => {
    createRegistration({
      courses: selectCourse.map((field) => {
        return {
          courseId: field.courseId,
          sectionId: field.sectionId,
        };
      }),
    });
  };

  const sectionTime = useMemo(() => {
    return selectCourse.map(
      (
        field,
      ):
        | {
            sectionTimes: {
              date: Day;
              start_time: Date;
              end_time: Date;
            }[];
            course_name: string;
          }
        | undefined => {
        const course = props.courses.find(
          (course) => course.id === field.courseId,
        );
        if (!course) return;
        const section = course.sections.find(
          (section) => section.id === field.sectionId,
        );
        if (!section) return;
        return { sectionTimes: section.section_time, course_name: course.name };
      },
    );
  }, [props.courses, selectCourse]);

  const showDetailSelectCourse = useMemo(() => {
    return selectCourse.map((field) => {
      const course = props.courses.find(
        (course) => course.id === field.courseId,
      );
      if (!course) return null;
      const section = course.sections.find(
        (section) => section.id === field.sectionId,
      );
      if (!section) return null;
      return {
        course: { name: course.name, id: course.id },
        section: { name: section.name },
      };
    });
  }, [selectCourse, props.courses]);

  const recommendedCourses = useMemo(() => {
    // Example filter: Get courses with open registration and not full
    return props.courses.filter((course) =>
      course.sections.some(
        (section) => section.register_amount < section.amount,
      ),
    );
  }, [props.courses]);

  return (
    <div>
      <h1 className="my-4 text-center">ลงทะเบียนเรียน</h1>
      <div className="mx-auto">
        {/* Table to show courses */}
        <TableShowCourse sectionTime={sectionTime} />
      </div>
      <hr className="my-4" />
      <div>
        <p className="my-4">เลือกรายวิชาที่ต้องการสมัคร</p>
        <SelectCourse
          setSelectCourse={setSelectCourse}
          selectCourse={selectCourse}
          courses={props.courses}
          openDialog={setIsCourseSelectedShown}
          status={status}
        />
        <ShowCourseSelected
          submitCreateRegistrationCourse={submitCreateRegistrationCourse}
          courseSelected={showDetailSelectCourse}
          openDialog={setIsCourseSelectedShown}
          dialogState={isCourseSelectedShown}
        />
      </div>

      {/* Drawer for Recommended Courses */}
      <Button
        appearance="primary"
        onClick={() => setIsDrawerOpen(true)}
        className="mt-6"
      >
        View Recommended Courses
      </Button>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        size="sm"
      >
        <Drawer.Header>
          <Drawer.Title>Recommended Courses</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="space-y-4">
            {recommendedCourses.length > 0 ? (
              recommendedCourses.map((course) => (
                <div key={course.id} className="p-2 border-b">
                  <strong>{course.name}</strong> - {course.code}
                  <ul className="mt-2 list-disc ml-6">
                    {course.sections.map((section) => (
                      <li key={section.id}>
                        Section: {section.name}, Registered: {section.register_amount}/{section.amount}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No recommended courses available.</p>
            )}
          </div>
        </Drawer.Body>
      </Drawer>
    </div>
  );
}
