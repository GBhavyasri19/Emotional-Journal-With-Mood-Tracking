import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, BarChart2, BookOpen, Calendar, Home, MessageSquare } from 'lucide-react';
import { ChatBot } from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            MoodJournal
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track, reflect, improve</p>
        </div>
        
        <nav className="flex-1 py-6 px-4">
          <ul className="space-y-1">
            <NavItem to="/" icon={<Home size={20} />} label="Dashboard" />
            <NavItem to="/journal" icon={<BookOpen size={20} />} label="Journal" />
            <NavItem to="/moods" icon={<Activity size={20} />} label="Mood Tracker" />
            <NavItem to="/insights" icon={<BarChart2 size={20} />} label="Insights" />
            <NavItem to="/calendar" icon={<Calendar size={20} />} label="Calendar" />
            <NavItem to="/chat" icon={<MessageSquare size={20} />} label="AI Companion" />
          </ul>
        </nav>
      </aside>
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:hidden z-10">
        <MobileNavItem to="/" icon={<Home size={20} />} />
        <MobileNavItem to="/journal" icon={<BookOpen size={20} />} />
        <MobileNavItem to="/moods" icon={<Activity size={20} />} />
        <MobileNavItem to="/insights" icon={<BarChart2 size={20} />} />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Chatbot */}
      <ChatBot />
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-purple-50 text-purple-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        {icon}
        {label}
      </NavLink>
    </li>
  );
};

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ to, icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `p-2 rounded-lg ${
          isActive ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
        }`
      }
    >
      {icon}
    </NavLink>
  );
};