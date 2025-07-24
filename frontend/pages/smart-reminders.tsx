// app/smart-reminders/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./SmartReminders.module.css";

interface MedicationReminder {
  id: string;
  name: string;
  time: string;
  frequency: "Daily" | "Weekly";
}

interface AppointmentReminder {
  id: string;
  title: string;
  datetime: string;
  location: string;
}

interface ActivityReminder {
  id: string;
  task: string;
  time: string;
}

interface ValidationErrors {
  [key: string]: string;
}

/* ------------- Custom Hook: localStorage with typing ------------- */
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue] as const;
}

/* ------------- Custom Hook: Voice Input/Output via Web Speech API ------------- */
// Add global SpeechRecognition type for browsers
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  // Fallback for environments without SpeechRecognition type
  var SpeechRecognition: any;
}

function useVoice(onResult: (text: string) => void) {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognitionRef.current.onend = () => setListening(false);
  }, [onResult]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening]);

  return { listening, toggleListening };
}

/* ------------- Main Page Component ------------- */
export default function SmartReminders() {
  /* State and hooks for three reminder types */
  const [medications, setMedications] = useLocalStorage<MedicationReminder[]>("medications", []);
  const [appointments, setAppointments] = useLocalStorage<AppointmentReminder[]>("appointments", []);
  const [activities, setActivities] = useLocalStorage<ActivityReminder[]>("activities", []);

  /* Form inputs */
  const [medInput, setMedInput] = useState<Omit<MedicationReminder, "id">>({
    name: "",
    time: "",
    frequency: "Daily",
  });
  const [appInput, setAppInput] = useState<Omit<AppointmentReminder, "id">>({
    title: "",
    datetime: "",
    location: "",
  });
  const [actInput, setActInput] = useState<Omit<ActivityReminder, "id">>({
    task: "",
    time: "",
  });

  /* Validation error states */
  const [medErrors, setMedErrors] = useState<ValidationErrors>({});
  const [appErrors, setAppErrors] = useState<ValidationErrors>({});
  const [actErrors, setActErrors] = useState<ValidationErrors>({});

  /* Editing states */
  const [editMedId, setEditMedId] = useState<string | null>(null);
  const [editAppId, setEditAppId] = useState<string | null>(null);
  const [editActId, setEditActId] = useState<string | null>(null);

  /* Voice input target form */
  const [voiceTarget, setVoiceTarget] = useState<"med" | "app" | "act" | null>(null);

  /* Voice input callback */
  const { listening, toggleListening } = useVoice((text: string) => {
    if (!voiceTarget) return;
    if (voiceTarget === "med") setMedInput((prev) => ({ ...prev, name: text }));
    else if (voiceTarget === "app") setAppInput((prev) => ({ ...prev, title: text }));
    else if (voiceTarget === "act") setActInput((prev) => ({ ...prev, task: text }));
  });

  /* Utils */
  function validateMedication(input: Omit<MedicationReminder, "id">): ValidationErrors {
    const err: ValidationErrors = {};
    if (!input.name.trim()) err.name = "Medication name is required";
    if (!input.time) err.time = "Time is required";
    return err;
  }

  function validateAppointment(input: Omit<AppointmentReminder, "id">): ValidationErrors {
    const err: ValidationErrors = {};
    if (!input.title.trim()) err.title = "Title is required";
    if (!input.datetime) err.datetime = "Date and time are required";
    return err;
  }

  function validateActivity(input: Omit<ActivityReminder, "id">): ValidationErrors {
    const err: ValidationErrors = {};
    if (!input.task.trim()) err.task = "Task description is required";
    if (!input.time) err.time = "Time is required";
    return err;
  }

  /* Handlers */
  function handleMedSubmit() {
    const errors = validateMedication(medInput);
    setMedErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (editMedId) {
      setMedications(
        medications.map((m) => (m.id === editMedId ? { ...m, ...medInput, id: editMedId } : m)),
      );
    } else {
      setMedications([...medications, { id: crypto.randomUUID(), ...medInput }]);
    }
    setMedInput({ name: "", time: "", frequency: "Daily" });
    setEditMedId(null);
  }

  function handleAppSubmit() {
    const errors = validateAppointment(appInput);
    setAppErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (editAppId) {
      setAppointments(
        appointments.map((a) =>
          a.id === editAppId ? { ...a, ...appInput, id: editAppId } : a,
        ),
      );
    } else {
      setAppointments([...appointments, { id: crypto.randomUUID(), ...appInput }]);
    }
    setAppInput({ title: "", datetime: "", location: "" });
    setEditAppId(null);
  }

  function handleActSubmit() {
    const errors = validateActivity(actInput);
    setActErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (editActId) {
      setActivities(
        activities.map((a) =>
          a.id === editActId ? { ...a, ...actInput, id: editActId } : a,
        ),
      );
    } else {
      setActivities([...activities, { id: crypto.randomUUID(), ...actInput }]);
    }
    setActInput({ task: "", time: "" });
    setEditActId(null);
  }

  /* Delete handlers */
  function deleteMedication(id: string) {
    setMedications(medications.filter((m) => m.id !== id));
  }
  function deleteAppointment(id: string) {
    setAppointments(appointments.filter((a) => a.id !== id));
  }
  function deleteActivity(id: string) {
    setActivities(activities.filter((a) => a.id !== id));
  }

  /* Start editing */
  function startEditMed(id: string) {
    const reminder = medications.find((m) => m.id === id);
    if (reminder) {
      setMedInput({ name: reminder.name, time: reminder.time, frequency: reminder.frequency });
      setEditMedId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  function startEditApp(id: string) {
    const reminder = appointments.find((a) => a.id === id);
    if (reminder) {
      setAppInput({ title: reminder.title, datetime: reminder.datetime, location: reminder.location });
      setEditAppId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  function startEditAct(id: string) {
    const reminder = activities.find((a) => a.id === id);
    if (reminder) {
      setActInput({ task: reminder.task, time: reminder.time });
      setEditActId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* Focus management for accessibility */
  const medNameRef = useRef<HTMLInputElement>(null);
  const appTitleRef = useRef<HTMLInputElement>(null);
  const actTaskRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editMedId && medNameRef.current) medNameRef.current.focus();
    else if (editAppId && appTitleRef.current) appTitleRef.current.focus();
    else if (editActId && actTaskRef.current) actTaskRef.current.focus();
  }, [editMedId, editAppId, editActId]);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 tabIndex={0} className={styles.headerTitle}>
          Welcome to ElderMate
        </h1>
        <div className={styles.headerRight}>
          <Link
            href="/"
            className={styles.button}
            aria-label="Back to homepage"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        {/* Medication Reminders Card */}
        <section className={styles.card} aria-labelledby="medication-title">
          <h2 id="medication-title" className={styles.cardTitle}>
            Medication Reminders
          </h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleMedSubmit();
            }}
            noValidate
            aria-describedby="medication-errors"
          >
            <label htmlFor="med-name" className={styles.label}>
              Medication Name
            </label>
            <input
              type="text"
              id="med-name"
              ref={medNameRef}
              className={`${styles.input} ${
                medErrors.name ? styles.inputError : ""
              }`}
              value={medInput.name}
              onChange={(e) => setMedInput({ ...medInput, name: e.target.value })}
              aria-invalid={!!medErrors.name}
              aria-describedby={medErrors.name ? "med-name-error" : undefined}
              placeholder="e.g. Aspirin"
            />
            {medErrors.name && (
              <p id="med-name-error" role="alert" className={styles.errorText}>
                {medErrors.name}
              </p>
            )}

            <label htmlFor="med-time" className={styles.label}>
              Time
            </label>
            <input
              type="time"
              id="med-time"
              className={`${styles.input} ${
                medErrors.time ? styles.inputError : ""
              }`}
              value={medInput.time}
              onChange={(e) => setMedInput({ ...medInput, time: e.target.value })}
              aria-invalid={!!medErrors.time}
              aria-describedby={medErrors.time ? "med-time-error" : undefined}
            />
            {medErrors.time && (
              <p id="med-time-error" role="alert" className={styles.errorText}>
                {medErrors.time}
              </p>
            )}

            <label htmlFor="med-frequency" className={styles.label}>
              Frequency
            </label>
            <select
              id="med-frequency"
              className={styles.select}
              value={medInput.frequency}
              onChange={(e) =>
                setMedInput({
                  ...medInput,
                  frequency: e.target.value as MedicationReminder["frequency"],
                })
              }
              aria-label="Medication frequency"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>

            <VoiceToggleButton
              active={voiceTarget === "med"}
              onClick={() =>
                setVoiceTarget(voiceTarget === "med" ? null : "med")
              }
            />

            <button
              type="submit"
              className={styles.button}
              aria-label={editMedId ? "Update medication reminder" : "Add medication reminder"}
            >
              {editMedId ? "Update Reminder" : "Add Reminder"}
            </button>
          </form>

          {/* List existing medication reminders */}
          <ul aria-label="Medication reminders list" className={styles.reminderList}>
            {medications.map(({ id, name, time, frequency }) => (
              <li key={id} className={styles.reminderListItem}>
                <div>
                  <p>
                    <strong>{name}</strong> at {time} ({frequency})
                  </p>
                </div>
                <div className={styles.reminderActions}>
                  <button
                    onClick={() => startEditMed(id)}
                    aria-label={`Edit medication reminder for ${name}`}
                    className={styles.iconButton}
                    type="button"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteMedication(id)}
                    aria-label={`Delete medication reminder for ${name}`}
                    className={styles.iconButton}
                    type="button"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Appointment Reminders Card */}
        <section className={styles.card} aria-labelledby="appointment-title">
          <h2 id="appointment-title" className={styles.cardTitle}>
            Appointment Reminders
          </h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleAppSubmit();
            }}
            noValidate
            aria-describedby="appointment-errors"
          >
            <label htmlFor="app-title" className={styles.label}>
              Title
            </label>
            <input
              type="text"
              id="app-title"
              ref={appTitleRef}
              className={`${styles.input} ${
                appErrors.title ? styles.inputError : ""
              }`}
              value={appInput.title}
              onChange={(e) => setAppInput({ ...appInput, title: e.target.value })}
              aria-invalid={!!appErrors.title}
              aria-describedby={appErrors.title ? "app-title-error" : undefined}
              placeholder="e.g. Dentist Appointment"
            />
            {appErrors.title && (
              <p id="app-title-error" role="alert" className={styles.errorText}>
                {appErrors.title}
              </p>
            )}

            <label htmlFor="app-datetime" className={styles.label}>
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="app-datetime"
              className={`${styles.input} ${
                appErrors.datetime ? styles.inputError : ""
              }`}
              value={appInput.datetime}
              onChange={(e) => setAppInput({ ...appInput, datetime: e.target.value })}
              aria-invalid={!!appErrors.datetime}
              aria-describedby={appErrors.datetime ? "app-datetime-error" : undefined}
            />
            {appErrors.datetime && (
              <p id="app-datetime-error" role="alert" className={styles.errorText}>
                {appErrors.datetime}
              </p>
            )}

            <label htmlFor="app-location" className={styles.label}>
              Location
            </label>
            <input
              type="text"
              id="app-location"
              className={styles.input}
              value={appInput.location}
              onChange={(e) => setAppInput({ ...appInput, location: e.target.value })}
              placeholder="e.g. Clinic"
              aria-label="Appointment location"
            />

            <VoiceToggleButton
              active={voiceTarget === "app"}
              onClick={() =>
                setVoiceTarget(voiceTarget === "app" ? null : "app")
              }
            />

            <button
              type="submit"
              className={styles.button}
              aria-label={editAppId ? "Update appointment reminder" : "Add appointment reminder"}
            >
              {editAppId ? "Update Reminder" : "Add Reminder"}
            </button>
          </form>

          {/* List existing appointment reminders */}
          <ul aria-label="Appointment reminders list" className={styles.reminderList}>
            {appointments.map(({ id, title, datetime, location }) => (
              <li key={id} className={styles.reminderListItem}>
                <div>
                  <p>
                    <strong>{title}</strong>{" "}
                    <time dateTime={datetime}>
                      {new Date(datetime).toLocaleString()}
                    </time>
                    {location ? ` @ ${location}` : ""}
                  </p>
                </div>
                <div className={styles.reminderActions}>
                  <button
                    onClick={() => startEditApp(id)}
                    aria-label={`Edit appointment reminder for ${title}`}
                    className={styles.iconButton}
                    type="button"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteAppointment(id)}
                    aria-label={`Delete appointment reminder for ${title}`}
                    className={styles.iconButton}
                    type="button"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Activity Reminders Card */}
        <section className={styles.card} aria-labelledby="activity-title">
          <h2 id="activity-title" className={styles.cardTitle}>
            Activity Reminders
          </h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleActSubmit();
            }}
            noValidate
            aria-describedby="activity-errors"
          >
            <label htmlFor="act-task" className={styles.label}>
              Task Description
            </label>
            <textarea
              id="act-task"
              ref={actTaskRef}
              className={`${styles.textarea} ${
                actErrors.task ? styles.inputError : ""
              }`}
              value={actInput.task}
              onChange={(e) => setActInput({ ...actInput, task: e.target.value })}
              aria-invalid={!!actErrors.task}
              aria-describedby={actErrors.task ? "act-task-error" : undefined}
              placeholder="Describe your activity..."
              rows={4}
            ></textarea>
            {actErrors.task && (
              <p id="act-task-error" role="alert" className={styles.errorText}>
                {actErrors.task}
              </p>
            )}

            <label htmlFor="act-time" className={styles.label}>
              Time
            </label>
            <input
              type="time"
              id="act-time"
              className={`${styles.input} ${
                actErrors.time ? styles.inputError : ""
              }`}
              value={actInput.time}
              onChange={(e) => setActInput({ ...actInput, time: e.target.value })}
              aria-invalid={!!actErrors.time}
              aria-describedby={actErrors.time ? "act-time-error" : undefined}
            />
            {actErrors.time && (
              <p id="act-time-error" role="alert" className={styles.errorText}>
                {actErrors.time}
              </p>
            )}

            <VoiceToggleButton
              active={voiceTarget === "act"}
              onClick={() =>
                setVoiceTarget(voiceTarget === "act" ? null : "act")
              }
            />

            <button
              type="submit"
              className={styles.button}
              aria-label={editActId ? "Update activity reminder" : "Add activity reminder"}
            >
              {editActId ? "Update Reminder" : "Add Reminder"}
            </button>
          </form>

          {/* List existing activity reminders */}
          <ul aria-label="Activity reminders list" className={styles.reminderList}>
            {activities.map(({ id, task, time }) => (
              <li key={id} className={styles.reminderListItem}>
                <div>
                  <p>
                    <strong>{task}</strong> at {time}
                  </p>
                </div>
                <div className={styles.reminderActions}>
                  <button
                    onClick={() => startEditAct(id)}
                    aria-label={`Edit activity reminder for ${task}`}
                    className={styles.iconButton}
                    type="button"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteActivity(id)}
                    aria-label={`Delete activity reminder for ${task}`}
                    className={styles.iconButton}
                    type="button"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Bottom navigation bar (reuse homepage style) */}
      <nav className={styles.bottomNav} aria-label="Bottom navigation">
        <Link href="/" className={styles.button} aria-label="Return to home">
          Home
        </Link>
        {/* Add more navigation buttons here as needed */}
      </nav>
    </div>
  );
}

/* ----------- Voice Input Toggle Button Component ----------- */
interface VoiceToggleButtonProps {
  active: boolean;
  onClick: () => void;
}
function VoiceToggleButton({ active, onClick }: VoiceToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Stop voice input" : "Start voice input"}
      className={`${styles.voiceToggle} ${
        active ? styles.voiceActive : ""
      }`}
    >
      {/* Microphone icon */}
      <svg
        aria-hidden="true"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M12 1v11a3 3 0 006 0V1m-6 0a3 3 0 01-6 0v11a3 3 0 006 0zM19 11v2a7 7 0 01-14 0v-2" />
      </svg>
      <span className="sr-only">Toggle voice input</span>
    </button>
  );
}
