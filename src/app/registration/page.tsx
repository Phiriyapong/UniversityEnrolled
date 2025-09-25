import { getServerAuthSession } from "~/server/auth";
import RegistrationCourse from "../_components/registration/registration-course";
import { api } from "~/trpc/server";

export default async function Registration() {
  const session = await getServerAuthSession();

  if (!session?.user) return null;

  const { courses } = await api.courses.getCourses({
    departmentId: +session?.user.department_id,
  });

  return (
    <div className="flex h-screen flex-col flex-wrap items-center ">
      <div className="container mt-4">
        <RegistrationCourse courses={courses} />
      </div>
    </div>
  );
}
