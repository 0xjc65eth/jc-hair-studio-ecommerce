'use client';

/**
 * @fileoverview Production Monitoring Dashboard - JC Hair Studio
 * @author JC Hair Studio Development Team - Agent 6 (QA Specialist)
 * @version 1.0.0
 *
 * PRODUCTION MONITORING DASHBOARD:
 * - Real-time System Health Monitoring
 * - Service Status Visualization
 * - Performance Metrics Display
 * - Alert Management Interface
 * - Uptime and SLA Tracking
 * - Resource Usage Monitoring
 * - Error Rate Tracking
 * - Service Dependency Mapping
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Mail,
  Monitor,
  RefreshCw,
  Server,
  Shield,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Zap,
  XCircle,
  Bell,
  Settings,
  BarChart3,
  LineChart,
  Eye,
  Download,
  AlertCircle,
  Cpu,
  HardDrive,
  MemoryStick,
  Timer
} from 'lucide-react';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: string;
  error?: string;
  uptime?: number;
  details?: any;
}

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
    heap: {
      used: number;
      total: number;
    };
  };
  performance: {
    uptime: number;
    nodeVersion: string;
    platform: string;
    arch: string;
  };
  database: {
    connections: {
      current: number;
      max: number;
    };
  };
  errors: {
    rate: number;
    last24h: number;
  };
}

interface Alert {
  id: string;
  type: 'service_down' | 'performance' | 'system_degraded' | 'health_check_failed';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  service?: string;
  timestamp: string;
  acknowledged?: boolean;
  resolvedAt?: string;
}

interface MonitoringData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  uptime: number;
  checks: ServiceHealth[];
  metrics: SystemMetrics;
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const MONITORING_CONFIG = {
  refreshInterval: 30000, // 30 seconds
  maxAlerts: 50,
  maxHistoryPoints: 100,
  severityColors: {
    critical: 'text-red-600 bg-red-100 border-red-200',
    warning: 'text-yellow-600 bg-yellow-100 border-yellow-200',
    info: 'text-blue-600 bg-blue-100 border-blue-200'
  },
  statusColors: {
    healthy: 'text-green-600 bg-green-100 border-green-200',
    degraded: 'text-yellow-600 bg-yellow-100 border-yellow-200',
    unhealthy: 'text-red-600 bg-red-100 border-red-200'
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ProductionMonitoringDashboard: React.FC = () => {
  // State Management
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [healthHistory, setHealthHistory] = useState<Array<{ timestamp: string; uptime: number; responseTime: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');

  // Fetch monitoring data
  const fetchMonitoringData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/health/comprehensive', {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }

      const data: MonitoringData = await response.json();
      setMonitoringData(data);

      // Update health history
      setHealthHistory(prev => {
        const newPoint = {
          timestamp: data.timestamp,
          uptime: data.uptime,
          responseTime: data.checks.reduce((sum, check) => sum + check.responseTime, 0) / data.checks.length
        };

        const updated = [...prev, newPoint];
        return updated.slice(-MONITORING_CONFIG.maxHistoryPoints);
      });

      // Process alerts from unhealthy services
      const newAlerts: Alert[] = data.checks
        .filter(check => check.status === 'unhealthy' || check.status === 'degraded')
        .map(check => ({
          id: `${check.service}-${Date.now()}`,
          type: check.status === 'unhealthy' ? 'service_down' : 'performance',
          severity: check.status === 'unhealthy' ? 'critical' : 'warning',
          message: `${check.service} is ${check.status}${check.error ? `: ${check.error}` : ''}`,
          service: check.service,
          timestamp: data.timestamp
        }));

      setAlerts(prev => {
        const updated = [...prev, ...newAlerts];
        return updated.slice(-MONITORING_CONFIG.maxAlerts);
      });

      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch monitoring data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    fetchMonitoringData();

    if (autoRefresh) {
      const interval = setInterval(fetchMonitoringData, MONITORING_CONFIG.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchMonitoringData, autoRefresh]);

  // Acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  // Get service icon
  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('database')) {
      return <Database className="w-5 h-5" />;
    } else if (serviceName.toLowerCase().includes('email')) {
      return <Mail className="w-5 h-5" />;
    } else if (serviceName.toLowerCase().includes('api')) {
      return <Globe className="w-5 h-5" />;
    } else {
      return <Server className="w-5 h-5" />;
    }
  };

  // Format uptime
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Format bytes
  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Render loading state
  if (isLoading && !monitoringData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading monitoring data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !monitoringData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Monitoring System Error</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchMonitoringData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!monitoringData) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Monitor className="w-8 h-8 text-blue-600" />
            Production Monitoring
          </h1>
          <p className="text-gray-600 mt-1">Real-time system health and performance monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </span>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {autoRefresh ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </button>
          <button
            onClick={fetchMonitoringData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`bg-white rounded-xl p-6 shadow-lg border-2 ${MONITORING_CONFIG.statusColors[monitoringData.status]}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide">System Status</p>
              <p className="text-2xl font-bold capitalize">{monitoringData.status}</p>
            </div>
            {getStatusIcon(monitoringData.status)}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{formatUptime(monitoringData.uptime)}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Services</p>
              <p className="text-2xl font-bold text-gray-900">
                {monitoringData.summary.healthy}/{monitoringData.summary.total}
              </p>
              <p className="text-xs text-gray-500">healthy</p>
            </div>
            <Server className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => !a.acknowledged).length}
              </p>
              <p className="text-xs text-gray-500">unacknowledged</p>
            </div>
            <Bell className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Service Health Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Service Health Status</h3>
            <div className="text-sm text-gray-600">
              Last updated: {lastUpdate?.toLocaleTimeString() || 'Unknown'}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitoringData.checks.map((service) => (
              <div
                key={service.service}
                className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${MONITORING_CONFIG.statusColors[service.status]}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getServiceIcon(service.service)}
                    <h4 className="font-semibold">{service.service}</h4>
                  </div>
                  {getStatusIcon(service.status)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium">{service.responseTime.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Check:</span>
                    <span className="font-medium">
                      {new Date(service.lastCheck).toLocaleTimeString()}
                    </span>
                  </div>
                  {service.error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                      {service.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resource Usage
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Memory Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MemoryStick className="w-4 h-4" />
                  Memory (Heap)
                </span>
                <span className="text-sm text-gray-600">
                  {formatBytes(monitoringData.metrics.memory.heap.used)} / {formatBytes(monitoringData.metrics.memory.heap.total)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(monitoringData.metrics.memory.heap.used / monitoringData.metrics.memory.heap.total) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Database Connections */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Database Connections
                </span>
                <span className="text-sm text-gray-600">
                  {monitoringData.metrics.database.connections.current} / {monitoringData.metrics.database.connections.max}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(monitoringData.metrics.database.connections.current / monitoringData.metrics.database.connections.max) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Error Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Error Rate (24h)
                </span>
                <span className="text-sm text-gray-600">
                  {monitoringData.metrics.errors.last24h} errors
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((monitoringData.metrics.errors.rate * 100), 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Alerts
            </h3>
          </div>
          <div className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">No alerts - system running smoothly!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {alerts.slice(-10).reverse().map((alert) => (
                  <div
                    key={alert.id}
                    className={`border rounded-lg p-3 ${MONITORING_CONFIG.severityColors[alert.severity]} ${
                      alert.acknowledged ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            {alert.severity}
                          </span>
                          {alert.service && (
                            <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                              {alert.service}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs opacity-75">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="ml-3 px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs transition-colors"
                        >
                          Ack
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            System Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Version</h4>
              <p className="text-gray-600">{monitoringData.version}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Node.js</h4>
              <p className="text-gray-600">{monitoringData.metrics.performance.nodeVersion}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Platform</h4>
              <p className="text-gray-600">{monitoringData.metrics.performance.platform} {monitoringData.metrics.performance.arch}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Last Check</h4>
              <p className="text-gray-600">{new Date(monitoringData.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionMonitoringDashboard;