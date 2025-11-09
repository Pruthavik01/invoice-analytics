import { TrendingUp, TrendingDown } from 'lucide-react';

export default function ImprovedOverviewCards({ stats }) {
  if (!stats) return null;
  console.log(stats);
  const cards = [
    {
      title: 'Total Spend',
      subtitle: '(YTD)',
      value: `€ ${parseFloat(stats.totalSpend).toLocaleString()}`,
      change: '+4.2%',
      trend: 'up',
      changeText: 'from last month',
    },
    {
      title: 'Total Invoices Processed',
      subtitle: '',
      value: stats.totalInvoices.toLocaleString(),
      change: '+4.2%',
      trend: 'up',
      changeText: 'from last month',
    },
    {
      title: 'Documents Uploaded',
      subtitle: 'This Month',
      value: stats.documentsUploaded.toLocaleString(),
      change: '-8',
      trend: 'down',
      changeText: 'less from last month',
    },
    {
      title: 'Average Invoice Value',
      subtitle: '',
      value: `€ ${parseFloat(stats.avgInvoiceValue).toLocaleString()}`,
      change: '+6.2%',
      trend: 'up',
      changeText: 'from last month',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {card.title}
              </p>
              {card.subtitle && (
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              )}
            </div>
          </div>

          {/* Value */}
          <div className="mb-3">
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded ${
                card.trend === 'up'
                  ? 'text-green-700 bg-green-50'
                  : 'text-red-700 bg-red-50'
              }`}
            >
              {card.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {card.change}
            </span>
            <span className="text-xs text-gray-500">{card.changeText}</span>
          </div>
        </div>
      ))}
    </div>
  );
}