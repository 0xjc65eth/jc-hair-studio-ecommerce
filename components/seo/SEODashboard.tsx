'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  overview: {
    keyMetrics: {
      totalClicks: number;
      totalImpressions: number;
      avgCTR: number;
      avgPosition: number;
    };
  };
  searchConsole: {
    topQueries: any;
    topPages: any;
  };
  errors: {
    notFound: any;
    redirects: any;
  };
  traffic: any;
  rankings: any[];
  lastUpdated: string;
}

export default function SEODashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'queries' | 'pages' | 'errors' | 'rankings'>('overview');
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/dashboard');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error: Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (action: string) => {
    try {
      const response = await fetch('/api/seo/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to perform action');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Monitoring Dashboard</h1>
        <p className="text-gray-600">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Clicks"
          value={data.overview.keyMetrics.totalClicks.toLocaleString()}
          icon="📊"
        />
        <MetricCard
          title="Total Impressions"
          value={data.overview.keyMetrics.totalImpressions.toLocaleString()}
          icon="👁️"
        />
        <MetricCard
          title="Average CTR"
          value={`${data.overview.keyMetrics.avgCTR}%`}
          icon="🎯"
        />
        <MetricCard
          title="Average Position"
          value={data.overview.keyMetrics.avgPosition.toFixed(1)}
          icon="📈"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <TabButton
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            label="Top Queries"
            active={activeTab === 'queries'}
            onClick={() => setActiveTab('queries')}
          />
          <TabButton
            label="Top Pages"
            active={activeTab === 'pages'}
            onClick={() => setActiveTab('pages')}
          />
          <TabButton
            label="Errors"
            active={activeTab === 'errors'}
            onClick={() => setActiveTab('errors')}
          />
          <TabButton
            label="Rankings"
            active={activeTab === 'rankings'}
            onClick={() => setActiveTab('rankings')}
          />
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'queries' && <QueriesTab data={data.searchConsole.topQueries} />}
        {activeTab === 'pages' && <PagesTab data={data.searchConsole.topPages} />}
        {activeTab === 'errors' && <ErrorsTab data={data.errors} />}
        {activeTab === 'rankings' && <RankingsTab data={data.rankings} onRefresh={() => handleRefresh('refresh-rankings')} />}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={fetchDashboardData}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
        <button
          onClick={() => handleRefresh('check-indexing')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Check Indexing
        </button>
        <button
          onClick={() => handleRefresh('clear-404s')}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Clear Old 404s
        </button>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 border-b-2 font-medium text-sm ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

function OverviewTab({ data }: { data: DashboardData }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Traffic Alerts</h3>
          {data.traffic?.criticalAlerts?.length > 0 ? (
            <ul className="space-y-2">
              {data.traffic.criticalAlerts.map((alert: any, index: number) => (
                <li key={index} className="text-sm text-red-600">
                  {alert.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No critical alerts</p>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Error Summary</h3>
          <p className="text-sm text-gray-600">
            404 Errors (7 days): {data.errors?.notFound?.total || 0}
          </p>
          <p className="text-sm text-gray-600">
            Redirects (30 days): {data.errors?.redirects?.total || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

function QueriesTab({ data }: { data: any }) {
  if (!data?.rows || data.rows.length === 0) {
    return <p className="text-gray-500">No query data available</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Top Search Queries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Query</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impressions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.rows.map((row: any, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keys[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.clicks}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.impressions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {((row.clicks / row.impressions) * 100).toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {row.position?.toFixed(1) || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PagesTab({ data }: { data: any }) {
  if (!data?.rows || data.rows.length === 0) {
    return <p className="text-gray-500">No page data available</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Top Pages</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impressions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.rows.map((row: any, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{row.keys[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.clicks}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.impressions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {((row.clicks / row.impressions) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ErrorsTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">404 Errors (Last 7 Days)</h2>
        {data?.notFound?.byUrl?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Seen</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.notFound.byUrl.slice(0, 20).map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{item.url}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.lastSeen).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No 404 errors recorded</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Redirects (Last 30 Days)</h2>
        {data?.redirects?.bySource?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.redirects.bySource.slice(0, 20).map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.from}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No redirects recorded</p>
        )}
      </div>
    </div>
  );
}

function RankingsTab({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No ranking data available</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fetch Rankings
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Keyword Rankings</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Refresh Rankings
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item: any, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keyword}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.position || 'Not Found'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {item.url || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
