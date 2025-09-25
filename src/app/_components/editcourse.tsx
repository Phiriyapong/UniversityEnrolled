"use client";
import React, { useState } from 'react';
import { api } from '~/trpc/server'; // Import the tRPC client
import Modal from '~/app/_components/modal'; // Assume you have a Modal component

type Course = {
  id: number;
  name: string;
  code: string;
  unit: number;
  department_id: number;
  active: boolean;
};

type Section = {
  id: number;
  name: string;
  course_id: number;
};

type EditCourseProps = {
  initialCourses: Course[];
};

const EditCourse: React.FC<EditCourseProps> = ({ initialCourses }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [newSection, setNewSection] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCourse) {
      const { name, value } = e.target;
      setEditingCourse({ ...editingCourse, [name]: value });
    }
  };

  const handleEditClick = async (course: Course) => {
    setEditingCourse(course);
    // const data = await api.courses.getSectionsByCourseId(course.id);
    // setSections(data.sections);
    setIsModalOpen(true);
  };

  const handleSaveClick = async () => {
    // if (editingCourse) {
    //   await api.courses.updateCourse.mutateAsync({
    //     id: editingCourse.id!,
    //     name: editingCourse.name!,
    //     code: editingCourse.code!,
    //     unit: editingCourse.unit!,
    //   });

    //   if (newSection) {
    //     await api.courses.addSection.mutateAsync({
    //       name: newSection,
    //       course_id: editingCourse.id!,
    //     });
    //   }

    //   setEditingCourse(null);
    //   setIsModalOpen(false);
    //   const { courses: updatedCourses } = await api.courses.getCourses({ departmentId: 1 });
    //   setCourses(updatedCourses);
    // }
  };

  const handleCancelClick = () => {
    setEditingCourse(null);
    setIsModalOpen(false);
  };

  const handleNewSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSection(e.target.value);
  };

  const handleAddCourseClick = () => {
    setEditingCourse({ name: "", code: "", unit: 0, department_id: 1, active: true });
    setIsModalOpen(true);
  };

  const handleToggleActiveClick = async (course: Course) => {
    // await api.courses.updateCourse.mutateAsync({
    //   id: course.id,
    //   active: !course.active,
    // });
    // const { courses: updatedCourses } = await api.courses.getCourses({ departmentId: 1 });
    // setCourses(updatedCourses);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={handleAddCourseClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add Course
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 text-black border-b">Course Name</th>
            <th className="py-2 px-4 text-black border-b">Course Code</th>
            <th className="py-2 px-4 text-black border-b">Units</th>
            <th className="py-2 px-4 text-black border-b">Active</th>
            <th className="py-2 px-4 text-black border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="py-2 px-4 text-black border-b">{course.name}</td>
              <td className="py-2 px-4 text-black border-b">{course.code}</td>
              <td className="py-2 px-4 text-black border-b">{course.unit}</td>
              <td className="py-2 px-4 text-black border-b">{course.active ? "Yes" : "No"}</td>
              <td className="py-2 px-4 text-black border-b">
                <button
                  onClick={() => handleEditClick(course)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActiveClick(course)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                >
                  {course.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal onClose={handleCancelClick}>
          <div className="p-4">
            <h2 className="text-2xl mb-4">Edit Course</h2>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Course Name</label>
              <input
                type="text"
                name="name"
                value={editingCourse?.name || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Course Code</label>
              <input
                type="text"
                name="code"
                value={editingCourse?.code || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Units</label>
              <input
                type="number"
                name="unit"
                value={editingCourse?.unit || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Add Section</label>
              <input
                type="text"
                value={newSection}
                onChange={handleNewSectionChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveClick}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancelClick}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditCourse;
