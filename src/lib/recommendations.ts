import { MoodLabel, Recommendation } from '../types';

export const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Take a nature walk',
    description: 'Spending time in nature can reduce stress and improve your mood. Even a short 15-minute walk can make a difference.',
    type: 'activity',
    forMoods: ['Sad', 'Anxious', 'Tired'],
    imageUrl: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '2',
    title: 'Practice deep breathing',
    description: 'Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.',
    type: 'mindfulness',
    forMoods: ['Anxious', 'Angry'],
    imageUrl: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '3',
    title: 'Gratitude journaling',
    description: "Write down three things you're grateful for today, no matter how small. This practice can shift your focus to positive aspects of life.",
    type: 'reflection',
    forMoods: ['Sad', 'Neutral', 'Anxious'],
    imageUrl: 'https://images.pexels.com/photos/6249/nature-notebook-outside-notes.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  // Yoga Poses
  {
    id: 'yoga1',
    title: 'Child\'s Pose (Balasana)',
    description: 'A gentle resting pose that helps calm the mind and relieve stress.',
    type: 'yoga',
    forMoods: ['Anxious', 'Tired', 'Stressed'],
    imageUrl: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    difficulty: 'Beginner',
    duration: '5-10 minutes'
  },
  {
    id: 'yoga2',
    title: 'Warrior II (Virabhadrasana II)',
    description: 'An energizing pose that builds confidence and strength.',
    type: 'yoga',
    forMoods: ['Tired', 'Sad', 'Neutral'],
    imageUrl: 'https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    difficulty: 'Intermediate',
    duration: '3-5 minutes per side'
  },
  // Inspirational Quotes
  {
    id: 'quote1',
    title: 'On Resilience',
    description: '"The only way out is through." - Robert Frost',
    type: 'quote',
    forMoods: ['Anxious', 'Sad', 'Tired'],
    category: 'Motivation'
  },
  {
    id: 'quote2',
    title: 'On Joy',
    description: '"Happiness is not something ready made. It comes from your own actions." - Dalai Lama',
    type: 'quote',
    forMoods: ['Happy', 'Content', 'Neutral'],
    category: 'Happiness'
  },
  // Music Recommendations
  {
    id: 'music1',
    title: 'Weightless',
    description: 'A calming ambient track scientifically designed to reduce anxiety.',
    type: 'music',
    forMoods: ['Anxious', 'Stressed'],
    artist: 'Marconi Union',
    genre: 'Ambient'
  },
  {
    id: 'music2',
    title: 'Here Comes the Sun',
    description: 'An uplifting classic to brighten your mood.',
    type: 'music',
    forMoods: ['Sad', 'Tired'],
    artist: 'The Beatles',
    genre: 'Rock',
    year: 1969
  },
  // Movie Recommendations
  {
    id: 'movie1',
    title: 'The Secret Life of Walter Mitty',
    description: 'An inspiring adventure that reminds us to embrace life\'s possibilities.',
    type: 'movie',
    forMoods: ['Sad', 'Anxious', 'Neutral'],
    genre: 'Adventure/Comedy',
    year: 2013
  },
  {
    id: 'movie2',
    title: 'Inside Out',
    description: 'A heartwarming exploration of emotions and their importance in our lives.',
    type: 'movie',
    forMoods: ['Sad', 'Happy', 'Content'],
    genre: 'Animation',
    year: 2015
  }
];

export const getRecommendationsForMood = (mood: MoodLabel): Recommendation[] => {
  return recommendations.filter(rec => rec.forMoods.includes(mood));
};

export const getRandomRecommendations = (count: number = 3, type?: string): Recommendation[] => {
  let filtered = recommendations;
  if (type) {
    filtered = recommendations.filter(rec => rec.type === type);
  }
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};