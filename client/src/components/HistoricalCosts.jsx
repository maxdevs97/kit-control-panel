import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function HistoricalCosts() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/costs/history`);
      const data = await response.json();
      setHistory(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cost history');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center dark:text-linear-text text-gray-700">Loading history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const formatCost = (cost) => {
    return `$${cost.toFixed(4)}`;
  };

  const chartData = {
    labels: history.days.map(d => d.date),
    datasets: [
      {
        label: 'Daily Cost',
        data: history.days.map(d => d.totalCost),
        borderColor: 'rgb(88, 166, 255)',
        backgroundColor: 'rgba(88, 166, 255, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(201, 209, 217)',
        },
      },
      title: {
        display: true,
        text: 'Last 7 Days - Cost Trend',
        color: 'rgb(201, 209, 217)',
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'rgb(201, 209, 217)',
          callback: function(value) {
            return '$' + value.toFixed(2);
          },
        },
        grid: {
          color: 'rgba(48, 54, 61, 0.5)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(201, 209, 217)',
        },
        grid: {
          color: 'rgba(48, 54, 61, 0.5)',
        },
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-bold dark:text-linear-text text-gray-900 mb-6">Historical Costs</h2>

      {/* Chart */}
      <div className="mb-8 p-6 dark:bg-linear-bg bg-gray-50 rounded-lg border dark:border-linear-border border-gray-200">
        {history.days.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="text-center dark:text-gray-400 text-gray-600 py-8">
            No historical data available
          </div>
        )}
      </div>

      {/* Daily Breakdown */}
      <h3 className="text-lg font-semibold dark:text-linear-text text-gray-900 mb-4">Daily Breakdown</h3>
      <div className="space-y-3">
        {history.days.length > 0 ? (
          history.days.map(day => (
            <div key={day.date} className="dark:bg-linear-bg bg-gray-50 rounded-lg border dark:border-linear-border border-gray-200 overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:opacity-80 transition"
                onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium dark:text-linear-text text-gray-900">
                      {expandedDay === day.date ? '▼' : '▶'} {day.date}
                    </span>
                    <span className="text-sm dark:text-gray-400 text-gray-600 ml-3">
                      {day.sessions} sessions • {day.byAgent ? Object.values(day.byAgent).reduce((sum, a) => sum + a.messages, 0) : 0} messages
                    </span>
                  </div>
                  <span className="font-bold dark:text-linear-accent text-blue-600">
                    {formatCost(day.totalCost)}
                  </span>
                </div>
              </div>

              {expandedDay === day.date && (
                <div className="px-4 pb-4 border-t dark:border-linear-border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* By Agent */}
                    <div>
                      <h4 className="text-sm font-semibold dark:text-gray-400 text-gray-600 mb-2">By Agent</h4>
                      <div className="space-y-2">
                        {Object.entries(day.byAgent || {}).map(([agent, data]) => (
                          <div key={agent} className="flex justify-between text-sm">
                            <span className="dark:text-linear-text text-gray-700 capitalize">{agent}</span>
                            <span className="dark:text-linear-accent text-blue-600 font-medium">
                              {formatCost(data.cost)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* By Model */}
                    <div>
                      <h4 className="text-sm font-semibold dark:text-gray-400 text-gray-600 mb-2">By Model</h4>
                      <div className="space-y-2">
                        {Object.entries(day.byModel || {}).map(([model, data]) => (
                          <div key={model} className="flex justify-between text-sm">
                            <span className="dark:text-linear-text text-gray-700 truncate mr-2">{model}</span>
                            <span className="dark:text-linear-accent text-blue-600 font-medium whitespace-nowrap">
                              {formatCost(data.cost)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center dark:text-gray-400 text-gray-600 py-8">
            No historical data available
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoricalCosts;
