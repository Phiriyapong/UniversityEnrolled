import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function Redirect() {
  const session = await getServerAuthSession();

  // Redirect to login if the user is not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Redirect based on the user role
  if (session?.user && session?.user.role === Role.STUDENT) {
    redirect("/dashboard");
  }

  if (session?.user && session?.user.role === Role.ADMIN) {
    redirect("/admin/course");
  }

  // Redirect for teacher role (add this condition)
  if (session?.user && session?.user.role === Role.TEACHER) {
    redirect("/teacher/dashboard"); // Set the correct teacher dashboard path
  }

  return <>redirect</>;
}
