// import { useState, useEffect } from 'react';
// import { apiService } from '../utils/api';
// import OverviewCards from '../components/Dashboard/OverviewCards';
// import TrendChart from '../components/Dashboard/TrendChart';
// import VendorChart from '../components/Dashboard/VendorChart';
// import CategoryChart from '../components/Dashboard/CategoryChart';
// import InvoicesTable from '../components/Dashboard/InvoicesTable';
// import { Loader2 } from 'lucide-react';

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [trends, setTrends] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   async function loadDashboardData() {
//     try {
//       setLoading(true);
//       setError(null);

//       const [statsRes, trendsRes, vendorsRes, categoriesRes] = await Promise.all([
//         apiService.getStats(),
//         apiService.getTrends(),
//         apiService.getTopVendors(),
//         apiService.getCategories(),
//       ]);

//       setStats(statsRes.data);
//       setTrends(trendsRes.data);
//       setVendors(vendorsRes.data);
//       setCategories(categoriesRes.data);
//     } catch (err) {
//       console.error('Error loading dashboard:', err);
//       setError('Failed to load dashboard data. Make sure backend is running.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//         <span className="ml-3 text-gray-600">Loading dashboard...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg">
//           <p className="font-medium">⚠️ {error}</p>
//           <button
//             onClick={loadDashboardData}
//             className="mt-3 text-sm underline"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//         <p className="text-gray-600 mt-1">Overview of your invoice analytics</p>
//       </div>

//       {/* Overview Cards */}
//       <OverviewCards stats={stats} />

//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         <TrendChart data={trends} />
//         <VendorChart data={vendors} />
//       </div>

//       <div className="mt-6">
//         <CategoryChart data={categories} />
//       </div>

//       {/* Invoices Table */}
//       <div className="mt-6">
//         <InvoicesTable />
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { apiService } from '../utils/api';
import ImprovedOverviewCards from '../components/Dashboard/ImprovedOverviewCards';
import EnhancedTrendChart from '../components/Dashboard/EnhancedTrendChart';
import EnhancedVendorChart from '../components/Dashboard/EnhancedVendorChart';
import CategoryChart from '../components/Dashboard/CategoryChart';
import InvoicesTable from '../components/Dashboard/InvoicesTable';
import { Loader2, Users, Settings } from 'lucide-react';

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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <span className="text-gray-600 text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Error
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Amit Jadhav</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Overview Cards */}
        <ImprovedOverviewCards stats={stats} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <EnhancedTrendChart data={trends} />
          <EnhancedVendorChart data={vendors} />
        </div>

        {/* Category & Cashflow Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <CategoryChart data={categories} />
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cash Outflow Forecast
            </h2>
            <p className="text-sm text-gray-500">
              Expected payment obligations grouped by due date ranges
            </p>
            <div className="mt-6 flex items-center justify-center h-48 text-gray-400">
              <p>Chart coming soon...</p>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="mt-6">
          <InvoicesTable />
        </div>
      </div>
    </div>
  );
}