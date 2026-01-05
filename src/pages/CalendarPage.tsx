import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { useMoodStore } from '../store/useMoodStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getMoodEmoji } from '../lib/moodUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Mood } from '../types';

export const CalendarPage: React.FC = () => {
  const { moods } = useMoodStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getMoodsForDay = (day: Date): Mood[] => {
    return moods.filter(mood => isSameDay(new Date(mood.timestamp), day));
  };
  
  const getDominantMood = (day: Date): Mood | null => {
    const dayMoods = getMoodsForDay(day);
    if (dayMoods.length === 0) return null;
    
    // Sort by timestamp (latest first) and take the first one
    return dayMoods.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  };
  
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setSelectedDate(null);
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setSelectedDate(null);
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(isSameDay(day, selectedDate as Date) ? null : day);
  };
  
  const selectedDayMoods = selectedDate ? getMoodsForDay(selectedDate) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mood Calendar</h1>
        <p className="text-gray-600">View your emotional journey by date</p>
      </header>
      
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {weekdays.map(day => (
              <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {Array(new Date(monthStart).getDay())
              .fill(null)
              .map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
            
            {daysInMonth.map(day => {
              const dominantMood = getDominantMood(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square p-1 rounded-lg transition-colors ${
                    isSelected 
                      ? 'bg-purple-100 ring-2 ring-purple-500 ring-offset-2' 
                      : dominantMood 
                        ? `hover:bg-${dominantMood.color}/20` 
                        : 'hover:bg-gray-100'
                  } ${isCurrentMonth ? '' : 'opacity-40'}`}
                >
                  <div className="h-full flex flex-col items-center justify-center rounded-md">
                    <span className={`text-sm font-medium ${isSelected ? 'text-purple-700' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dominantMood && (
                      <span className="text-lg mt-1">
                        {getMoodEmoji(dominantMood.label)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayMoods.length > 0 ? (
              <div className="space-y-4">
                {selectedDayMoods
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map(mood => (
                    <div 
                      key={mood.id} 
                      className="p-4 rounded-lg border"
                      style={{ borderLeftColor: mood.color, borderLeftWidth: '4px' }}
                    >
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
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No mood entries for this day.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};