/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useState } from "react";
import Image from "next/image";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import mobileAnalytics from "../../../public/undraw_mobile_analytics_72sr.svg";

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });
  
      if (result?.ok) {
        router.push("/redirect");
      } else {
        console.error(result?.error); // Log error
        alert(result?.error || "Login failed"); // Display error to user
      }
  
    } catch (error) {
      console.log("error", error);
      alert("An error occurred. Please try again."); // Display generic error
    }
  };
  

  return (
    <div className="flex h-screen flex-wrap items-center justify-center">
      <div className="w-1/3">
        <Image src={mobileAnalytics} alt="" />
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="rounded-md bg-inherit p-6 shadow-md"
        >
          <div className="mb-8">
            <p className="text-center text-5xl font-black">KU SCORE</p>
          </div>
          <div className="mb-4">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded border border-white bg-inherit px-3 py-2" // Added border
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-white bg-inherit px-3 py-2" // Added border
            />
          </div>
          <button
            type="submit"
            className="mb-4 w-full rounded-full bg-primary py-2 font-bold uppercase text-white"
          >
            login
          </button>{" "}
        </form>
      </div>
    </div>
  );
}
