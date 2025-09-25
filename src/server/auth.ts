// src/server/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type Session as NextAuthSession,
  type User as NextAuthUser,
} from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { env } from "~/env";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import type { Role } from "@prisma/client";

/** ---- Module augmentation ---- */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      department_id: string;
      first_name: string | null;
      semester_year: string | null;
      teacherId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    department_id: number;
    first_name: string | null;
    password?: string; // only present in authorize
    semester_year_id?: number | null;
    semester_year?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    department_id?: number | string;
    first_name?: string | null;
    semester_year?: string | null;
    teacherId?: string;
  }
}

/** ---- NextAuth options ---- */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db) as Adapter,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // Try student first
        let user =
          (await db.user.findFirst({
            where: { code: credentials.username },
            select: {
              id: true,
              email: true,
              first_name: true,
              role: true,
              department_id: true,
              password: true,
              semester_year_id: true,
            },
          })) as unknown as NextAuthUser | null;

        // If not student, try teacher
        if (!user) {
          const teacher = await db.teacher.findFirst({
            where: { code: credentials.username },
            select: {
              id: true,
              email: true,
              first_name: true,
              department_id: true,
              password: true,
            },
          });

          if (teacher) {
            user = {
              id: teacher.id,
              email: teacher.email ?? null,
              name: teacher.first_name ?? null,
              first_name: teacher.first_name ?? null,
              role: "TEACHER" as Role,
              department_id: teacher.department_id,
              password: teacher.password,
              // teachers don't have semester_year
              semester_year_id: null,
              semester_year: null,
            } as unknown as NextAuthUser;
          }
        }

        if (!user || !("password" in user) || !user.password) return null;

        // Check password
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        // Enrich student with semester_year (teacher remains null)
        // @ts-expect-error: optional property during authorize
        if (user.semester_year_id) {
          const sy = await db.semester_year.findUnique({
            where: { id: Number(user.semester_year_id) },
            select: { year_name: true, semester_name: true },
          });
          // @ts-expect-error: optional property during authorize
          user.semester_year = sy ? `${sy.year_name} - ${sy.semester_name}` : null;
        }

        // Strip password before returning
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = user as any;
        return safeUser as NextAuthUser;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser | null }) {
      if (user) {
        token.id = String(user.id);
        // @ts-expect-error role injected in authorize/student row
        token.role = (user.role ?? "STUDENT") as Role;
        // @ts-expect-error
        token.department_id = user.department_id;
        // @ts-expect-error
        token.first_name = user.first_name ?? null;
        // @ts-expect-error (set for students only in authorize)
        if (user.semester_year) token.semester_year = user.semester_year;

        // Teacher flag
        // @ts-expect-error
        if (user.role === "TEACHER") {
          token.teacherId = String(user.id);
        }
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: NextAuthSession;
      token: JWT;
    }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role ?? "STUDENT") as Role;
        session.user.department_id = String(token.department_id ?? "");
        session.user.first_name = (token.first_name ?? null) as string | null;
        session.user.semester_year = (token.semester_year ?? null) as string | null;
        if (token.teacherId) session.user.teacherId = String(token.teacherId);
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

/** Helper */
export const getServerAuthSession = () => getServerSession(authOptions);
