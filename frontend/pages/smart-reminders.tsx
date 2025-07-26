// app/smart-reminders/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./SmartReminders.module.css";
import reminderService, { 
  Reminder, 
  MedicationReminder, 
  AppointmentReminder, 
  ActivityReminder 
} from "../utils/reminderService";

// Local interfaces for form state management
interface MedicationFormInput {
  name: string;
  time: string;
  frequency: "Daily" | "Weekly";
}

interface AppointmentFormInput {
  title: string;
  datetime: string;
  location: string;
}

interface ActivityFormInput {
  task: string;
  time: string;
}

interface ValidationErrors {
  [key: string]: string;
}

/* ------------- Custom Hook: API data fetching with loading state ------------- */
function useReminders<T extends Reminder>(fetchFn: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result as T[]);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to load reminders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
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
  const { 
    data: medications, 
    loading: medicationsLoading, 
    error: medicationsError, 
    refetch: refetchMedications,
    setData: setMedications 
  } = useReminders<MedicationReminder>(() => 
    reminderService.getRemindersByType('medication')
  );

  const { 
    data: appointments, 
    loading: appointmentsLoading, 
    error: appointmentsError, 
    refetch: refetchAppointments,
    setData: setAppointments 
  } = useReminders<AppointmentReminder>(() => 
    reminderService.getRemindersByType('appointment')
  );

  const { 
    data: activities, 
    loading: activitiesLoading, 
    error: activitiesError, 
    refetch: refetchActivities,
    setData: setActivities 
  } = useReminders<ActivityReminder>(() => 
    reminderService.getRemindersByType('activity')
  );

  /* Form inputs */
  const [medInput, setMedInput] = useState<MedicationFormInput>({
    name: "",
    time: "",
    frequency: "Daily",
  });
  const [appInput, setAppInput] = useState<AppointmentFormInput>({
    title: "",
    datetime: "",
    location: "",
  });
  const [actInput, setActInput] = useState<ActivityFormInput>({
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
  
  /* Loading states for form submissions */
  const [submittingMed, setSubmittingMed] = useState<boolean>(false);
  const [submittingApp, setSubmittingApp] = useState<boolean>(false);
  const [submittingAct, setSubmittingAct] = useState<boolean>(false);

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
  function validateMedication(input: MedicationFormInput): ValidationErrors {
    const err: ValidationErrors = {};
    if (!input.name.trim()) err.name = "Medication name is required";
    if (!input.time) err.time = "Time is required";
    return err;
  }

  function validateAppointment(input: AppointmentFormInput): ValidationErrors {
    const err: ValidationErrors = {};
    if (!input.title.trim()) err.title = "Title is required";
    if (!input.datetime) err.datetime = "Date and time are required";
    return err;
  }

  function validateActivity(input: ActivityFormInput): ValidationErrors {
    const err: ValidationErrors = {};
    if (!input.task.trim()) err.task = "Task description is required";
    if (!input.time) err.time = "Time is required";
    return err;
  }

  /* Handlers */
  async function handleMedSubmit() {
    const errors = validateMedication(medInput);
    setMedErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmittingMed(true);
      
      if (editMedId) {
        // Update existing medication reminder
        const updatedReminder = await reminderService.updateReminder(editMedId, {
          title: medInput.name,
          time: medInput.time,
          type: 'medication',
          medicationDetails: {
            name: medInput.name,
            frequency: medInput.frequency
          }
        });
        
        if (updatedReminder) {
          setMedications(medications.map(m => 
            m._id === editMedId ? updatedReminder as MedicationReminder : m
          ));
        }
      } else {
        // Create new medication reminder
        const newReminder = await reminderService.createReminder({
          title: medInput.name,
          time: medInput.time,
          type: 'medication',
          medicationDetails: {
            name: medInput.name,
            frequency: medInput.frequency
          }
        });
        
        if (newReminder) {
          setMedications([...medications, newReminder as MedicationReminder]);
        }
      }
      
      setMedInput({ name: "", time: "", frequency: "Daily" });
      setEditMedId(null);
    } catch (error) {
      console.error('Error submitting medication reminder:', error);
      setMedErrors({ submit: 'Failed to save reminder. Please try again.' });
    } finally {
      setSubmittingMed(false);
    }
  }

  async function handleAppSubmit() {
    const errors = validateAppointment(appInput);
    setAppErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmittingApp(true);
      
      if (editAppId) {
        // Update existing appointment reminder
        const updatedReminder = await reminderService.updateReminder(editAppId, {
          title: appInput.title,
          time: new Date(appInput.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          type: 'appointment',
          appointmentDetails: {
            datetime: appInput.datetime,
            location: appInput.location
          }
        });
        
        if (updatedReminder) {
          setAppointments(appointments.map(a => 
            a._id === editAppId ? updatedReminder as AppointmentReminder : a
          ));
        }
      } else {
        // Create new appointment reminder
        const newReminder = await reminderService.createReminder({
          title: appInput.title,
          time: new Date(appInput.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          type: 'appointment',
          appointmentDetails: {
            datetime: appInput.datetime,
            location: appInput.location
          }
        });
        
        if (newReminder) {
          setAppointments([...appointments, newReminder as AppointmentReminder]);
        }
      }
      
      setAppInput({ title: "", datetime: "", location: "" });
      setEditAppId(null);
    } catch (error) {
      console.error('Error submitting appointment reminder:', error);
      setAppErrors({ submit: 'Failed to save reminder. Please try again.' });
    } finally {
      setSubmittingApp(false);
    }
  }

  async function handleActSubmit() {
    const errors = validateActivity(actInput);
    setActErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmittingAct(true);
      
      if (editActId) {
        // Update existing activity reminder
        const updatedReminder = await reminderService.updateReminder(editActId, {
          title: actInput.task.substring(0, 30) + (actInput.task.length > 30 ? '...' : ''),
          time: actInput.time,
          type: 'activity',
          activityDetails: {
            task: actInput.task
          }
        });
        
        if (updatedReminder) {
          setActivities(activities.map(a => 
            a._id === editActId ? updatedReminder as ActivityReminder : a
          ));
        }
      } else {
        // Create new activity reminder
        const newReminder = await reminderService.createReminder({
          title: actInput.task.substring(0, 30) + (actInput.task.length > 30 ? '...' : ''),
          time: actInput.time,
          type: 'activity',
          activityDetails: {
            task: actInput.task
          }
        });
        
        if (newReminder) {
          setActivities([...activities, newReminder as ActivityReminder]);
        }
      }
      
      setActInput({ task: "", time: "" });
      setEditActId(null);
    } catch (error) {
      console.error('Error submitting activity reminder:', error);
      setActErrors({ submit: 'Failed to save reminder. Please try again.' });
    } finally {
      setSubmittingAct(false);
    }
  }

  /* Delete handlers */
  async function deleteMedication(id: string) {
    try {
      const success = await reminderService.deleteReminder(id);
      if (success) {
        setMedications(medications.filter((m) => m._id !== id));
      }
    } catch (error) {
      console.error('Error deleting medication reminder:', error);
    }
  }
  
  async function deleteAppointment(id: string) {
    try {
      const success = await reminderService.deleteReminder(id);
      if (success) {
        setAppointments(appointments.filter((a) => a._id !== id));
      }
    } catch (error) {
      console.error('Error deleting appointment reminder:', error);
    }
  }
  
  async function deleteActivity(id: string) {
    try {
      const success = await reminderService.deleteReminder(id);
      if (success) {
        setActivities(activities.filter((a) => a._id !== id));
      }
    } catch (error) {
      console.error('Error deleting activity reminder:', error);
    }
  }

  /* Start editing */
  function startEditMed(id: string) {
    const reminder = medications.find((m) => m._id === id);
    if (reminder) {
      setMedInput({ 
        name: reminder.medicationDetails.name, 
        time: reminder.time, 
        frequency: reminder.medicationDetails.frequency 
      });
      setEditMedId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  
  function startEditApp(id: string) {
    const reminder = appointments.find((a) => a._id === id);
    if (reminder) {
      setAppInput({ 
        title: reminder.title, 
        datetime: reminder.appointmentDetails.datetime, 
        location: reminder.appointmentDetails.location || '' 
      });
      setEditAppId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  
  function startEditAct(id: string) {
    const reminder = activities.find((a) => a._id === id);
    if (reminder) {
      setActInput({ 
        task: reminder.activityDetails.task, 
        time: reminder.time 
      });
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
              {submittingMed ? "Saving..." : (editMedId ? "Update Reminder" : "Add Reminder")}
          </button>
        </form>

        {/* Loading state for medications */}
        {medicationsLoading && <p className={styles.loadingText}>Loading medication reminders...</p>}
        {medicationsError && <p className={styles.errorText}>{medicationsError}</p>}

        {/* List existing medication reminders */}
        <ul aria-label="Medication reminders list" className={styles.reminderList}>
          {medications.map((reminder) => (
            <li key={reminder._id} className={styles.reminderListItem}>
              <div>
                <p>
                  <strong>{reminder.medicationDetails.name}</strong> at {reminder.time} ({reminder.medicationDetails.frequency})
                  {reminder.completed && <span className={styles.completedBadge}>✓ Completed</span>}
                </p>
              </div>
              <div className={styles.reminderActions}>
                <button
                  onClick={() => reminderService.toggleReminderCompletion(reminder._id!).then(() => refetchMedications())}
                  aria-label={`Mark ${reminder.medicationDetails.name} as ${reminder.completed ? 'incomplete' : 'complete'}`}
                  className={styles.iconButton}
                  type="button"
                >
                  {reminder.completed ? '↩️' : '✓'}
                </button>
                <button
                  onClick={() => startEditMed(reminder._id!)}
                  aria-label={`Edit medication reminder for ${reminder.medicationDetails.name}`}
                  className={styles.iconButton}
                  type="button"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteMedication(reminder._id!)}
                  aria-label={`Delete medication reminder for ${reminder.medicationDetails.name}`}
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
              {submittingApp ? "Saving..." : (editAppId ? "Update Reminder" : "Add Reminder")}
          </button>
        </form>

        {/* Loading state for appointments */}
        {appointmentsLoading && <p className={styles.loadingText}>Loading appointment reminders...</p>}
        {appointmentsError && <p className={styles.errorText}>{appointmentsError}</p>}

        {/* List existing appointment reminders */}
        <ul aria-label="Appointment reminders list" className={styles.reminderList}>
          {appointments.map((reminder) => (
            <li key={reminder._id} className={styles.reminderListItem}>
              <div>
                <p>
                  <strong>{reminder.title}</strong>{" "}
                  <time dateTime={reminder.appointmentDetails.datetime}>
                    {new Date(reminder.appointmentDetails.datetime).toLocaleString()}
                  </time>
                  {reminder.appointmentDetails.location ? ` @ ${reminder.appointmentDetails.location}` : ""}
                  {reminder.completed && <span className={styles.completedBadge}>✓ Completed</span>}
                </p>
              </div>
              <div className={styles.reminderActions}>
                <button
                  onClick={() => reminderService.toggleReminderCompletion(reminder._id!).then(() => refetchAppointments())}
                  aria-label={`Mark ${reminder.title} as ${reminder.completed ? 'incomplete' : 'complete'}`}
                  className={styles.iconButton}
                  type="button"
                >
                  {reminder.completed ? '↩️' : '✓'}
                </button>
                <button
                  onClick={() => startEditApp(reminder._id!)}
                  aria-label={`Edit appointment reminder for ${reminder.title}`}
                  className={styles.iconButton}
                  type="button"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteAppointment(reminder._id!)}
                  aria-label={`Delete appointment reminder for ${reminder.title}`}
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
              {submittingAct ? "Saving..." : (editActId ? "Update Reminder" : "Add Reminder")}
          </button>
        </form>

        {/* Loading state for activities */}
        {activitiesLoading && <p className={styles.loadingText}>Loading activity reminders...</p>}
        {activitiesError && <p className={styles.errorText}>{activitiesError}</p>}

        {/* List existing activity reminders */}
        <ul aria-label="Activity reminders list" className={styles.reminderList}>
          {activities.map((reminder) => (
            <li key={reminder._id} className={styles.reminderListItem}>
              <div>
                <p>
                  <strong>{reminder.activityDetails.task}</strong> at {reminder.time}
                  {reminder.completed && <span className={styles.completedBadge}>✓ Completed</span>}
                </p>
              </div>
              <div className={styles.reminderActions}>
                <button
                  onClick={() => reminderService.toggleReminderCompletion(reminder._id!).then(() => refetchActivities())}
                  aria-label={`Mark ${reminder.title} as ${reminder.completed ? 'incomplete' : 'complete'}`}
                  className={styles.iconButton}
                  type="button"
                >
                  {reminder.completed ? '↩️' : '✓'}
                </button>
                <button
                  onClick={() => startEditAct(reminder._id!)}
                  aria-label={`Edit activity reminder for ${reminder.activityDetails.task}`}
                  className={styles.iconButton}
                  type="button"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteActivity(reminder._id!)}
                  aria-label={`Delete activity reminder for ${reminder.activityDetails.task}`}
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
