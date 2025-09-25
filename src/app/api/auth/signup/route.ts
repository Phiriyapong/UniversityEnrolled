/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return Response.json(
        { message: "Please fill all fields" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name: name,
        last_name: name,
        code: "1234",
        department: {},
      },
    });

    if (!user) {
      return Response.json(
        { message: "User created not sucesss" },
        { status: 400 },
      );
    }

    return Response.redirect("/");
  } catch (error) {
    return Response.json(
      { message: "User created not sucesss" },
      { status: 400 },
    );
  }
}
