import { ChatMessage } from '../types';

const botResponses = {
  greetings: [
    "Hello! How are you feeling today?",
    "Hi there! I'm your mood companion. How can I help you today?",
    "Welcome back! How's your emotional journey going?",
    "Good to see you! How's your mood right now?"
  ],
  
  sadness: [
    "I'm sorry to hear you're feeling down. Would you like to talk about what's happening?",
    "It's okay to feel sad sometimes. Would writing in your journal help process these feelings?",
    "I notice you've been feeling sad. Have you tried any activities that brought you joy in the past?",
    "Sadness is a natural emotion. Would you like some recommendations that might help?"
  ],
  
  anxiety: [
    "I see you're feeling anxious. Let's take a deep breath together. In for 4, hold for 7, out for 8.",
    "Anxiety can be overwhelming. Would writing about your specific worries help identify them?",
    "When anxiety rises, grounding exercises can help. Would you like me to suggest one?",
    "I'm here with you through this anxious moment. Would talking about what triggered it help?"
  ],
  
  happiness: [
    "It's wonderful that you're feeling happy! What contributed to this positive feeling?",
    "I'm glad you're in a good mood! This is a great time to reflect on what's going well.",
    "Your happiness is worth celebrating! Would you like to journal about this positive experience?",
    "It's great to see you happy! Remember this feeling and what led to it."
  ],
  
  neutral: [
    "How would you describe your mood in more detail?",
    "Neutral moods are common. Is there anything specific on your mind?",
    "Sometimes a neutral mood can be a good reset. What are you thinking about today?",
    "Would you like to explore what might boost your mood a bit today?"
  ],
  
  journaling: [
    "Journaling is a powerful tool for emotional well-being. What would you like to write about today?",
    "Your journal is a safe space for your thoughts. Is there something specific you want to explore?",
    "Regular journaling can help identify emotional patterns. What's on your mind right now?",
    "Sometimes just writing freely without judgment can be revealing. Would you like to try that?"
  ],
  
  fallback: [
    "I'm here to support your emotional journey. Would you like to talk about how you're feeling?",
    "I'm still learning how to be a better companion. Can you tell me more about what's on your mind?",
    "Thank you for sharing. Would you like to explore this further in your journal?",
    "I appreciate you opening up. Would some mood-boosting recommendations help right now?"
  ]
};

const getResponseCategory = (message: string): keyof typeof botResponses => {
  message = message.toLowerCase();
  
  if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
    return 'greetings';
  } else if (message.includes('sad') || message.includes('down') || message.includes('depressed') || message.includes('unhappy')) {
    return 'sadness';
  } else if (message.includes('anxious') || message.includes('worry') || message.includes('stress') || message.includes('nervous')) {
    return 'anxiety';
  } else if (message.includes('happy') || message.includes('joy') || message.includes('great') || message.includes('good')) {
    return 'happiness';
  } else if (message.includes('journal') || message.includes('write') || message.includes('entry')) {
    return 'journaling';
  } else if (message.includes('neutral') || message.includes('okay') || message.includes('fine')) {
    return 'neutral';
  } else {
    return 'fallback';
  }
};

export const generateBotResponse = (message: string): string => {
  const category = getResponseCategory(message);
  const responses = botResponses[category];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

export const createChatMessage = (content: string, sender: 'user' | 'bot'): ChatMessage => {
  return {
    id: crypto.randomUUID(),
    content,
    sender,
    timestamp: new Date().toISOString()
  };
};