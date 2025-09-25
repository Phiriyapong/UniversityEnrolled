import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <div className="flex items-center">
        <div className="text-2xl font-bold">
          <Link href="/dashboard">KUScore Project</Link>
        </div>
      </div>
      <div className="flex items-center">
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          {session ? "Sign out" : "Sign in"}
        </Link>
        {/* <Link href="/dashboard">Dashboard</Link> */}
      </div>
    </div>
  );
}
