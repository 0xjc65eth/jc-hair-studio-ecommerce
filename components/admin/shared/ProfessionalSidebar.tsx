'use client';

import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Bell,
  BarChart3,
  Settings,
  Users,
  Tag,
  Search,
  FileText,
  MapPin,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
  children?: MenuItem[];
  badge?: number;
}

interface ProfessionalSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onLogout?: () => void;
}

/**
 * Professional Sidebar Navigation
 *
 * Sidebar profissional com:
 * - Navegação hierárquica
 * - Menus expansíveis
 * - Badges de notificação
 * - Design moderno e responsivo
 */
export function ProfessionalSidebar({
  activeTab,
  onTabChange,
  onLogout,
}: ProfessionalSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['vendas', 'marketing']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'vendas',
      name: 'Vendas',
      icon: ShoppingCart,
      children: [
        { id: 'orders', name: 'Pedidos', icon: ShoppingCart, badge: 5 },
        { id: 'tracking', name: 'Rastreamento', icon: MapPin },
        { id: 'coupons', name: 'Cupons', icon: Tag },
      ],
    },
    {
      id: 'produtos',
      name: 'Produtos',
      icon: Package,
      children: [
        { id: 'inventory', name: 'Inventário', icon: Package },
        { id: 'produtos', name: 'Catálogo', icon: FileText },
      ],
    },
    {
      id: 'envios',
      name: 'Envios',
      icon: Truck,
      children: [
        { id: 'shipping', name: 'Gestão de Envios', icon: Truck },
        { id: 'shipping-rates', name: 'Tarifas & APIs', icon: Settings },
      ],
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: Search,
      children: [
        { id: 'seo', name: 'SEO & Feeds', icon: Search },
        { id: 'campaigns', name: 'Campanhas', icon: BarChart3 },
      ],
    },
    {
      id: 'comunicacao',
      name: 'Comunicação',
      icon: Bell,
      children: [
        { id: 'notifications', name: 'Notificações', icon: Bell, badge: 3 },
        { id: 'customers', name: 'Clientes', icon: Users },
      ],
    },
    {
      id: 'relatorios',
      name: 'Relatórios',
      icon: BarChart3,
      children: [
        { id: 'reports', name: 'Análises', icon: BarChart3 },
        { id: 'analytics', name: 'Analytics', icon: FileText },
      ],
    },
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    setIsMobileOpen(false);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = activeTab === item.id;

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleMenu(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all rounded-lg group ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item.id)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all rounded-lg group ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100'
        } ${level > 0 ? 'ml-2' : ''}`}
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-4 h-4" />
          <span>{item.name}</span>
        </div>
        {item.badge && item.badge > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">JC</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">JC Hair Studio</h2>
            <p className="text-xs text-gray-500">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema Online</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            v1.0.0 - {new Date().toLocaleDateString('pt-PT')}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed left-0 top-0 z-40 w-72 bg-white border-r border-gray-200 h-screen transform transition-transform duration-300 flex flex-col ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
