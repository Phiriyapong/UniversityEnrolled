import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import ShowDetailCourseSection from "~/app/_components/show-deatail-course/show-deatail-course-section";

export default async function Course() {
  const session = await getServerAuthSession();

  if (!session?.user) return redirect("/login");

  return <ShowDetailCourseSection />;
}
