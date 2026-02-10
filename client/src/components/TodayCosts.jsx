import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function TodayCosts() {
  const [costs, setCosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchCosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/costs/today`);
      const data = await response.json();
      setCosts(data);
      setLastUpdate(new Date(data.timestamp));
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to fetch today\'s costs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosts();
    const interval = setInterval(fetchCosts, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center dark:text-linear-text text-gray-700">Loading costs...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const formatCost = (cost) => {
    return `$${cost.toFixed(4)}`;
  };

  const agentsList = Object.entries(costs.byAgent || {})
    .sort((a, b) => b[1].cost - a[1].cost);

  const modelsList = Object.entries(costs.byModel || {})
    .sort((a, b) => b[1].cost - a[1].cost);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-linear-text text-gray-900">Today's Costs</h2>
        <div className="text-sm dark:text-gray-400 text-gray-600">
          Last updated: {lastUpdate?.toLocaleTimeString()}
        </div>
      </div>

      {/* Total Cost */}
      <div className="mb-8 p-6 dark:bg-linear-bg bg-gray-50 rounded-lg border dark:border-linear-border border-gray-200">
        <div className="text-center">
          <div className="text-sm dark:text-gray-400 text-gray-600 mb-2">Total Cost (Today)</div>
          <div className="text-4xl font-bold dark:text-linear-accent text-blue-600">
            {formatCost(costs.totalCost)}
          </div>
          <div className="text-sm dark:text-gray-400 text-gray-600 mt-2">
            {costs.date}
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Agent */}
        <div>
          <h3 className="text-lg font-semibold dark:text-linear-text text-gray-900 mb-4">By Agent</h3>
          <div className="space-y-3">
            {agentsList.length > 0 ? (
              agentsList.map(([agent, data]) => (
                <div
                  key={agent}
                  className="p-4 dark:bg-linear-bg bg-gray-50 rounded-lg border dark:border-linear-border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium dark:text-linear-text text-gray-900 capitalize">
                      {agent}
                    </span>
                    <span className="font-bold dark:text-linear-accent text-blue-600">
                      {formatCost(data.cost)}
                    </span>
                  </div>
                  <div className="text-sm dark:text-gray-400 text-gray-600">
                    {data.messages} messages
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center dark:text-gray-400 text-gray-600 py-8">
                No activity yet today
              </div>
            )}
          </div>
        </div>

        {/* By Model */}
        <div>
          <h3 className="text-lg font-semibold dark:text-linear-text text-gray-900 mb-4">By Model</h3>
          <div className="space-y-3">
            {modelsList.length > 0 ? (
              modelsList.map(([model, data]) => (
                <div
                  key={model}
                  className="p-4 dark:bg-linear-bg bg-gray-50 rounded-lg border dark:border-linear-border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium dark:text-linear-text text-gray-900 text-sm">
                      {model}
                    </span>
                    <span className="font-bold dark:text-linear-accent text-blue-600">
                      {formatCost(data.cost)}
                    </span>
                  </div>
                  <div className="text-sm dark:text-gray-400 text-gray-600">
                    {data.messages} messages
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center dark:text-gray-400 text-gray-600 py-8">
                No activity yet today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodayCosts;
