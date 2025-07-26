import api from './api';

// Define TypeScript interfaces for the reminder types
export interface BaseReminder {
  _id?: string;
  title: string;
  time: string;
  type: 'medication' | 'appointment' | 'activity';
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicationReminder extends BaseReminder {
  type: 'medication';
  medicationDetails: {
    name: string;
    frequency: 'Daily' | 'Weekly';
  };
}

export interface AppointmentReminder extends BaseReminder {
  type: 'appointment';
  appointmentDetails: {
    datetime: string;
    location?: string;
  };
}

export interface ActivityReminder extends BaseReminder {
  type: 'activity';
  activityDetails: {
    task: string;
  };
}

export type Reminder = MedicationReminder | AppointmentReminder | ActivityReminder;

// Define the reminder service with API methods
const reminderService = {
  // Get all reminders
  getAllReminders: async (): Promise<Reminder[]> => {
    try {
      const response = await api.get('/reminders');
      return response.data.data.reminders;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  },

  // Get reminders by type
  getRemindersByType: async (type: 'medication' | 'appointment' | 'activity'): Promise<Reminder[]> => {
    try {
      const response = await api.get(`/reminders/type/${type}`);
      return response.data.data.reminders;
    } catch (error) {
      console.error(`Error fetching ${type} reminders:`, error);
      return [];
    }
  },

  // Get today's reminders
  getTodayReminders: async (): Promise<Reminder[]> => {
    try {
      const response = await api.get('/reminders/today');
      return response.data.data.reminders;
    } catch (error) {
      console.error('Error fetching today\'s reminders:', error);
      return [];
    }
  },

  // Get a single reminder by ID
  getReminder: async (id: string): Promise<Reminder | null> => {
    try {
      const response = await api.get(`/reminders/${id}`);
      return response.data.data.reminder;
    } catch (error) {
      console.error('Error fetching reminder:', error);
      return null;
    }
  },

  // Create a new reminder
  createReminder: async (reminderData: Omit<Reminder, '_id' | 'createdAt' | 'updatedAt'>): Promise<Reminder | null> => {
    try {
      const response = await api.post('/reminders', reminderData);
      return response.data.data.reminder;
    } catch (error) {
      console.error('Error creating reminder:', error);
      return null;
    }
  },

  // Update an existing reminder
  updateReminder: async (id: string, reminderData: Partial<Reminder>): Promise<Reminder | null> => {
    try {
      const response = await api.patch(`/reminders/${id}`, reminderData);
      return response.data.data.reminder;
    } catch (error) {
      console.error('Error updating reminder:', error);
      return null;
    }
  },

  // Delete a reminder
  deleteReminder: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/reminders/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  },

  // Toggle reminder completion status
  toggleReminderCompletion: async (id: string): Promise<Reminder | null> => {
    try {
      const response = await api.patch(`/reminders/${id}/toggle-completion`);
      return response.data.data.reminder;
    } catch (error) {
      console.error('Error toggling reminder completion:', error);
      return null;
    }
  },
};

export default reminderService;