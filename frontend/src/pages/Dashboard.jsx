// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import OverviewCards from '../components/Dashboard/OverviewCards';
import Charts from '../components/Dashboard/Charts';
import InvoicesTable from '../components/Dashboard/InvoicesTable';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const statsRes = await api.getStats();
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <OverviewCards stats={stats} />
      <Charts />
      <InvoicesTable />
    </div>
  );
}