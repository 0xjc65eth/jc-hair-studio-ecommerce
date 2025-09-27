'use client';

import React, { useState, useEffect } from 'react';
import { GoogleAdsAutomation, CampaignPerformance } from '@/lib/automation/googleAds';
import { MetaAdsAutomation, MetaCampaignPerformance } from '@/lib/automation/metaAds';
import { useConversionTracking, defaultPixelConfig } from '@/lib/analytics/conversionTracking';

interface CampaignStats {
  totalSpend: number;
  totalRevenue: number;
  totalConversions: number;
  averageROAS: number;
  activeCampaigns: number;
  googleAds: {
    spend: number;
    revenue: number;
    roas: number;
    campaigns: number;
  };
  metaAds: {
    spend: number;
    revenue: number;
    roas: number;
    campaigns: number;
  };
}

interface ProductPerformance {
  productId: string;
  productName: string;
  category: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
  priority: 'high' | 'medium' | 'low';
}

export default function CampaignDashboard() {
  const [stats, setStats] = useState<CampaignStats>({
    totalSpend: 0,
    totalRevenue: 0,
    totalConversions: 0,
    averageROAS: 0,
    activeCampaigns: 0,
    googleAds: { spend: 0, revenue: 0, roas: 0, campaigns: 0 },
    metaAds: { spend: 0, revenue: 0, roas: 0, campaigns: 0 }
  });

  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'google' | 'meta' | 'products'>('overview');

  const conversionTracker = useConversionTracking(defaultPixelConfig);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simula dados de performance (implementar com APIs reais)
      const mockStats: CampaignStats = {
        totalSpend: 485.50,
        totalRevenue: 1847.30,
        totalConversions: 42,
        averageROAS: 3.8,
        activeCampaigns: 8,
        googleAds: {
          spend: 275.20,
          revenue: 1089.40,
          roas: 3.96,
          campaigns: 4
        },
        metaAds: {
          spend: 210.30,
          revenue: 757.90,
          roas: 3.60,
          campaigns: 4
        }
      };

      const mockProducts: ProductPerformance[] = [
        {
          productId: 'cocochoco-original-premium',
          productName: 'COCOCHOCO Original Premium',
          category: 'Progressivas',
          spend: 145.80,
          revenue: 687.50,
          conversions: 12,
          roas: 4.71,
          priority: 'high'
        },
        {
          productId: 'mega-hair-premium',
          productName: 'Mega Hair Premium Collection',
          category: 'Mega Hair',
          spend: 98.30,
          revenue: 412.80,
          conversions: 8,
          roas: 4.20,
          priority: 'high'
        },
        {
          productId: 'mari-maria-bases',
          productName: 'Bases Mari Maria',
          category: 'Maquiagem',
          spend: 67.90,
          revenue: 234.60,
          conversions: 15,
          roas: 3.45,
          priority: 'medium'
        },
        {
          productId: 'wepink-collection',
          productName: 'Wepink Professional',
          category: 'Tratamentos',
          spend: 54.20,
          revenue: 178.90,
          conversions: 7,
          roas: 3.30,
          priority: 'medium'
        }
      ];

      setStats(mockStats);
      setProductPerformance(mockProducts);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const optimizeAllCampaigns = async () => {
    setIsOptimizing(true);
    try {
      // Simula otimização de campanhas
      await new Promise(resolve => setTimeout(resolve, 3000));

      setLastOptimization(new Date().toLocaleString('pt-PT'));

      // Simula melhoria nas métricas após otimização
      setStats(prev => ({
        ...prev,
        averageROAS: prev.averageROAS * 1.05,
        googleAds: {
          ...prev.googleAds,
          roas: prev.googleAds.roas * 1.08
        },
        metaAds: {
          ...prev.metaAds,
          roas: prev.metaAds.roas * 1.03
        }
      }));

      // Tracking do evento de otimização
      conversionTracker.trackCustomEvent('campaign_optimization', {
        timestamp: new Date().toISOString(),
        campaigns_optimized: stats.activeCampaigns,
        previous_roas: stats.averageROAS
      });

    } catch (error) {
      console.error('Erro ao otimizar campanhas:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const pauseCampaign = async (productId: string) => {
    try {
      console.log(`Pausando campanha para produto: ${productId}`);
      // Implementar pausa real da campanha

      setProductPerformance(prev =>
        prev.map(product =>
          product.productId === productId
            ? { ...product, priority: 'low' as const }
            : product
        )
      );
    } catch (error) {
      console.error('Erro ao pausar campanha:', error);
    }
  };

  const increaseBudget = async (productId: string, percentage: number) => {
    try {
      console.log(`Aumentando orçamento em ${percentage}% para produto: ${productId}`);
      // Implementar aumento real do orçamento

      setProductPerformance(prev =>
        prev.map(product =>
          product.productId === productId
            ? {
                ...product,
                spend: product.spend * (1 + percentage / 100),
                priority: 'high' as const
              }
            : product
        )
      );
    } catch (error) {
      console.error('Erro ao aumentar orçamento:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const getROASColor = (roas: number) => {
    if (roas >= 4) return 'text-green-600';
    if (roas >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };

    return colors[priority] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Campanhas</h1>
            <p className="text-gray-600 mt-2">
              Controle e otimização automatizada de campanhas publicitárias
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={optimizeAllCampaigns}
              disabled={isOptimizing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Otimizando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Otimizar Campanhas</span>
                </>
              )}
            </button>

            {lastOptimization && (
              <div className="text-sm text-gray-500 flex items-center">
                <span>Última otimização: {lastOptimization}</span>
              </div>
            )}
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gasto Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpend)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ROAS Médio</p>
                <p className={`text-2xl font-bold ${getROASColor(stats.averageROAS)}`}>
                  {stats.averageROAS.toFixed(2)}x
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversões</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConversions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Visão Geral', icon: '📊' },
                { id: 'google', name: 'Google Ads', icon: '🔍' },
                { id: 'meta', name: 'Meta Ads', icon: '📘' },
                { id: 'products', name: 'Por Produto', icon: '🛍️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Google Ads Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Ads Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gasto:</span>
                  <span className="font-semibold">{formatCurrency(stats.googleAds.spend)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receita:</span>
                  <span className="font-semibold">{formatCurrency(stats.googleAds.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROAS:</span>
                  <span className={`font-semibold ${getROASColor(stats.googleAds.roas)}`}>
                    {stats.googleAds.roas.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Campanhas Ativas:</span>
                  <span className="font-semibold">{stats.googleAds.campaigns}</span>
                </div>
              </div>
            </div>

            {/* Meta Ads Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Ads Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gasto:</span>
                  <span className="font-semibold">{formatCurrency(stats.metaAds.spend)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receita:</span>
                  <span className="font-semibold">{formatCurrency(stats.metaAds.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROAS:</span>
                  <span className={`font-semibold ${getROASColor(stats.metaAds.roas)}`}>
                    {stats.metaAds.roas.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Campanhas Ativas:</span>
                  <span className="font-semibold">{stats.metaAds.campaigns}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Performance por Produto</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gasto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receita
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROAS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversões
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productPerformance.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(product.spend)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(product.revenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${getROASColor(product.roas)}`}>
                          {product.roas.toFixed(2)}x
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.conversions}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(product.priority)}`}>
                          {product.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => increaseBudget(product.productId, 20)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Aumentar orçamento em 20%"
                          >
                            ⬆️
                          </button>
                          <button
                            onClick={() => pauseCampaign(product.productId)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Pausar campanha"
                          >
                            ⏸️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alertas e Recomendações */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">🚀 Recomendações Automáticas</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>COCOCHOCO Original Premium</strong> está performando bem (ROAS 4.71x).
                  Considere aumentar o orçamento em 25%.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Campanhas Meta Ads</strong> têm frequência alta (>3).
                  Recomendamos criar novos creativos para reduzir fadiga do público.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Audiências Lookalike</strong> podem ser criadas baseadas nos compradores recentes.
                  Esto pode aumentar o alcance qualificado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}