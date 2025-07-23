import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Add your registration API call here

    // On successful signup, navigate to home/index page
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-200 px-4">
      <section className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        {/* Logo, Title and Subtitle INSIDE Card */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center rounded-xl shadow">
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 21C12 21 4 13.613 4 8.75A4.75 4.75 0 0112 4a4.75 4.75 0 018 4.75C20 13.613 12 21 12 21z"
              />
            </svg>
          </div>
          <h2 className="text-[2rem] font-extrabold text-blue-800 mb-1 tracking-tight">Eldermate</h2>
          <p className="text-base font-medium text-blue-500 text-center">Trusted Health & Emotional Support</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5"
        >
          <label className="font-semibold text-blue-800 mb-1">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </label>
          <label className="font-semibold text-blue-800 mb-1">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="name@example.com"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </label>
          <label className="font-semibold text-blue-800 mb-1">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </label>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 hover:from-blue-700 hover:to-blue-500 transition text-white font-semibold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-[.98] mt-2"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-blue-500 text-sm font-medium mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="underline hover:text-blue-700 cursor-pointer">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
}
