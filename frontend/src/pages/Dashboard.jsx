import { useState, useEffect } from 'react';
import { apiService } from '../utils/api';
import OverviewCards from '../components/Dashboard/OverviewCards';
import TrendChart from '../components/Dashboard/TrendChart';
import VendorChart from '../components/Dashboard/VendorChart';
import CategoryChart from '../components/Dashboard/CategoryChart';
import InvoicesTable from '../components/Dashboard/InvoicesTable';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, trendsRes, vendorsRes, categoriesRes] = await Promise.all([
        apiService.getStats(),
        apiService.getTrends(),
        apiService.getTopVendors(),
        apiService.getCategories(),
      ]);

      setStats(statsRes.data);
      setTrends(trendsRes.data);
      setVendors(vendorsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg">
          <p className="font-medium">⚠️ {error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-3 text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your invoice analytics</p>
      </div>

      {/* Overview Cards */}
      <OverviewCards stats={stats} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TrendChart data={trends} />
        <VendorChart data={vendors} />
      </div>

      <div className="mt-6">
        <CategoryChart data={categories} />
      </div>

      {/* Invoices Table */}
      <div className="mt-6">
        <InvoicesTable />
      </div>
    </div>
  );
}
