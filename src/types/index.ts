export type Mood = {
  id: string;
  value: number; // 1-10 scale
  label: MoodLabel;
  color: string;
  timestamp: string;
  note?: string;
};

export type MoodLabel = 
  | 'Joyful'
  | 'Happy'
  | 'Content'
  | 'Neutral'
  | 'Tired'
  | 'Sad'
  | 'Anxious'
  | 'Angry';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  moodId: string;
  tags: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'activity' | 'reflection' | 'mindfulness' | 'yoga' | 'quote' | 'music' | 'movie';
  forMoods: MoodLabel[];
  imageUrl?: string;
  category?: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  artist?: string;
  genre?: string;
  year?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}