import React, { useState } from 'react';
import { format } from 'date-fns';
import { useMoodStore } from '../store/useMoodStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MoodPicker } from '../components/ui/MoodPicker';
import { MoodChart } from '../components/MoodChart';
import { formatMoodDate, getMoodEmoji, groupMoodsByDate } from '../lib/moodUtils';
import { CalendarDays, Plus } from 'lucide-react';
import { MoodLabel } from '../types';

export const MoodTrackerPage: React.FC = () => {
  const { moods, addMood } = useMoodStore();
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [moodNote, setMoodNote] = useState('');
  
  const handleMoodSelect = (selectedMood: { label: MoodLabel; value: number }) => {
    const newMood = {
      ...selectedMood,
      note: moodNote,
    };
    
    const mood = {
      id: crypto.randomUUID(),
      label: newMood.label,
      value: newMood.value,
      color: getMoodColor(newMood.label),
      timestamp: new Date().toISOString(),
      note: newMood.note,
    };
    
    addMood(mood);
    setShowMoodPicker(false);
    setMoodNote('');
  };
  
  const getMoodColor = (label: MoodLabel): string => {
    switch (label) {
      case 'Joyful': return '#FF9BD2';
      case 'Happy': return '#FFCD56';
      case 'Content': return '#4BC0C0';
      case 'Neutral': return '#A8A9AD';
      case 'Tired': return '#B5A6E0';
      case 'Sad': return '#7AACE3';
      case 'Anxious': return '#CE93D8';
      case 'Angry': return '#FF6384';
      default: return '#A8A9AD';
    }
  };
  
  const groupedMoods = groupMoodsByDate(moods);
  const sortedDates = Object.keys(groupedMoods).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
          <p className="text-gray-600">Track and visualize your emotional journey</p>
        </div>
        <button
          onClick={() => setShowMoodPicker(prev => !prev)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Mood
        </button>
      </header>
      
      {showMoodPicker && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How are you feeling right now?</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodPicker onSelectMood={handleMoodSelect} />
            <div className="mt-4">
              <label htmlFor="moodNote" className="block text-sm font-medium text-gray-700 mb-1">
                Add a note (optional)
              </label>
              <textarea
                id="moodNote"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="What made you feel this way?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Your Mood Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {moods.length > 0 ? (
              <MoodChart moods={moods} days={30} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Log your first mood to see your chart</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <CalendarDays className="mr-2" />
        Mood History
      </h2>
      
      {sortedDates.length > 0 ? (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date} className="border-b pb-6 last:border-b-0">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedMoods[date]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map(mood => (
                    <Card key={mood.id} className="overflow-hidden">
                      <div 
                        className="h-2"
                        style={{ backgroundColor: mood.color }}
                      />
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{getMoodEmoji(mood.label)}</span>
                            <span className="font-medium">{mood.label}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {format(new Date(mood.timestamp), 'h:mm a')}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">Intensity: </span>
                          <span className="font-medium">{mood.value}/10</span>
                        </div>
                        {mood.note && (
                          <p className="text-gray-700 text-sm italic border-t border-gray-100 pt-2 mt-2">
                            "{mood.note}"
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Mood Data Yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your moods to build your emotional history</p>
          <button
            onClick={() => setShowMoodPicker(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Your First Mood
          </button>
        </div>
      )}
    </div>
  );
};