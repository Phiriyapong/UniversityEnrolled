import React from "react";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { Role } from "@prisma/client";

type MenuItem = { title: string; path: string };

// Student/default menu
const studentMenuItems: MenuItem[] = [
  { title: "News", path: "/news" },
  { title: "ลงทะเบียนนักศึกษา", path: "/dashboard" },
  { title: "หน่วยกิต", path: "/unit" },
  { title: "ว่าง/ไม่ว่าง", path: "/availability" },
];

// Admin-only menu
const adminMenuItems: MenuItem[] = [
  { title: "รายวิชาและข้อมูลการลงทะเบียน", path: "/course" },
  { title: "เพิ่ม/แก้ไขรายวิชา", path: "/edit-course" },
];

// Teacher-only menu
const teacherMenuItems: MenuItem[] = [
  { title: "News", path: "/news" },
  { title: "Teacher Dashboard", path: "/teacher/dashboard" },
];

const Sidebar: React.FC = async () => {
  const session = await getServerAuthSession();

  let menuItems: MenuItem[] = studentMenuItems; // default

  if (session?.user?.role === Role.TEACHER) {
    menuItems = teacherMenuItems;
  } else if (session?.user?.role === Role.ADMIN) {
    menuItems = adminMenuItems; // <-- only admin menu, no student items
  }

  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold">
          {session?.user ? (
            session.user.role === Role.TEACHER
              ? `${session.user.first_name}'s Sidebar`
              : `${session.user.first_name} ปีการศึกษาที่ (${session.user.semester_year})'s Sidebar`
          ) : (
            "My Sidebar"
          )}
        </h1>
      </div>

      <nav className="mt-10">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index.toString()} className="mt-2">
              <Link href={item.path}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
