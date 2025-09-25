// app/teacher/dashboard/page.tsx (Server Component)
import { redirect } from "next/navigation"; // Use redirect to handle redirects in server components
import { getServerAuthSession } from "~/server/auth"; // Import your session handler
import TeacherDashboard from "../../_components/teacherDashboard"; // Import your client component
import { Role } from "@prisma/client";

// This component runs on the server and performs server-side logic
export default async function TeacherDashboardPage() {
  // Fetch the session server-side
  const session = await getServerAuthSession();

  // Check if the user is authenticated and is a teacher
  if (!session || session.user.role !== Role.TEACHER) {
    redirect("/login"); // Redirect to the login page if not authenticated or not a teacher
    return null; // Prevent further rendering
  }

  // Extract teacherId from session
  const teacherId = session.user.id;

  // Render the client component and pass the teacherId prop
  return (
    <div className="flex flex-1 flex-col items-center">
      <h1 className="mt-5 text-4xl font-extrabold  text-slate-100">Teacher Dashboard</h1>
      <TeacherDashboard teacherId={teacherId} />
    </div>
  );
}
