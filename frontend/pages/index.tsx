import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";
import Particles from "react-tsparticles";
import type { Engine, Container } from "tsparticles-engine";
import { loadFull } from "tsparticles";

// Features data (unchanged)
const features = [
  {
    icon: (
      <svg
        className="w-9 h-9 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21C12 21 4 13.613 4 8.75A4.75 4.75 0 0112 4a4.75 4.75 0 018 4.75C20 13.613 12 21 12 21z" />
      </svg>
    ),
    title: "Mood Tracking",
    desc: "Simple, voice-enabled mood check-ins with emotional support.",
  },
  {
    icon: (
      <svg
        className="w-9 h-9 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16.7 17.3c-1.2-1.1-2.5-2.1-2.5-5.3v-1.2a2 2 0 00-4 0v.5" />
      </svg>
    ),
    title: "AI Assistant",
    desc: "24/7 conversational support with voice-to-speech capabilities.",
  },
  {
    icon: (
      <svg
        className="w-9 h-9 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Smart Reminders",
    desc: "Medication, appointments, and daily activity reminders.",
  },
  {
    icon: (
      <svg
        className="w-9 h-9 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.828 21H9.172A2.003 2.003 0 017 19.172V4.828A2.003 2.003 0 019.172 3h5.656A2.003 2.003 0 0117 4.828v14.344A2.003 2.003 0 0114.828 21z" />
        <path d="M15 8h.01" />
      </svg>
    ),
    title: "Emergency Support",
    desc: "One-touch emergency alerts to caregivers and family.",
  },
  {
    icon: (
      <svg
        className="w-9 h-9 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12c2.209 0 4 1.791 4 4H8c0-2.209 1.791-4 4-4z" />
      </svg>
    ),
    title: "Caregiver Dashboard",
    desc: "Real-time monitoring and support for family members.",
  },
  {
    icon: (
      <svg
        className="w-9 h-9 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="6" y="8" width="12" height="10" rx="3" />
        <path d="M12 11v2" />
        <path d="M12 17h0" />
      </svg>
    ),
    title: "Accessible Design",
    desc: "Large buttons, high contrast, and voice-first interface.",
  },
];

// particles.js init
const particlesInit = async (engine: Engine): Promise<void> => {
  await loadFull(engine);
};

const particlesLoaded = async (container?: Container): Promise<void> => {
  // no-op
};

// FeatureBox with scroll animation, animates on entering and leaving viewport
type FeatureBoxProps = {
  feature: typeof features[number];
  side: "left" | "right";
};

const FeatureBox: React.FC<FeatureBoxProps> = ({ feature, side }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px" /* no once */ });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      // Animate feature box into view
      controls.start({
        x: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 150,
          damping: 22,
          duration: 0.4, // faster animation
        },
      });
    } else {
      // Animate feature box out of view
      controls.start({
        x: side === "left" ? -100 : 100,
        opacity: 0,
        transition: { duration: 0.3 },
      });
    }
  }, [inView, controls, side]);

  const initialX = side === "left" ? -100 : 100;

  return (
    <motion.article
      ref={ref}
      initial={{ x: initialX, opacity: 0 }}
      animate={controls}
      whileHover={{
        scale: 1.07,
        boxShadow:
          "0 8px 32px rgba(59,130,246,0.3), 0 0 12px rgba(96,165,250,0.4)",
      }}
      className="rounded-2xl bg-white/70 backdrop-blur-lg shadow-xl p-6 flex flex-col items-center cursor-pointer transition-transform focus-within:scale-105 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400"
      tabIndex={0}
      role="group"
      aria-labelledby={`feature-title-${feature.title}`}
      aria-describedby={`feature-desc-${feature.title}`}
    >
      <div className="mb-4 neon-icon">{feature.icon}</div>
      <h3
        id={`feature-title-${feature.title}`}
        className="text-blue-900 text-xl font-bold mb-2 text-center"
      >
        {feature.title}
      </h3>
      <p
        id={`feature-desc-${feature.title}`}
        className="text-gray-700 text-center text-base"
      >
        {feature.desc}
      </p>
    </motion.article>
  );
};

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-200 to-white overflow-hidden">
      {/* Animated Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 120, duration: 0.4 } },
          },
          particles: {
            color: { value: "#3b82f6" },
            links: {
              color: "#3b82f6",
              distance: 140,
              enable: true,
              opacity: 0.25,
              width: 1,
            },
            collisions: { enable: false },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 1,
              straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 40 },
            opacity: { value: 0.25 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto flex justify-end items-center pt-8 pb-2 px-10">
        <Link
          href="/signin"
          className="px-6 py-2 rounded-lg bg-white/30 backdrop-blur-md hover:bg-white/60 text-blue-700 font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 text-center"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        aria-label="Hero"
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center mb-6 shadow-xl neon-glow"
          animate={{ scale: [0.96, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
          aria-hidden="true"
        >
          <svg
            className="w-14 h-14 text-white animate-pulse-fast"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="heart icon"
          >
            <path d="M12 21C12 21 4 13.613 4 8.75A4.75 4.75 0 0112 4a4.75 4.75 0 018 4.75C20 13.613 12 21 12 21z" />
          </svg>
        </motion.div>
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-400 mb-3 select-none">
          Eldermate
        </h1>
        <p className="text-lg text-gray-700 font-semibold mb-4 max-w-xl mx-auto">
          Health &amp; Emotional Support Platform
        </p>
        <p className="max-w-xl text-gray-600 mb-8 mx-auto">
          Connecting elderly users with their caregivers through voice-first
          technology, mood tracking, AI assistance, and emergency support.
        </p>
        <div className="flex gap-6 mb-12 flex-col sm:flex-row justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-teal-400 hover:from-blue-700 hover:to-blue-400 text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg"
          >
            Get Started
          </Link>
          <button
            className="px-8 py-3 rounded-lg border border-blue-500 text-blue-600 font-bold shadow hover:bg-blue-50 transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="View Demo"
            onClick={() => alert("Demo coming soon!")}
          >
            View Demo
          </button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section
        className="relative z-10 max-w-6xl mx-auto pt-2 pb-8 px-4"
        aria-labelledby="features-title"
      >
        <h2
          id="features-title"
          className="text-3xl font-extrabold text-blue-900 text-center mb-12"
        >
          Designed for Accessibility &amp; Care
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <FeatureBox
              key={feature.title}
              feature={feature}
              side={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-2xl mx-auto w-full flex flex-col items-center px-4">
        <div className="rounded-2xl bg-white/70 backdrop-blur-lg shadow-xl px-8 py-10 text-center mb-10">
          <h3 className="text-2xl font-bold text-blue-900 mb-4 select-none">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-600 mb-6 select-none">
            Join thousands of families staying connected through Eldermate's
            accessible and caring platform.
          </p>
          <Link
            href="/signup"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 via-blue-400 to-teal-400 hover:from-blue-800 hover:to-blue-500 text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg"
          >
            Begin Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-gray-400 text-sm pb-6 px-4 select-none">
        © 2024 Eldermate. Empowering seniors and caregivers with accessible
        technology.
      </footer>
    </div>
  );
};

export default Home;
