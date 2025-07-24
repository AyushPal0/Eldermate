import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { authService } from "../utils/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setToast(null);
    setIsSubmitting(true);

    try {
      // Call signup API
      await authService.signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'user' // Default role
      });

      // Show success message
      setToast({
        type: 'success',
        message: 'Account created successfully! Redirecting to login...'
      });
      
      // Wait a moment before redirecting
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      // Handle error
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed. Please try again.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-200 px-4">
      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-6 left-1/2 z-50 -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg text-white ${
          toast.type === 'error' 
            ? 'bg-gradient-to-r from-red-400 to-red-700' 
            : 'bg-gradient-to-r from-green-400 to-green-700'
        } animate-fade-in`}>
          {toast.message}
        </div>
      )}
      
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

        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
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
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg transition text-white font-semibold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2 ${isSubmitting ? 'bg-blue-400 cursor-wait' : 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 hover:from-blue-700 hover:to-blue-500 active:scale-[.98]'}`}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
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
