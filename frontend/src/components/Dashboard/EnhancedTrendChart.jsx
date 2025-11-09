import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EnhancedTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice Volume + Value Trend
        </h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Get current month/year for header
  const latestData = data[data.length - 1];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = data.map((item) => ({
    name: monthNames[item.month - 1],
    count: item.count,
  }));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Invoice Volume + Value Trend
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Invoice count and total spend over 12 months
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {latestData ? monthNames[latestData.month - 1] : ''} {latestData?.year}
          </p>
          <div className="mt-1">
            <span className="text-xs text-gray-500">Invoice count: </span>
            <span className="text-sm font-semibold text-gray-900">
              {latestData?.count || 0}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-500">Total Spend: </span>
            <span className="text-sm font-semibold text-blue-600">
              € {latestData?.totalAmount?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}