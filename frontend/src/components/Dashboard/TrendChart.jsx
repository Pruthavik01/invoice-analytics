import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Invoice Volume & Value Trend
        </h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    name: `${item.month}/${item.year}`,
    invoices: item.count,
    value: item.totalAmount,
  }));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Invoice Volume & Value Trend
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'value') return `$${value.toLocaleString()}`;
              return value;
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="invoices"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Invoice Count"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            name="Total Value ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
