import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getMoodEmoji, moodOptions } from '../../lib/moodUtils';
import { MoodLabel } from '../../types';
import { Sliders } from 'lucide-react';

interface MoodPickerProps {
  onSelectMood: (mood: { label: MoodLabel; value: number }) => void;
}

export const MoodPicker: React.FC<MoodPickerProps> = ({ onSelectMood }) => {
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);
  const [intensityValue, setIntensityValue] = useState<number>(5);
  
  const handleMoodSelect = (mood: MoodLabel) => {
    setSelectedMood(mood);
  };
  
  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntensityValue(parseInt(e.target.value, 10));
  };
  
  const handleSubmit = () => {
    if (selectedMood) {
      onSelectMood({
        label: selectedMood,
        value: intensityValue,
      });
      setSelectedMood(null);
      setIntensityValue(5);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-medium text-gray-800 mb-4">How are you feeling?</h3>
      
      <div className="grid grid-cols-4 gap-3 mb-6">
        {moodOptions.map((mood) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodSelect(mood.label)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
              selectedMood === mood.label
                ? 'bg-opacity-100 ring-2 ring-offset-2 ring-opacity-60'
                : 'bg-opacity-20 hover:bg-opacity-30'
            }`}
            style={{
              backgroundColor: selectedMood === mood.label ? mood.color : `${mood.color}30`,
              boxShadow: selectedMood === mood.label ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
              ringColor: mood.color,
            }}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-sm font-medium">{mood.label}</span>
          </motion.button>
        ))}
      </div>
      
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center mb-2">
            <Sliders className="w-4 h-4 mr-2 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">
              Intensity: {intensityValue}/10
            </label>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={intensityValue}
            onChange={handleIntensityChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </motion.div>
      )}
      
      {selectedMood && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium transition-colors hover:bg-purple-700"
        >
          Save Mood
        </motion.button>
      )}
    </div>
  );
};