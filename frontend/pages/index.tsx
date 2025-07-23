import React from "react";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 21C12 21 4 13.613 4 8.75A4.75 4.75 0 0112 4a4.75 4.75 0 018 4.75C20 13.613 12 21 12 21z"/>
      </svg>
    ),
    title: "Mood Tracking",
    desc: "Simple, voice-enabled mood check-ins with emotional support.",
  },
  {
    icon: (
      <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth={2}/>
        <path strokeWidth={2} d="M16.7 17.3c-1.2-1.1-2.5-2.1-2.5-5.3v-1.2a2 2 0 00-4 0v.5"/>
      </svg>
    ),
    title: "AI Assistant",
    desc: "24/7 conversational support with voice-to-speech capabilities.",
  },
  {
    icon: (
      <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth={2}/>
        <path strokeWidth={2} d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Smart Reminders",
    desc: "Medication, appointments, and daily activity reminders.",
  },
  {
    icon: (
      <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M14.828 21H9.172A2.003 2.003 0 017 19.172V4.828A2.003 2.003 0 019.172 3h5.656A2.003 2.003 0 0117 4.828v14.344A2.003 2.003 0 0114.828 21z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8h.01"/>
      </svg>
    ),
    title: "Emergency Support",
    desc: "One-touch emergency alerts to caregivers and family.",
  },
  {
    icon: (
      <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth={2}/>
        <path strokeWidth={2} d="M12 12c2.209 0 4 1.791 4 4H8c0-2.209 1.791-4 4-4z"/>
      </svg>
    ),
    title: "Caregiver Dashboard",
    desc: "Real-time monitoring and support for family members.",
  },
  {
    icon: (
      <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="6" y="8" width="12" height="10" rx="3" strokeWidth={2}/>
        <path strokeWidth={2} d="M12 11v2"/>
        <path strokeWidth={2} d="M12 17h0"/>
      </svg>
    ),
    title: "Accessible Design",
    desc: "Large buttons, high contrast, and voice-first interface.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-200 flex flex-col">
      {/* Top Sign In button */}
      <header className="w-full max-w-7xl mx-auto flex justify-end items-center pt-8 pb-2 px-10">
        <Link
          href="/signin"
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="mt-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 21C12 21 4 13.613 4 8.75A4.75 4.75 0 0112 4a4.75 4.75 0 018 4.75C20 13.613 12 21 12 21z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2 text-center">Eldermate</h1>
          <p className="text-xl text-gray-500 font-semibold mb-2 text-center">Health &amp; Emotional Support Platform</p>
          <p className="max-w-xl text-gray-500 mb-7 text-center">
            Connecting elderly users with their caregivers through voice-first technology, mood tracking, AI assistance, and emergency support.
          </p>
          <div className="flex gap-4 mb-8 flex-col sm:flex-row">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg"
            >
              Get Started
            </Link>
            <button
              className="px-8 py-3 rounded-lg bg-white border border-blue-500 text-blue-600 font-bold shadow hover:bg-blue-50 transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>


      




<section className="max-w-6xl mx-auto pt-2 pb-8 px-4">
  <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center mb-10 mt-8">
    Designed for Accessibility &amp; Care
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    {features.map((f) => {
      const isMood = f.title === "Mood Tracking";
      const isSmartReminders = f.title === "Smart Reminders";

      const card = (
        <div
          key={f.title}
          className="rounded-2xl bg-gradient-to-br from-white/90 via-blue-50 to-blue-200 shadow-lg flex flex-col items-center px-5 py-7 transition transform hover:scale-[1.025] cursor-pointer"
        >
          <div className="mb-3">{f.icon}</div>
          <h3 className="font-bold text-blue-800 text-lg mb-2 text-center">{f.title}</h3>
          <p className="text-gray-500 text-center text-base">{f.desc}</p>
        </div>
      );

      if (isMood) {
        return (
          <Link href="/mood-tracking" key={f.title} aria-label="Go to Mood Tracking">
            {card}
          </Link>
        );
      }

      if (isSmartReminders) {
        return (
          <Link href="/smart-reminders" key={f.title} aria-label="Go to Smart Reminders">
            {card}
          </Link>
        );
      }

      return card;
    })}
  </div>
</section>



      {/* CTA Section */}
      <section className="max-w-2xl mx-auto w-full flex flex-col items-center">
        <div className="rounded-2xl bg-gradient-to-br from-white/90 via-blue-50 to-blue-200 shadow-xl px-8 py-10 text-center mb-10">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Ready to Start Your Journey?</h3>
          <p className="text-gray-500 mb-6">
            Join thousands of families staying connected through Eldermate's accessible and caring platform.
          </p>
          <Link
            href="/signup"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg"
          >
            Begin Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 text-sm pb-6 px-4">
        © 2024 Eldermate. Empowering seniors and caregivers with accessible technology.
      </footer>
    </div>
  );
}
