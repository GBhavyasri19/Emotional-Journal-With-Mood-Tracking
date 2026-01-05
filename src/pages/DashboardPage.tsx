import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useMoodStore } from '../store/useMoodStore';
import { MoodPicker } from '../components/ui/MoodPicker';
import { MoodChart } from '../components/MoodChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { createMood, getMoodEmoji } from '../lib/moodUtils';
import { getRandomRecommendations } from '../lib/recommendations';
import { RecommendationCard } from '../components/RecommendationCard';
import { Plus } from 'lucide-react';
import { MoodLabel } from '../types';

export const DashboardPage: React.FC = () => {
  const { moods, addMood } = useMoodStore();
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  
  const handleMoodSelect = (selectedMood: { label: MoodLabel; value: number }) => {
    const newMood = createMood(selectedMood.label, selectedMood.value);
    addMood(newMood);
    setShowMoodPicker(false);
  };
  
  const today = format(new Date(), 'EEEE, MMMM d');
  const recommendations = getRandomRecommendations(3);
  
  // Get the most recent mood for today
  const todayMood = moods
    .filter(mood => {
      const moodDate = new Date(mood.timestamp);
      const today = new Date();
      return (
        moodDate.getDate() === today.getDate() &&
        moodDate.getMonth() === today.getMonth() &&
        moodDate.getFullYear() === today.getFullYear()
      );
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{today}</h1>
        <p className="text-gray-600">Track your mood and journal your thoughts</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Mood Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Today's Mood</CardTitle>
          </CardHeader>
          <CardContent>
            {todayMood ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div 
                  className="flex items-center justify-center w-20 h-20 rounded-full mb-4 text-4xl"
                  style={{ backgroundColor: `${todayMood.color}30` }}
                >
                  {getMoodEmoji(todayMood.label)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{todayMood.label}</h3>
                <p className="text-gray-600">Intensity: {todayMood.value}/10</p>
                {todayMood.note && (
                  <p className="mt-4 text-gray-700 italic">"{todayMood.note}"</p>
                )}
              </div>
            ) : showMoodPicker ? (
              <MoodPicker onSelectMood={handleMoodSelect} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-500 mb-4">You haven't logged your mood today</p>
                <button
                  onClick={() => setShowMoodPicker(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Mood
                </button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Mood Trends Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {moods.length > 0 ? (
              <MoodChart moods={moods} days={7} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Start tracking your moods to see trends</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recommendations Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendations For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </section>
    </div>
  );
};