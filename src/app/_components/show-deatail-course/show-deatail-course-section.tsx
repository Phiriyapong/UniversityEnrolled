"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useState, useCallback } from "react";
import XLSX from "xlsx";
import type { BookType } from "xlsx";

import { api } from "~/trpc/react";

export default function ShowDetailCourseSection() {
  const departments = api.courses.getDepartments.useQuery().data ?? [];
  const semesterYear = api.courses.getSemesterYears.useQuery().data ?? [];
  
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [selectedSemesterYear, setSelectedSemesterYear] = useState<string>();
  const [selectedCourse, setSelectedCourse] = useState<string>();


  const course = api.courses.getCourseByDepartmentId.useQuery({
    departmentId: parseInt(selectedDepartment ?? "0"),
  });

  const { data: detailCourse } =
    api.courses.getDetailSectionCourseByIdWithSemesterYearId.useQuery({
      courseId: parseInt(selectedCourse ?? "0"),
      semesterYearId: parseInt(selectedSemesterYear ?? "0"),
    });

  const htmlTabletoExcel = useCallback(
    (_type: BookType, _fileName = "file") => {
      const date = new Date();
      const fileDate =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        "_" +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

      const file = _fileName + fileDate;

      const workbook = XLSX.utils.book_new();

      if (detailCourse) {
        for (const section of detailCourse) {
          const data = document.getElementById(section.id.toString());
          const worksheet = XLSX.utils.table_to_sheet(data);
          XLSX.utils.book_append_sheet(workbook, worksheet, section.name);
        }
        XLSX.write(workbook, {
          bookType: _type,
          bookSST: true,
          type: "base64",
        });
        XLSX.writeFile(workbook, file + "." + _type, {
          compression: true,
          cellStyles: true,
        });
      }
    },
    [detailCourse],
  );

  return (
    <div className="container mx-auto mt-5">
      <div className="grid grid-cols-3 rounded border border-white/20 p-4">
        <div className="">
          <p className="mb-1 pl-1">เลือกคณะ</p>
          <Select onValueChange={(e) => setSelectedDepartment(e)}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="departments" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem
                  key={department.id}
                  value={department.id.toString()}
                >
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <p className="mb-1 pl-1">เลือกรายวิชา</p>
          {course.data ? (
            <Select onValueChange={(e) => setSelectedCourse(e)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="course" />
              </SelectTrigger>
              <SelectContent>
                {course.data.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select disabled>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="course" />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          )}
        </div>
        <div className="">
          <p className="mb-1 pl-1">เลือกปีการศึกษา</p>
          {semesterYear ? (
            <Select onValueChange={(e) => setSelectedSemesterYear(e)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="course" />
              </SelectTrigger>
              <SelectContent>
                {semesterYear.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {"ปีการศึกษา " +
                      course.year_name.trim() +
                      " เทอม " +
                      course.semester_name.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select disabled>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="course" />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          )}
        </div>
        <div className="hidden">
          <p className="mb-1 pl-1">เลือกกลุ่ม</p>
          {semesterYear ? (
            <Select>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="course" />
              </SelectTrigger>
              <SelectContent>
                {semesterYear.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {"ปีการศึกษา " +
                      course.year_name.trim() +
                      " เทอม " +
                      course.semester_name.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select disabled>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="course" />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          )}
        </div>
      </div>
      {detailCourse && detailCourse?.length != 0 ? (
        <>
          <div className="mt-5 rounded border border-white/20 p-4">
            <div className="grid grid-cols-4">
              <div>
                <p className="text-xl">วิชา {detailCourse[0]?.course.name}</p>
              </div>
              <div className="mx-auto">
                <p className="text-lg">
                  รหัสวิชา {detailCourse[0]?.course.code}
                </p>
              </div>
              <div className="mx-auto">
                <p className="text-lg">
                  หน่วยกิต {detailCourse[0]?.course.unit}
                </p>
              </div>
              <div className="mx-auto">
                <button
                  type="button"
                  className="h-auto w-[200px] rounded bg-primary px-1 py-2 text-white"
                  onClick={() => htmlTabletoExcel("xlsx")}
                >
                  download file
                </button>
              </div>
            </div>
          </div>
          {detailCourse.map((section) => (
            <div
              className="mt-5 rounded border border-white/20"
              key={section.id.toString()}
            >
              <div className="border border-b-white/20 p-4">
                <p className="text-xl font-medium">{section.name}</p>
              </div>
              <div className=" p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>เวลาเรียน</p>
                    {section.section_time?.map((sectionTime) => (
                      <p key={sectionTime.id.toString()}>
                        {`${sectionTime.date} 
                        ${sectionTime.start_time.getHours() - 7}:${sectionTime.start_time.getMinutes() == 0 ? "00" : sectionTime.start_time.getMinutes()} -
                        ${sectionTime.end_time.getHours() - 7}:${sectionTime.end_time.getMinutes() == 0 ? "00" : sectionTime.end_time.getMinutes()}`}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p>จำนวนนักศึกษาลงทะเบียน {section.register_amount}</p>
                    <p>จำนวนนักศึกษาสูงสุดที่ลงได้ {section.amount}</p>
                  </div>
                </div>
              </div>
              <hr className="bg-white/20" />
              <div className="">
                <Table id={section.id.toString()}>
                  <TableCaption>รายชื่อนักศึกษาของวิชา</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">รหัสนักศึกษา</TableHead>
                      <TableHead>ชื่อ-นามสกุล</TableHead>
                      <TableHead className="text-right">สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.course_student.map((student) => (
                      <TableRow key={student.id.toString()}>
                        <TableCell className="font-medium">
                          {student.student?.code}
                        </TableCell>
                        <TableCell>
                          {student.student?.first_name +
                            " " +
                            student.student?.last_name}
                        </TableCell>
                        <TableCell className="text-right">
                          {student.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {section.course_student.length == 0 && (
                    <TableBody>
                      <TableCell colSpan={3} className="text-center">
                        ไม่มีข้อมูล
                      </TableCell>
                    </TableBody>
                  )}
                </Table>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="mt-10 text-center text-2xl">
          ไม่มีข้อมูลกรุณาเลือกข้อมูลใหม่
        </p>
      )}
    </div>
  );
}
