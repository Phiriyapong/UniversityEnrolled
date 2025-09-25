"use client";
import type { Day, course } from "@prisma/client";
import { memo, useMemo } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import Select from "react-select";
import type { GroupBase, SingleValue, StylesConfig } from "react-select";
import type { TSelectCourse } from "../registration-course";

type Option = {
  value: string;
  label: string;
};

interface Props {
  courses: ({
    sections: {
      section_time: { date: Day; start_time: Date; end_time: Date }[];
      name: string;
      id: number;
      amount: number;
      register_amount: number;
    }[];
  } & course)[];
  openDialog: Dispatch<SetStateAction<boolean>>;
  status: "idle" | "pending" | "error" | "success";
  selectCourse: TSelectCourse[];
  setSelectCourse: Dispatch<SetStateAction<TSelectCourse[]>>;
}

function handleEventSelect(
  field: TSelectCourse,
  handleItem: string,
): StylesConfig<Option, false, GroupBase<Option>> {
  if (handleItem == "course") {
    if (field.courseId == 0 && field.error?.course?.message) {
      return {
        control: (provided) => ({
          ...provided,
          borderColor: "red",
          boxShadow: "0 0 0 1px red",
          backgroundColor: "#121212",
        }),
      };
    }
  }
  if (handleItem == "section") {
    if (field.sectionId == 0 && field.error?.section?.message) {
      return {
        control: (provided) => ({
          ...provided,
          borderColor: "red",
          boxShadow: "0 0 0 1px red",
          backgroundColor: "#121212",
        }),
      };
    }
  }
  return {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "blue" : "gray",
      boxShadow: state.isFocused ? "0 0 0 1px blue" : "none",
      backgroundColor: "#121212",
    }),
  };
}

