import { useState, useEffect } from 'react';

function CronJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cron');
      if (!response.ok) throw new Error('Failed to fetch cron jobs');
      const data = await response.json();
      setJobs(data.jobs || []);
      setLastUpdated(new Date(data.timestamp));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const formatSchedule = (schedule) => {
    if (schedule.kind === 'cron') {
      return `${schedule.expr} (${schedule.tz || 'UTC'})`;
    } else if (schedule.kind === 'interval') {
      return `Every ${schedule.seconds}s`;
    } else if (schedule.kind === 'at') {
      return `Once at ${new Date(schedule.at).toLocaleString()}`;
    }
    return 'Unknown';
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return null;
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff < 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    }
    return `in ${minutes}m`;
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="text-center py-8 dark:text-linear-text-secondary text-gray-600">
        Loading cron jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={fetchJobs}
          className="px-4 py-2 dark:bg-linear-accent bg-blue-600 text-white rounded-lg hover:opacity-80"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-linear-text text-gray-900">
            Cron Jobs
          </h2>
          {lastUpdated && (
            <p className="text-sm dark:text-linear-text-secondary text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="px-4 py-2 dark:bg-linear-card bg-gray-100 dark:text-linear-text text-gray-700 rounded-lg dark:border-linear-border border border-gray-300 hover:opacity-80 disabled:opacity-50"
        >
          {loading ? '↻ Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="text-center py-8 dark:text-linear-text-secondary text-gray-500">
          No cron jobs configured
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="dark:bg-linear-bg bg-gray-50 rounded-lg p-4 dark:border-linear-border border border-gray-200"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold dark:text-linear-text text-gray-900 mb-1">
                    {job.name}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        job.enabled
                          ? 'dark:bg-green-900/30 bg-green-100 dark:text-green-400 text-green-700'
                          : 'dark:bg-gray-700 bg-gray-200 dark:text-gray-400 text-gray-600'
                      }`}
                    >
                      {job.enabled ? '✓ Enabled' : '✗ Disabled'}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium dark:bg-blue-900/30 bg-blue-100 dark:text-blue-400 text-blue-700">
                      {job.sessionTarget || 'default'}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium dark:bg-purple-900/30 bg-purple-100 dark:text-purple-400 text-purple-700">
                      {job.agentId}
                    </span>
                    {job.deleteAfterRun && (
                      <span className="px-2 py-1 rounded text-xs font-medium dark:bg-orange-900/30 bg-orange-100 dark:text-orange-400 text-orange-700">
                        One-time
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-xs dark:text-linear-text-secondary text-gray-500 mb-1">
                    Schedule
                  </p>
                  <p className="text-sm dark:text-linear-text text-gray-900 font-mono">
                    {formatSchedule(job.schedule)}
                  </p>
                </div>
                <div>
                  <p className="text-xs dark:text-linear-text-secondary text-gray-500 mb-1">
                    Next Run
                  </p>
                  <p className="text-sm dark:text-linear-text text-gray-900">
                    {formatDateTime(job.state?.nextRunAtMs)}
                  </p>
                  {job.state?.nextRunAtMs && (
                    <p className="text-xs dark:text-linear-accent text-blue-600 mt-1">
                      {getRelativeTime(job.state.nextRunAtMs)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs dark:text-linear-text-secondary text-gray-500 mb-1">
                    Last Run
                  </p>
                  <p className="text-sm dark:text-linear-text text-gray-900">
                    {formatDateTime(job.state?.lastRunAtMs)}
                  </p>
                </div>
              </div>

              {/* Payload Preview */}
              {job.payload?.message && (
                <div className="mt-3 pt-3 dark:border-t dark:border-linear-border border-t border-gray-200">
                  <p className="text-xs dark:text-linear-text-secondary text-gray-500 mb-1">
                    Payload
                  </p>
                  <p className="text-sm dark:text-linear-text-secondary text-gray-600 line-clamp-2">
                    {job.payload.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CronJobs;
