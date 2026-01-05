import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { Recommendation } from '../types';
import { Music, Film, Quote, Cog as Yoga } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const typeColors = {
    activity: 'bg-blue-100 text-blue-800',
    reflection: 'bg-purple-100 text-purple-800',
    mindfulness: 'bg-green-100 text-green-800',
    yoga: 'bg-orange-100 text-orange-800',
    quote: 'bg-yellow-100 text-yellow-800',
    music: 'bg-pink-100 text-pink-800',
    movie: 'bg-indigo-100 text-indigo-800',
  };

  const getIcon = () => {
    switch (recommendation.type) {
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'movie':
        return <Film className="w-4 h-4" />;
      case 'quote':
        return <Quote className="w-4 h-4" />;
      case 'yoga':
        return <Yoga className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
        {recommendation.imageUrl && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={recommendation.imageUrl}
              alt={recommendation.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{recommendation.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${typeColors[recommendation.type]}`}>
              {getIcon()}
              {recommendation.type}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{recommendation.description}</p>
          
          {/* Additional details based on type */}
          {recommendation.type === 'yoga' && (
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Difficulty:</span> {recommendation.difficulty}
              </p>
              <p className="text-sm">
                <span className="font-medium">Duration:</span> {recommendation.duration}
              </p>
            </div>
          )}
          
          {recommendation.type === 'music' && (
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Artist:</span> {recommendation.artist}
              </p>
              <p className="text-sm">
                <span className="font-medium">Genre:</span> {recommendation.genre}
              </p>
              {recommendation.year && (
                <p className="text-sm">
                  <span className="font-medium">Year:</span> {recommendation.year}
                </p>
              )}
            </div>
          )}
          
          {recommendation.type === 'movie' && (
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Genre:</span> {recommendation.genre}
              </p>
              <p className="text-sm">
                <span className="font-medium">Year:</span> {recommendation.year}
              </p>
            </div>
          )}
          
          {recommendation.forMoods.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {recommendation.forMoods.map((mood) => (
                <span 
                  key={mood} 
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {mood}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};