function SelectCourse(props: Readonly<Props>) {
  const { selectCourse, setSelectCourse, status, courses, openDialog } = props;

  const optionsCourse = useMemo(() => {
    return courses.map((course) => {
      return {
        value: course.id.toString(),
        label: course.code + " " + course.name,
      };
    });
  }, [courses]);

  const optionsSection = (courseId: number) => {
    const course = courses.find((course) => course.id === courseId);
    if (!course) return [];
    return (
      course.sections?.map((section) => {
        return {
          value: section.id.toString(),
          label:
            section.name +
            (section.amount <= section.register_amount ? " (เต็ม)" : ""),
        };
      }) ?? []
    );
  };

  const addField = () => {
    const uuid = Math.random().toString(36).substring(7);
    setSelectCourse([
      ...selectCourse,
      {
        id: uuid,
        courseId: 0,
        sectionId: -1,
      },
    ]);
  };

  const removeField = (id: string) => {
    setSelectCourse(selectCourse.filter((field) => field.id !== id));
  };

  const handleSelectCourseIdChange = (id: string, selectedOption: Option) => {
    const newSelectCourseFromChange = selectCourse.map((field) => {
      if (field.id === id) {
        return {
          ...field,
          courseId: +selectedOption.value,
          sectionId: 0,
          error: {
            ...field.error,
            course: undefined,
            section: undefined,
          },
        };
      }
      return field;
    });
    setSelectCourse(newSelectCourseFromChange);
  };

  const handleSelectSectionIdChange = (id: string, selectedOption: Option) => {
    const newSelectCourseFromChange = selectCourse.map((field) => {
      if (field.id === id) {
        return {
          ...field,
          sectionId: +selectedOption.value,
          error: {
            ...field.error,
            section: undefined,
          },
        };
      }
      return field;
    });
    setSelectCourse(newSelectCourseFromChange);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !verifyRequiredFieldAndSetError() &&
      !vertifyRepeatedCourse() &&
      !vertifyTimeConflict() &&
      selectCourse.length > 0
    ) {
      clearDataError();
      openDialog(true);
    }
  };

  const vertifyTimeConflict = () => {
    const sectionTimes = selectCourse.map((field) => {
      const course = courses.find((course) => course.id === field.courseId);
      if (!course) return [];
      const section = course.sections.find(
        (section) => section.id === field.sectionId,
      );
      if (!section) return [];
      return section.section_time;
    });

    const sectionTimesFlat = sectionTimes.flat();

    const sectionTimesFlatGroupByDate = sectionTimesFlat.reduce(
      (acc, section) => {
        const date = section.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(section);
        return acc;
      },
      {} as Record<Day, typeof sectionTimesFlat>,
    );

    const sectionTimesFlatGroupByDateArray = Object.values(
      sectionTimesFlatGroupByDate,
    );

    const timeConflict = sectionTimesFlatGroupByDateArray.some(
      (sectionTimes) => {
        const sectionTimesSorted = [...sectionTimes].sort((a, b) => {
          return a.start_time.getTime() - b.start_time.getTime();
        });

        for (const item of sectionTimesSorted) {
          for (const item2 of sectionTimesSorted) {
            if (item !== item2) {
              if (
                item.start_time.getTime() >= item2.start_time.getTime() &&
                item.start_time.getTime() < item2.end_time.getTime()
              ) {
                return true;
              }
              if (
                item.end_time.getTime() > item2.start_time.getTime() &&
                item.end_time.getTime() <= item2.end_time.getTime()
              ) {
                return true;
              }
            }
          }
        }

        return false;
      },
    );

    if (timeConflict) {
      setSelectCourse((prev) => {
        return prev.map((field) => {
          return {
            ...field,
            error: {
              ...field.error,
              section: {
                message: "เวลาซ้ำ",
              },
            },
          };
        });
      });
    }

    return timeConflict;
  };

  const clearDataError = () => {
    setSelectCourse((prev) => {
      return prev.map((field) => {
        return {
          ...field,
          error: {
            course: undefined,
            section: undefined,
          },
        };
      });
    });
  };

  const vertifyRepeatedCourse = () => {
    const courseIds = selectCourse.map((field) => field.courseId);
    const repeatedCourse = new Set(courseIds).size !== courseIds.length;
    if (repeatedCourse) {
      setSelectCourse((prev) => {
        return prev.map((field) => {
          return {
            ...field,
            error: {
              ...field.error,
              course: {
                message: "รายวิชาซ้ำ",
              },
            },
          };
        });
      });
    }
    return repeatedCourse;
  };

  const verifyRequiredFieldAndSetError = () => {
    setSelectCourse((prev) => {
      return prev.map((field) => {
        if (field.courseId === 0) {
          return {
            ...field,
            error: {
              ...field.error,
              course: {
                message: "กรุณาเลือกรายวิชา",
              },
            },
          };
        }
        if (field.sectionId === 0) {
          return {
            ...field,
            error: {
              ...field.error,
              section: {
                message: "กรุณาเลือกกลุ่มเรียน",
              },
            },
          };
        }
        return field;
      });
    });
    return selectCourse.some((field) => {
      return (
        field.courseId === 0 || field.sectionId === 0 || field.sectionId === -1
      );
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col" id="">
        {selectCourse.map((field) => (
          <div className="mb-5" key={field.id}>
            <div className=" mb-1 flex w-full flex-row items-start gap-x-5">
              <div className="w-2/5">
                <Select
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      //after select dropdown option
                      primary50: "gray",
                      //Border and Background dropdown color
                      primary: "#CAFFFA",
                      //Background hover dropdown color
                      primary25: "gray",
                      //Background color
                      neutral0: "black",
                      //No options color
                      neutral40: "#CAFFCA",
                      //Select color
                      neutral50: "#F4FFFD",
                      //Text color
                      neutral80: "#F4FFFD",
                    },
                  })}
                  styles={handleEventSelect(field, "course")}
                  options={optionsCourse}
                  onChange={(selectedOption: SingleValue<Option>) => {
                    if (selectedOption) {
                      handleSelectCourseIdChange(field.id, selectedOption);
                    }
                  }}
                  id={field.courseId.toString()}
                />
                <p className="mt-1 text-xs italic text-red-500">
                  {field.error?.course?.message}
                </p>
              </div>
              <div className="w-2/5">
                <Select
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      //after select dropdown option
                      primary50: "gray",
                      //Border and Background dropdown color
                      primary: "#CAFFFA",
                      //Background hover dropdown color
                      primary25: "gray",
                      //Background color
                      neutral0: "black",
                      //No options color
                      neutral40: "#CAFFCA",
                      //Select color
                      neutral50: "#F4FFFD",
                      //Text color
                      neutral80: "#F4FFFD",
                    },
                  })}
                  styles={handleEventSelect(field, "section")}
                  ref={(ref) => {
                    if (
                      ref &&
                      (field.sectionId == -1 || ref.props.options.length == 0)
                    ) {
                      ref.clearValue();
                    }
                  }}
                  onChange={(selectedOption: SingleValue<Option>) => {
                    if (selectedOption) {
                      handleSelectSectionIdChange(field.id, selectedOption);
                    }
                  }}
                  options={optionsSection(field.courseId)}
                  isDisabled={field.sectionId == -1}
                  id={field.sectionId.toString()}
                  isClearable={true}
                />
                <p className="mt-1 text-xs italic text-red-500">
                  {field.error?.section?.message}
                </p>
              </div>
              <div className="w-auto">
                <svg
                  onClick={() => removeField(field.id)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-around">
        <button
          onClick={addField}
          id=""
          type="button"
          className="mb-2 me-2 rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          เพิ่มรายวิชา
        </button>
        <button
          disabled={status === "pending" || selectCourse.length == 0}
          id=""
          type="submit"
          className="mb-2 me-2 cursor-pointer rounded-full bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:cursor-default disabled:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          ตรวจสอบการลงทะเบียน
        </button>
      </div>
    </form>
  );
}

export default memo(SelectCourse);
