import { format } from 'date-fns';
import { Mood, MoodLabel } from '../types';

export const moodOptions: { label: MoodLabel; color: string; emoji: string }[] = [
  { label: 'Joyful', color: '#FF9BD2', emoji: '😁' },
  { label: 'Happy', color: '#FFCD56', emoji: '😊' },
  { label: 'Content', color: '#4BC0C0', emoji: '🙂' },
  { label: 'Neutral', color: '#A8A9AD', emoji: '😐' },
  { label: 'Tired', color: '#B5A6E0', emoji: '😴' },
  { label: 'Sad', color: '#7AACE3', emoji: '😔' },
  { label: 'Anxious', color: '#CE93D8', emoji: '😰' },
  { label: 'Angry', color: '#FF6384', emoji: '😠' },
];

export const getMoodColor = (moodLabel: MoodLabel): string => {
  const mood = moodOptions.find((m) => m.label === moodLabel);
  return mood?.color || '#A8A9AD';
};

export const getMoodEmoji = (moodLabel: MoodLabel): string => {
  const mood = moodOptions.find((m) => m.label === moodLabel);
  return mood?.emoji || '😐';
};

export const createMood = (label: MoodLabel, value: number, note?: string): Mood => {
  return {
    id: crypto.randomUUID(),
    label,
    value,
    color: getMoodColor(label),
    timestamp: new Date().toISOString(),
    note,
  };
};

export const formatMoodDate = (timestamp: string): string => {
  return format(new Date(timestamp), 'MMMM d, yyyy h:mm a');
};

export const getMoodValueText = (value: number): string => {
  if (value <= 2) return 'Very Low';
  if (value <= 4) return 'Low';
  if (value <= 6) return 'Moderate';
  if (value <= 8) return 'High';
  return 'Very High';
};

export const groupMoodsByDate = (moods: Mood[]) => {
  const grouped = moods.reduce((acc, mood) => {
    const date = format(new Date(mood.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(mood);
    return acc;
  }, {} as Record<string, Mood[]>);
  
  return grouped;
};