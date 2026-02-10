import { useState, useEffect } from 'react';
import BacklogFeed from './components/BacklogFeed';
import TodayCosts from './components/TodayCosts';
import HistoricalCosts from './components/HistoricalCosts';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('backlog');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const tabs = [
    { id: 'backlog', label: '📋 Backlog', component: BacklogFeed },
    { id: 'today', label: '💰 Today', component: TodayCosts },
    { id: 'history', label: '📊 History', component: HistoricalCosts },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-linear-bg' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-linear-text text-gray-900">
            Kit Control Panel
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg dark:bg-linear-card dark:text-linear-text bg-white text-gray-900 border dark:border-linear-border border-gray-300 hover:opacity-80 transition"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'dark:bg-linear-accent bg-blue-600 text-white'
                  : 'dark:bg-linear-card dark:text-linear-text bg-white text-gray-700 dark:border-linear-border border border-gray-300 hover:opacity-80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="dark:bg-linear-card bg-white dark:border-linear-border border border-gray-200 rounded-lg p-6 shadow-lg">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}

export default App;
