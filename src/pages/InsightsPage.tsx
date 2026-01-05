import React, { useMemo } from 'react';
import { useMoodStore } from '../store/useMoodStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getRecommendationsForMood } from '../lib/recommendations';
import { RecommendationCard } from '../components/RecommendationCard';
import { moodOptions } from '../lib/moodUtils';
import { Brain, BarChart, Calendar, Clock } from 'lucide-react';
import { MoodLabel } from '../types';

export const InsightsPage: React.FC = () => {
  const { moods } = useMoodStore();
  
  const moodCounts = useMemo(() => {
    return moods.reduce((acc, mood) => {
      if (!acc[mood.label]) {
        acc[mood.label] = 0;
      }
      acc[mood.label]++;
      return acc;
    }, {} as Record<MoodLabel, number>);
  }, [moods]);
  
  const mostFrequentMood = useMemo(() => {
    if (moods.length === 0) return null;
    
    let maxCount = 0;
    let mostFrequent: MoodLabel | null = null;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = mood as MoodLabel;
      }
    });
    
    return mostFrequent;
  }, [moods, moodCounts]);
  
  const averageMoodValue = useMemo(() => {
    if (moods.length === 0) return 0;
    
    const sum = moods.reduce((total, mood) => total + mood.value, 0);
    return (sum / moods.length).toFixed(1);
  }, [moods]);
  
  const moodsByTime = useMemo(() => {
    const timeSlots = {
      morning: { count: 0, total: 0 },
      afternoon: { count: 0, total: 0 },
      evening: { count: 0, total: 0 },
      night: { count: 0, total: 0 },
    };
    
    moods.forEach(mood => {
      const hour = new Date(mood.timestamp).getHours();
      
      if (hour >= 5 && hour < 12) {
        timeSlots.morning.count++;
        timeSlots.morning.total += mood.value;
      } else if (hour >= 12 && hour < 17) {
        timeSlots.afternoon.count++;
        timeSlots.afternoon.total += mood.value;
      } else if (hour >= 17 && hour < 21) {
        timeSlots.evening.count++;
        timeSlots.evening.total += mood.value;
      } else {
        timeSlots.night.count++;
        timeSlots.night.total += mood.value;
      }
    });
    
    const result = {
      morning: timeSlots.morning.count > 0 
        ? (timeSlots.morning.total / timeSlots.morning.count).toFixed(1) 
        : "No data",
      afternoon: timeSlots.afternoon.count > 0 
        ? (timeSlots.afternoon.total / timeSlots.afternoon.count).toFixed(1) 
        : "No data",
      evening: timeSlots.evening.count > 0 
        ? (timeSlots.evening.total / timeSlots.evening.count).toFixed(1) 
        : "No data",
      night: timeSlots.night.count > 0 
        ? (timeSlots.night.total / timeSlots.night.count).toFixed(1) 
        : "No data",
    };
    
    return result;
  }, [moods]);
  
  const personalizedRecommendations = useMemo(() => {
    if (!mostFrequentMood) return [];
    return getRecommendationsForMood(mostFrequentMood);
  }, [mostFrequentMood]);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
        <p className="text-gray-600">Understand your emotional patterns and get personalized recommendations</p>
      </header>
      
      {moods.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Entries Logged</p>
                    <h3 className="text-3xl font-bold mt-1">{moods.length}</h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="w-5 h-5 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Average Mood</p>
                    <h3 className="text-3xl font-bold mt-1">{averageMoodValue}/10</h3>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <BarChart className="w-5 h-5 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Most Frequent Mood</p>
                    <h3 className="text-3xl font-bold mt-1 flex items-center">
                      {mostFrequentMood ? (
                        <>
                          <span className="mr-2">
                            {moodOptions.find(m => m.label === mostFrequentMood)?.emoji}
                          </span>
                          {mostFrequentMood}
                        </>
                      ) : 'N/A'}
                    </h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <Brain className="w-5 h-5 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Best Time of Day</p>
                    <h3 className="text-3xl font-bold mt-1">
                      {Object.entries(moodsByTime)
                        .filter(([_, value]) => value !== "No data")
                        .sort((a, b) => parseFloat(b[1] as string) - parseFloat(a[1] as string))[0]?.[0] || 'N/A'}
                    </h3>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-full">
                    <Clock className="w-5 h-5 text-amber-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moodOptions.map(mood => {
                    const count = moodCounts[mood.label] || 0;
                    const percentage = moods.length > 0 
                      ? Math.round((count / moods.length) * 100) 
                      : 0;
                    
                    return (
                      <div key={mood.label}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <span className="mr-2">{mood.emoji}</span>
                            <span>{mood.label}</span>
                          </div>
                          <span className="text-sm text-gray-500">{count} entries ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: mood.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mood by Time of Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Morning (5am-12pm)</span>
                      <span className="text-sm text-gray-500">
                        {moodsByTime.morning === "No data" ? "No data" : `${moodsByTime.morning}/10`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      {moodsByTime.morning !== "No data" && (
                        <div 
                          className="h-2.5 rounded-full bg-yellow-400" 
                          style={{ width: `${(parseFloat(moodsByTime.morning) / 10) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Afternoon (12pm-5pm)</span>
                      <span className="text-sm text-gray-500">
                        {moodsByTime.afternoon === "No data" ? "No data" : `${moodsByTime.afternoon}/10`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      {moodsByTime.afternoon !== "No data" && (
                        <div 
                          className="h-2.5 rounded-full bg-blue-400" 
                          style={{ width: `${(parseFloat(moodsByTime.afternoon) / 10) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Evening (5pm-9pm)</span>
                      <span className="text-sm text-gray-500">
                        {moodsByTime.evening === "No data" ? "No data" : `${moodsByTime.evening}/10`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      {moodsByTime.evening !== "No data" && (
                        <div 
                          className="h-2.5 rounded-full bg-purple-400" 
                          style={{ width: `${(parseFloat(moodsByTime.evening) / 10) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Night (9pm-5am)</span>
                      <span className="text-sm text-gray-500">
                        {moodsByTime.night === "No data" ? "No data" : `${moodsByTime.night}/10`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      {moodsByTime.night !== "No data" && (
                        <div 
                          className="h-2.5 rounded-full bg-indigo-400" 
                          style={{ width: `${(parseFloat(moodsByTime.night) / 10) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personalized Recommendations</h2>
          {personalizedRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedRecommendations.map(recommendation => (
                <RecommendationCard 
                  key={recommendation.id} 
                  recommendation={recommendation} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">Continue logging your moods to receive personalized recommendations.</p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Mood Data Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start tracking your moods to see insightful analytics and receive personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
};