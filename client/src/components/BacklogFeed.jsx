import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function BacklogFeed() {
  const [backlog, setBacklog] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({
    'Done': true, // Done section collapsed by default
  });

  const fetchBacklog = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/backlog`);
      const data = await response.json();
      setBacklog(data.content);
      setLastUpdate(new Date(data.timestamp));
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to fetch backlog');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBacklog();
    const interval = setInterval(fetchBacklog, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (sectionName) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const renderBacklog = () => {
    if (!backlog) return null;

    const lines = backlog.split('\n');
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push({ name: currentSection, content: currentContent.join('\n') });
        }
        currentSection = line.replace('## ', '').trim();
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    });

    if (currentSection) {
      sections.push({ name: currentSection, content: currentContent.join('\n') });
    }

    return sections.map(section => {
      const isCollapsed = collapsedSections[section.name];
      const isEmpty = !section.content.trim();

      return (
        <div key={section.name} className="mb-6">
          <div
            className="flex items-center justify-between cursor-pointer hover:opacity-80 transition mb-2"
            onClick={() => toggleSection(section.name)}
          >
            <h2 className="text-xl font-semibold dark:text-linear-text text-gray-900">
              {isCollapsed ? '▶' : '▼'} {section.name}
              {isEmpty && <span className="text-sm text-gray-500 ml-2">(empty)</span>}
            </h2>
          </div>
          {!isCollapsed && (
            <div className="ml-4 dark:text-linear-text text-gray-700 markdown-content">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return <div className="text-center dark:text-linear-text text-gray-700">Loading backlog...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold dark:text-linear-text text-gray-900">Live Backlog Feed</h2>
        <div className="text-sm dark:text-gray-400 text-gray-600">
          Last updated: {lastUpdate?.toLocaleTimeString()}
        </div>
      </div>
      <div className="space-y-4">
        {renderBacklog()}
      </div>
    </div>
  );
}

export default BacklogFeed;
