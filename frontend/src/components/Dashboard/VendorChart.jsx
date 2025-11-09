import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VendorChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Top 10 Vendors by Spend
        </h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    name: item.vendorName || 'Unknown',
    spend: item.totalSpend,
  }));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Top 10 Vendors by Spend
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip 
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Bar dataKey="spend" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
