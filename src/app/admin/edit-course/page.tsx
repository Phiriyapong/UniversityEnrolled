"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { course, section_course, department } from "@prisma/client";
import { Checkbox } from "~/components/ui/checkbox";

type SectionInput = {
  id?: number;
  name: string;
  amount: number;
  semester_year_id: number;
};

type CourseInput = {
  id?: number;
  name: string;
  code: string;
  unit: number;
  department_id: number;
  isActive?: boolean;
  sections?: SectionInput[];
};

type CourseWithSectionsAndDepartment = course & {
  sections: section_course[];
  department: department;
};

const courseInitial: CourseInput = {
  name: "",
  code: "",
  unit: 0,
  department_id: 0,
  isActive: true,
  sections: [],
};

const editCourseIdInitial = 0;

const EditCoursePage: React.FC = () => {
  const { data: semesterYears = [] } = api.courses.getSemesterYears.useQuery();
  const { data: departments = [] } = api.courses.getDepartments.useQuery();
  const [selectedDepartment, setSelectedDepartment] = useState<string>();

  const { data: courses, refetch: refetchCourses } =
    api.courses.getCourseByDepartmentId.useQuery({
      departmentId: parseInt(selectedDepartment ?? "1"),
    });

  const { mutate: createCourse } = api.editCourse.addCourse.useMutation({
    onSuccess: async () => {
      await refetchCourses();
      setFormCourse(courseInitial);
    },
  });

  const { mutate: updateCourse } = api.editCourse.editCourse.useMutation({
    onSuccess: async () => {
      await refetchCourses();
      setEditingId(editCourseIdInitial);
      setFormCourse(courseInitial);
    },
  });

  const { mutate: toggleCourseStatus } =
    api.editCourse.deactivateCourse.useMutation({
      onSuccess: async () => {
        await refetchCourses();
      },
    });

  const [formCourse, setFormCourse] = useState<CourseInput>(courseInitial);
  const [editingId, setEditingId] = useState<number>(editCourseIdInitial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (departments.length > 0 && formCourse.department_id === 0) {
      setFormCourse((prev) => ({
        ...prev,
        department_id: departments[0]?.id || 0,
      }));
    }
  }, [departments, formCourse.department_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormCourse({
      ...formCourse,
      [name]: name === "unit" || name === "department_id" ? Number(value) : value,
    });
  };

  const handleSectionChange = (
    index: number,
    field: keyof SectionInput,
    value: string | number,
  ) => {
    const updatedSections = formCourse.sections ? [...formCourse.sections] : [];
    if (!updatedSections[index]) return;
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setFormCourse({ ...formCourse, sections: updatedSections });
  };

  const addSection = () => {
    const updatedSections = formCourse.sections
      ? [...formCourse.sections, { name: "", amount: 0, semester_year_id: semesterYears[0]?.id || 0 }]
      : [];
    setFormCourse({ ...formCourse, sections: updatedSections });
  };

  const removeSection = (index: number) => {
    const updatedSections = formCourse.sections ? [...formCourse.sections] : [];
    updatedSections.splice(index, 1);
    setFormCourse({ ...formCourse, sections: updatedSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId !== editCourseIdInitial) {
        updateCourse({ ...formCourse, id: editingId });
      } else {
        createCourse(formCourse);
      }
    } catch (err) {
      setError('Failed to save the course. Please check your inputs.');
    }
  };

  const handleEdit = (course: CourseWithSectionsAndDepartment) => {
    setEditingId(course.id);
    setFormCourse(course);
  };

  const handleToggleStatus = (id: number, isActive: boolean) => {
    toggleCourseStatus({ id, isActive: !isActive });
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-8 h-1/2 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="name"
            >
              Course Name
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="name"
              name="name"
              type="text"
              value={formCourse.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="code"
            >
              Course Code
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="code"
              name="code"
              type="text"
              value={formCourse.code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="unit"
            >
              Unit
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="unit"
              name="unit"
              type="number"
              value={formCourse.unit}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="department_id"
            >
              Department
            </label>
            <select
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="department_id"
              name="department_id"
              value={formCourse.department_id}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No Departments Available
                </option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <p>isActive</p>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="isActive"
                defaultChecked
                onCheckedChange={(checked) =>
                  setFormCourse({
                    ...formCourse,
                    isActive: checked != "indeterminate" ? checked : false,
                  })
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                ></label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="mb-2 block text-sm font-bold text-gray-700">
              Sections
            </p>
            {formCourse.sections?.map((section, index) => (
              <div key={index} className="mb-4 rounded border p-2">
                <input type="hidden" name={`section_id`} value={section.id} />
                <div className="mb-2">
                  <label
                    className="block text-sm font-bold text-gray-700"
                    htmlFor={`section_name_${index}`}
                  >
                    Name
                  </label>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    id={`section_name_${section.id}`}
                    type="text"
                    value={section.name}
                    onChange={(e) =>
                      handleSectionChange(index, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    className="block text-sm font-bold text-gray-700"
                    htmlFor={`section_amount_${index}`}
                  >
                    Amount
                  </label>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    id={`section_amount_${index}`}
                    type="number"
                    value={section.amount}
                    onChange={(e) =>
                      handleSectionChange(
                        index,
                        "amount",
                        parseInt(e.target.value, 10),
                      )
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    className="block text-sm font-bold text-gray-700"
                    htmlFor={`section_semester_year_${index}`}
                  >
                    Semester Year
                  </label>
                  <select
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    id={`section_semester_year_${index}`}
                    value={section.semester_year_id}
                    onChange={(e) =>
                      handleSectionChange(
                        index,
                        "semester_year_id",
                        parseInt(e.target.value, 10),
                      )
                    }
                    required
                  >
                    <option value="" disabled>
                      Select Semester Year
                    </option>
                    {semesterYears.length > 0 ? (
                      semesterYears.map((sy) => (
                        <option key={sy.id} value={sy.id}>
                          {sy.semester_name} {sy.year_name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Semester Years Available
                      </option>
                    )}
                  </select>
                </div>
                <button
                  type="button"
                  className="mt-2 rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
                  onClick={() => removeSection(index)}
                >
                  Remove Section
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
              onClick={addSection}
            >
              Add Section
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              {editingId !== editCourseIdInitial
                ? "Update Course"
                : "Add Course"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex h-1/2 flex-wrap justify-center overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-black">
            {courses?.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.department.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 font-bold text-white hover:bg-yellow-700"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className={`rounded px-2 py-1 font-bold text-white hover:bg-${course.isActive ? "red-700" : "green-700"
                      } ${course.isActive ? "bg-red-500" : "bg-green-500"}`}
                    onClick={() => handleToggleStatus(course.id, course.isActive)}
                  >
                    {course.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditCoursePage;
