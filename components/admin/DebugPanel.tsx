'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Mail, Database, Webhook, Activity, Send, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface SystemStatus {
  environment: {
    nodeEnv: string;
    nextAuthUrl: string;
    siteUrl: string;
    locale: string;
  };
  database: {
    status: 'connected' | 'disconnected' | 'error' | 'checking';
    url?: string;
    lastCheck?: string;
    error?: string;
  };
  email: {
    configured: boolean;
    provider: string;
    testMode: boolean;
    lastTest?: string;
    recentAttempts: EmailAttempt[];
  };
  stripe: {
    configured: boolean;
    mode: 'test' | 'live';
    webhookConfigured: boolean;
    lastWebhook?: string;
  };
  apis: {
    health: 'healthy' | 'degraded' | 'down' | 'checking';
    endpoints: EndpointStatus[];
  };
}

interface EmailAttempt {
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  type: 'contact' | 'order' | 'newsletter' | 'test';
}

interface EndpointStatus {
  endpoint: string;
  status: 'online' | 'offline' | 'slow' | 'checking';
  responseTime?: number;
  lastCheck?: string;
  error?: string;
}

interface WebhookEvent {
  id: string;
  timestamp: string;
  type: string;
  source: 'stripe' | 'sendgrid' | 'system';
  status: 'processed' | 'failed' | 'pending';
  data?: any;
}

export default function DebugPanel() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/debug/system-status');
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
      }
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWebhookEvents = async () => {
    try {
      const response = await fetch('/api/debug/webhook-events');
      if (response.ok) {
        const data = await response.json();
        setWebhookEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching webhook events:', error);
    }
  };

  const testEmailSystem = async () => {
    setTestingEmail(true);
    setEmailTestResult(null);

    try {
      const response = await fetch('/api/debug/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test',
          to: 'debug@example.com',
          bypassProduction: true
        }),
      });

      const result = await response.json();
      setEmailTestResult(result.success ? 'Test email sent successfully!' : `Test failed: ${result.error}`);

      // Refresh system status after test
      await fetchSystemStatus();
    } catch (error) {
      setEmailTestResult(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingEmail(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchSystemStatus(), fetchWebhookEvents()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'healthy':
      case 'online':
      case 'sent':
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
      case 'down':
      case 'offline':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'degraded':
      case 'slow':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'healthy':
      case 'online':
      case 'sent':
      case 'processed':
        return <CheckCircle className="h-4 w-4" />;
      case 'disconnected':
      case 'down':
      case 'offline':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'degraded':
      case 'slow':
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />;
      case 'checking':
        return <Clock className="h-4 w-4 animate-spin" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (loading && !systemStatus) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading debug information...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debug Panel</h1>
          <p className="text-muted-foreground">
            System monitoring and debugging tools for JC Hair Studio
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 text-green-700' : ''}
          >
            <Activity className="h-4 w-4 mr-1" />
            Auto Refresh {autoRefresh ? 'On' : 'Off'}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="email">Email System</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="apis">API Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.database.status || 'checking')}
                  <Badge className={getStatusColor(systemStatus?.database.status || 'checking')}>
                    {systemStatus?.database.status || 'Checking...'}
                  </Badge>
                </div>
                {systemStatus?.database.error && (
                  <p className="text-xs text-red-500 mt-2">{systemStatus.database.error}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email System</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.email.configured ? 'connected' : 'disconnected')}
                  <Badge className={getStatusColor(systemStatus?.email.configured ? 'connected' : 'disconnected')}>
                    {systemStatus?.email.configured ? 'Configured' : 'Not Configured'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Provider: {systemStatus?.email.provider || 'Unknown'}
                  {systemStatus?.email.testMode && ' (Test Mode)'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stripe</CardTitle>
                <Webhook className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.stripe.configured ? 'connected' : 'disconnected')}
                  <Badge className={getStatusColor(systemStatus?.stripe.configured ? 'connected' : 'disconnected')}>
                    {systemStatus?.stripe.configured ? 'Configured' : 'Not Configured'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Mode: {systemStatus?.stripe.mode || 'Unknown'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.apis.health || 'checking')}
                  <Badge className={getStatusColor(systemStatus?.apis.health || 'checking')}>
                    {systemStatus?.apis.health || 'Checking...'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {systemStatus?.apis.endpoints.length || 0} endpoints monitored
                </p>
              </CardContent>
            </Card>
          </div>

          {emailTestResult && (
            <Alert className={emailTestResult.includes('successfully') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertTitle>Email Test Result</AlertTitle>
              <AlertDescription>{emailTestResult}</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Current system environment configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus?.environment && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">System</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Node Environment:</span>
                        <Badge variant="outline">{systemStatus.environment.nodeEnv}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Site URL:</span>
                        <span className="text-muted-foreground">{systemStatus.environment.siteUrl}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Default Locale:</span>
                        <span className="text-muted-foreground">{systemStatus.environment.locale}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Authentication</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>NextAuth URL:</span>
                        <span className="text-muted-foreground">{systemStatus.environment.nextAuthUrl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Email System Status
                <Button
                  onClick={testEmailSystem}
                  disabled={testingEmail}
                  size="sm"
                >
                  {testingEmail ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Send className="h-4 w-4 mr-1" />
                  )}
                  Test Email
                </Button>
              </CardTitle>
              <CardDescription>Monitor email configuration and recent attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="text-muted-foreground">{systemStatus?.email.provider || 'Not configured'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Test Mode:</span>
                      <Badge variant={systemStatus?.email.testMode ? 'secondary' : 'outline'}>
                        {systemStatus?.email.testMode ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Test:</span>
                      <span className="text-muted-foreground">{systemStatus?.email.lastTest || 'Never'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Recent Email Attempts</h4>
                <div className="space-y-2">
                  {systemStatus?.email.recentAttempts?.length ? (
                    systemStatus.email.recentAttempts.map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(attempt.status)}
                            <span className="font-medium">{attempt.subject}</span>
                            <Badge variant="outline" className="text-xs">
                              {attempt.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            To: {attempt.to} • {attempt.timestamp}
                          </p>
                          {attempt.error && (
                            <p className="text-sm text-red-500 mt-1">{attempt.error}</p>
                          )}
                        </div>
                        <Badge className={getStatusColor(attempt.status)}>
                          {attempt.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No recent email attempts</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
              <CardDescription>Recent webhook events and their processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {webhookEvents.length ? (
                  webhookEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(event.status)}
                          <span className="font-medium">{event.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {event.source}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.timestamp}
                        </p>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent webhook events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Health Check</CardTitle>
              <CardDescription>Monitor the health of all API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemStatus?.apis.endpoints?.length ? (
                  systemStatus.apis.endpoints.map((endpoint) => (
                    <div key={endpoint.endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(endpoint.status)}
                          <span className="font-medium">{endpoint.endpoint}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-muted-foreground">
                            Last check: {endpoint.lastCheck || 'Never'}
                          </p>
                          {endpoint.responseTime && (
                            <p className="text-sm text-muted-foreground">
                              Response time: {endpoint.responseTime}ms
                            </p>
                          )}
                        </div>
                        {endpoint.error && (
                          <p className="text-sm text-red-500 mt-1">{endpoint.error}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(endpoint.status)}>
                        {endpoint.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No API endpoints monitored</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}