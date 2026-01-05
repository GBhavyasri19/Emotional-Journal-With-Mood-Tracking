import React, { useRef, useEffect } from 'react';
import { useMoodStore } from '../store/useMoodStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { createChatMessage, generateBotResponse } from '../lib/chatbot';
import { Send, Bot, RefreshCw } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { chatMessages, addChatMessage, clearChatMessages } = useMoodStore();
  const [message, setMessage] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
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
  
  const handleStartNewChat = () => {
    if (chatMessages.length > 0) {
      if (confirm('Are you sure you want to start a new conversation? This will clear your current chat history.')) {
        clearChatMessages();
        
        // Add welcome message
        setTimeout(() => {
          const welcomeMessage = createChatMessage(
            "Hello! I'm your mood companion. How are you feeling today?", 
            'bot'
          );
          addChatMessage(welcomeMessage);
        }, 300);
      }
    } else {
      // If no messages, just add welcome message
      const welcomeMessage = createChatMessage(
        "Hello! I'm your mood companion. How are you feeling today?", 
        'bot'
      );
      addChatMessage(welcomeMessage);
    }
  };
  
  useEffect(() => {
    // If no messages exist when component mounts, add a welcome message
    if (chatMessages.length === 0) {
      const welcomeMessage = createChatMessage(
        "Hello! I'm your mood companion. How are you feeling today?", 
        'bot'
      );
      addChatMessage(welcomeMessage);
    }
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Companion</h1>
          <p className="text-gray-600">Chat with your emotional support assistant</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleStartNewChat}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </header>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500">
          <CardTitle className="text-white flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            Mood Companion
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[calc(70vh-11rem)] overflow-y-auto p-4 bg-gray-50">
            {chatMessages.map(msg => (
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
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button
                type="submit"
                disabled={!message.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};