import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mood, JournalEntry, ChatMessage } from '../types';
import { createMood } from '../lib/moodUtils';

interface MoodState {
  moods: Mood[];
  journalEntries: JournalEntry[];
  chatMessages: ChatMessage[];
  addMood: (mood: Mood) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      moods: [],
      journalEntries: [],
      chatMessages: [],
      
      addMood: (mood) => 
        set((state) => ({ moods: [...state.moods, mood] })),
      
      addJournalEntry: (entry) => 
        set((state) => ({ journalEntries: [...state.journalEntries, entry] })),
      
      updateJournalEntry: (id, updates) => 
        set((state) => ({ 
          journalEntries: state.journalEntries.map(entry => 
            entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
          )
        })),
      
      deleteJournalEntry: (id) => 
        set((state) => ({ 
          journalEntries: state.journalEntries.filter(entry => entry.id !== id)
        })),
      
      addChatMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      
      clearChatMessages: () =>
        set({ chatMessages: [] }),
    }),
    {
      name: 'mood-journal-storage',
    }
  )
);