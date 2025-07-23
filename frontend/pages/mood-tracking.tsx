"use client";
import React, { useState } from "react";
import type { JSX } from "react";
import Link from "next/link";

// Reusable Navbar with Sign In button (top-right)
function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-end" aria-label="Main site navigation">
      <Link
        href="/signin"
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        Sign In
      </Link>
    </nav>
  );
}

// Reuse homepage footer styling
function Footer() {
  return (
    <footer className="w-full text-center text-gray-400 text-sm pb-7 px-4">
      © 2024 Eldermate. Empowering seniors and caregivers with accessible technology.
    </footer>
  );
}

type MoodOption = "Happy" | "Okay" | "Sad" | "Worried";

const moodOptions: { label: MoodOption; icon: JSX.Element }[] = [
  {
    label: "Happy",
    icon: (
      <svg
        className="w-10 h-10 text-yellow-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    label: "Okay",
    icon: (
      <svg
        className="w-10 h-10 text-blue-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="15" x2="16" y2="15" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    label: "Sad",
    icon: (
      <svg
        className="w-10 h-10 text-blue-700"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    label: "Worried",
    icon: (
      <svg
        className="w-10 h-10 text-indigo-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 9l.01.01" />
        <path d="M15 9l.01.01" />
        <path d="M12 11v2" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
];

export default function MoodTrackingPage() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [textInput, setTextInput] = useState("");

  const onMoodClick = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  const onSubmit = () => {
    console.log("Selected Mood:", selectedMood);
    console.log("Text Input:", textInput.trim());
    // Here you could add integration with AI assistant or API calls
    alert(`Mood: ${selectedMood || "None"}\nMessage: ${textInput.trim() || "No message"}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-200 flex flex-col">
      <Navbar />

      <main className="flex flex-col flex-1 items-center px-6 py-16 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center tracking-tight">
          How are you feeling today?
        </h1>

        {/* Mood Options Grid */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-md mb-10">
          {moodOptions.map(({ label, icon }) => {
            const isSelected = label === selectedMood;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onMoodClick(label)}
                className={`flex flex-col items-center justify-center rounded-xl shadow-md px-6 py-8 transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-blue-400
                  ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white text-blue-700 hover:shadow-lg hover:-translate-y-1"
                  }
                `}
              >
                {icon}
                <span className="mt-4 font-semibold text-lg">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Text Input */}
        <textarea
          rows={4}
          placeholder="Or tell me..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full max-w-md rounded-lg border border-blue-300 px-4 py-3 text-gray-700 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm mb-8"
          aria-label="Optional free-form mood description"
        />

        {/* Submit Button */}
        <button
          type="button"
          disabled={!selectedMood && !textInput.trim()}
          onClick={onSubmit}
          className={`w-full max-w-md rounded-lg py-3 font-bold text-white shadow-md transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            selectedMood || textInput.trim()
              ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-500 cursor-pointer"
              : "bg-blue-300 cursor-not-allowed"
          }`}
          aria-disabled={!selectedMood && !textInput.trim()}
          aria-label="Chat with AI Assistant"
        >
          Chat with AI Assistant
        </button>
      </main>

      <Footer />
    </div>
  );
}
