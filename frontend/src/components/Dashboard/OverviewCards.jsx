import { DollarSign, FileText, Upload, TrendingUp } from 'lucide-react';

export default function OverviewCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Spend (YTD)',
      value: `$${parseFloat(stats.totalSpend).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Invoices Processed',
      value: stats.totalInvoices.toLocaleString(),
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Documents Uploaded',
      value: stats.documentsUploaded.toLocaleString(),
      icon: Upload,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Average Invoice Value',
      value: `$${parseFloat(stats.avgInvoiceValue).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={`w-6 h-6 text-${card.color.replace('bg-', '')}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}