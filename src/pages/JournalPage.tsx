import React, { useState } from 'react';
import { format } from 'date-fns';
import { useMoodStore } from '../store/useMoodStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { JournalEntryCard } from '../components/JournalEntryCard';
import { MoodPicker } from '../components/ui/MoodPicker';
import { createMood } from '../lib/moodUtils';
import { JournalEntry, MoodLabel } from '../types';
import { Plus, X } from 'lucide-react';

export const JournalPage: React.FC = () => {
  const { journalEntries, moods, addJournalEntry, updateJournalEntry, deleteJournalEntry, addMood } = useMoodStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  
  const handleCreateEntry = () => {
    setIsCreating(true);
    setIsEditing(false);
    setCurrentEntry(null);
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setSelectedMoodId(null);
  };
  
  const handleEditEntry = (id: string) => {
    const entry = journalEntries.find(e => e.id === id);
    if (entry) {
      setCurrentEntry(entry);
      setTitle(entry.title);
      setContent(entry.content);
      setTags(entry.tags);
      setTagInput('');
      setSelectedMoodId(entry.moodId);
      setIsEditing(true);
      setIsCreating(false);
    }
  };
  
  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      deleteJournalEntry(id);
    }
  };
  
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleMoodSelect = (selectedMood: { label: MoodLabel; value: number }) => {
    const newMood = createMood(selectedMood.label, selectedMood.value);
    addMood(newMood);
    setSelectedMoodId(newMood.id);
  };
  
  const handleSaveEntry = () => {
    if (!title.trim() || !content.trim()) return;
    
    if (isEditing && currentEntry) {
      updateJournalEntry(currentEntry.id, {
        title,
        content,
        moodId: selectedMoodId || currentEntry.moodId,
        tags,
      });
    } else {
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        moodId: selectedMoodId || '',
        tags,
      };
      addJournalEntry(newEntry);
    }
    
    setIsCreating(false);
    setIsEditing(false);
    setCurrentEntry(null);
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setSelectedMoodId(null);
  };
  
  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setCurrentEntry(null);
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setSelectedMoodId(null);
  };
  
  // Sort entries by date (newest first)
  const sortedEntries = [...journalEntries].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
          <p className="text-gray-600">Record your thoughts and feelings</p>
        </div>
        {!isCreating && !isEditing && (
          <Button onClick={handleCreateEntry} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        )}
      </header>
      
      {(isCreating || isEditing) ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Entry title"
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-32"
                  placeholder="Write your thoughts..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add tags (press Enter)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How were you feeling?
                </label>
                <MoodPicker onSelectMood={handleMoodSelect} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSaveEntry} disabled={!title.trim() || !content.trim()}>
              Save Entry
            </Button>
          </CardFooter>
        </Card>
      ) : (
        sortedEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEntries.map((entry) => {
              const entryMood = moods.find(m => m.id === entry.moodId);
              return (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  mood={entryMood}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-700 mb-2">No Journal Entries Yet</h2>
            <p className="text-gray-600 mb-6">Start writing to track your thoughts and feelings</p>
            <Button onClick={handleCreateEntry}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Entry
            </Button>
          </div>
        )
      )}
    </div>
  );
};