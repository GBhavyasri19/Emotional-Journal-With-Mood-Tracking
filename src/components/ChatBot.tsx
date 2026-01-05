import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore } from '../store/useMoodStore';
import { createChatMessage, generateBotResponse } from '../lib/chatbot';
import { Button } from './ui/Button';
import { MessageSquare, Send, X } from 'lucide-react';

export const ChatBot: React.FC = () => {
  const { chatMessages, addChatMessage } = useMoodStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = createChatMessage(message, 'user');
    addChatMessage(userMessage);
    setMessage('');
    
    // Generate and add bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      const botMessage = createChatMessage(botResponse, 'bot');
      addChatMessage(botMessage);
    }, 500);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    
    // If no messages exist, add a welcome message
    if (chatMessages.length === 0 && !isOpen) {
      setTimeout(() => {
        const welcomeMessage = createChatMessage(
          "Hello! I'm your mood companion. How are you feeling today?", 
          'bot'
        );
        addChatMessage(welcomeMessage);
      }, 300);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <MessageSquare size={24} />
      </motion.button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 flex justify-between items-center">
              <h3 className="text-white font-medium">Mood Companion</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-white/20"
              >
                <X size={18} />
              </Button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  Start a conversation to get support and insights.
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`mb-3 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[85%] px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
                >
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};