import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import UnregisterButton from "../_components/UnregisterButton";  // Import the new component

export default async function Dashboard() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const isRegistered = await api.courses.isRegistered();
  const registeredCourses = isRegistered ? await api.courses.getRegisteredCourses() : [];

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="mt-3 p-2">
        <h1 className="text-4xl font-extrabold">Dashboard</h1>
      </div>
      <div className="mt-10 w-5/6">
        {isRegistered ? (
          <div>
            <Link
              className="block cursor-not-allowed rounded-full bg-primary/20 px-2 py-3 text-center text-gray-500"
              href={"#"}
              aria-disabled={isRegistered}
            >
              คุณได้ลงทะเบียนเรียนแล้ว
            </Link>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">Registered Courses:</h2>
              <div className="flex flex-col items-center p-6 min-h-screen" style={{ backgroundColor: '#121826' }}>
                <div className="overflow-x-auto w-full max-w-4xl">
                  <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="py-2 px-4 border-b">Course Name</th>
                        <th className="py-2 px-4 border-b">Course Code</th>
                        <th className="py-2 px-4 border-b">Section Name</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                   <tbody className="bg-gray-600">
  {registeredCourses
    .filter((cs) => cs.status !== 'Pass') // hide passed courses
    .map((courseItem) =>
      courseItem.course && courseItem.section_course ? (
        <tr key={courseItem.id}>
          <td className="py-2 px-4 border-b">{courseItem.course.name}</td>
          <td className="py-2 px-4 border-b">{courseItem.course.code}</td>
          <td className="py-2 px-4 border-b">{courseItem.section_course.name}</td>
          <td className="py-2 px-4 border-b">
  {courseItem.status === 'Inprogress' && (
    <UnregisterButton
      courseId={Number(courseItem.course.id)}
      sectionId={Number(courseItem.section_course.id)}
    />
  )}
</td>

        </tr>
      ) : null
    )}
</tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link
            className="block rounded-full bg-primary px-2 py-3 text-center disabled:cursor-not-allowed disabled:bg-primary/20 disabled:text-gray-500"
            href={"/registration"}
            aria-disabled={isRegistered}
          >
            ลงทะเบียนเรียน
          </Link>
        )}
      </div>
    </div>
  );
}
