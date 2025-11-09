import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EnhancedVendorChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Spend by Vendor (Top 10)
        </h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Take top 10 and format
  const chartData = data.slice(0, 10).map((item) => ({
    name: item.vendorName || 'Unknown',
    spend: item.totalSpend,
  }));

  // Calculate total
  const totalSpend = chartData.reduce((sum, item) => sum + item.spend, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Spend by Vendor (Top 10)
          </h2>
          <div className="text-sm text-gray-500">
            Vendor spend with cumulative percentage distribution
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Global Supply</p>
              <p className="text-xs text-gray-500 mt-1">Vendor Spend:</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                € {chartData[0]?.spend?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="category"
            dataKey="name"
            stroke="#9ca3af"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            type="number"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => `€${value.toLocaleString()}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Bar 
            dataKey="spend" 
            fill="#4f46e5" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
