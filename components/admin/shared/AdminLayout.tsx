'use client';

import { ReactNode, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  ShoppingCart,
  Truck,
  Bell,
  Package,
  Tag,
  MapPin,
  FileText,
  Globe,
  Mail,
  Phone,
} from 'lucide-react';

/**
 * Interface para tab de navegação
 */
interface NavTab {
  id: string;
  name: string;
  icon: LucideIcon;
}

/**
 * Interface para estatísticas do header
 */
interface HeaderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

/**
 * Props do AdminLayout
 */
interface AdminLayoutProps {
  /**
   * Conteúdo a ser renderizado (tab ativa)
   */
  children: ReactNode;

  /**
   * Tab atualmente ativa
   */
  activeTab: string;

  /**
   * Callback ao mudar de tab
   */
  onTabChange: (tabId: string) => void;

  /**
   * Estatísticas para exibir no header
   */
  stats?: HeaderStats;

  /**
   * Se está carregando estatísticas
   */
  statsLoading?: boolean;
}

/**
 * AdminLayout Component
 *
 * Layout wrapper para todas as páginas do painel administrativo.
 *
 * Features:
 * - Header com logo, nome e estatísticas rápidas
 * - Indicador de status do sistema (online/offline)
 * - Navegação por tabs com ícones
 * - Footer com informações de contato
 * - Design responsivo
 * - Suporte a múltiplas tabs
 *
 * Tabs disponíveis:
 * - Dashboard (visão geral)
 * - Pedidos (gestão de orders)
 * - Envios (shipping labels)
 * - Notificações (email logs)
 * - Inventário (stock management)
 * - Cupons (discount codes)
 * - Códigos Promo (promo codes)
 * - Rastreamento (tracking)
 * - Relatórios (reports)
 *
 * @component
 *
 * @example
 * <AdminLayout
 *   activeTab="dashboard"
 *   onTabChange={(tab) => setActiveTab(tab)}
 *   stats={{ totalOrders: 150, totalRevenue: 5000, pendingOrders: 12 }}
 * >
 *   <DashboardTab />
 * </AdminLayout>
 */
export function AdminLayout({
  children,
  activeTab,
  onTabChange,
  stats,
  statsLoading = false,
}: AdminLayoutProps) {
  /**
   * Definição de todas as tabs disponíveis
   */
  const tabs: NavTab[] = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'orders', name: 'Pedidos', icon: ShoppingCart },
    { id: 'shipping', name: 'Envios', icon: Truck },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'inventory', name: 'Inventário', icon: Package },
    { id: 'coupons', name: 'Cupons', icon: Tag },
    { id: 'tracking', name: 'Rastreamento', icon: MapPin },
    { id: 'reports', name: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Principal */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Título */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  JC Hair Studio
                </h1>
                <p className="text-sm text-gray-600">Painel Administrativo Profissional</p>
              </div>
            </div>

            {/* Status e Estatísticas */}
            <div className="flex items-center gap-6">
              {/* Indicador de Status */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Sistema Online</span>
              </div>

              {/* Estatísticas Rápidas */}
              {stats && (
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {statsLoading ? '...' : stats.totalOrders}
                    </div>
                    <div className="text-gray-600">Pedidos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {statsLoading ? '...' : `€${stats.totalRevenue.toFixed(0)}`}
                    </div>
                    <div className="text-gray-600">Receita</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {statsLoading ? '...' : stats.pendingOrders}
                    </div>
                    <div className="text-gray-600">Pendentes</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">JC Hair Studio</h3>
                <p className="text-sm text-gray-600">Sistema de Gestão Empresarial</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a
                href="https://jchairstudios62.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">jchairstudios62.xyz</span>
              </a>
              <a
                href="mailto:juliocesarurss65@gmail.com"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">juliocesarurss65@gmail.com</span>
              </a>
              <a
                href="tel:+351928375226"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">+351 928375226</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
