import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from './ui/Card';
import { JournalEntry, Mood } from '../types';
import { getMoodEmoji } from '../lib/moodUtils';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';

interface JournalEntryCardProps {
  entry: JournalEntry;
  mood?: Mood;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  mood,
  onEdit,
  onDelete,
}) => {
  const formattedDate = format(new Date(entry.createdAt), 'MMMM d, yyyy');
  const preview = entry.content.length > 150
    ? `${entry.content.substring(0, 150)}...`
    : entry.content;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{entry.title}</h3>
          {mood && (
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-lg"
              style={{ backgroundColor: `${mood.color}30` }}
            >
              {getMoodEmoji(mood.label)}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-3">{formattedDate}</p>
        <p className="text-gray-700 whitespace-pre-line">{preview}</p>
        
        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 pt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(entry.id)}
          aria-label="Edit entry"
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(entry.id)}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          aria-label="Delete entry"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};