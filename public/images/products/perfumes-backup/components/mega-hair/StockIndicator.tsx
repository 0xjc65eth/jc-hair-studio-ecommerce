'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FireIcon,
  EyeIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

interface StockIndicatorProps {
  quantity: number;
  productId: number;
  productName: string;
  isPopular?: boolean;
}

interface StockLevel {
  level: 'high' | 'medium' | 'low' | 'critical' | 'out';
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  message: string;
  urgency: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

const getStockLevel = (quantity: number): StockLevel => {
  if (quantity === 0) {
    return {
      level: 'out',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      icon: XCircleIcon,
      message: 'Produto esgotado',
      urgency: 'critical'
    };
  } else if (quantity <= 3) {
    return {
      level: 'critical',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      icon: ExclamationTriangleIcon,
      message: `Apenas ${quantity} unidades restantes!`,
      urgency: 'critical'
    };
  } else if (quantity <= 8) {
    return {
      level: 'low',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      icon: ClockIcon,
      message: `Estoque baixo - ${quantity} unidades`,
      urgency: 'high'
    };
  } else if (quantity <= 15) {
    return {
      level: 'medium',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
      icon: ClockIcon,
      message: `${quantity} unidades disponíveis`,
      urgency: 'medium'
    };
  } else {
    return {
      level: 'high',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      icon: CheckCircleIcon,
      message: 'Em estoque',
      urgency: 'none'
    };
  }
};

export default function StockIndicator({ quantity, productId, productName, isPopular = false }: StockIndicatorProps) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [viewersCount, setViewersCount] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState(0);
  const [showPurchaseAlert, setShowPurchaseAlert] = useState(false);

  const stockLevel = getStockLevel(currentQuantity);

  // Simulate real-time stock changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional stock changes
      if (Math.random() < 0.1) {
        setCurrentQuantity(prev => {
          const change = Math.random() < 0.7 ? -1 : 1; // More likely to decrease
          const newQuantity = Math.max(0, prev + change);

          // Show purchase alert when stock decreases
          if (change < 0 && prev > 0) {
            setRecentPurchases(prev => prev + 1);
            setShowPurchaseAlert(true);
            setTimeout(() => setShowPurchaseAlert(false), 3000);
          }

          return newQuantity;
        });
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate viewers count
  useEffect(() => {
    const updateViewers = () => {
      const baseViewers = isPopular ? 15 : 8;
      const randomVariation = Math.floor(Math.random() * 10) - 5;
      setViewersCount(Math.max(1, baseViewers + randomVariation));
    };

    updateViewers();
    const interval = setInterval(updateViewers, 30000);

    return () => clearInterval(interval);
  }, [isPopular]);

  const Icon = stockLevel.icon;

  return (
    <div className="space-y-3">
      {/* Main Stock Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${stockLevel.bgColor} ${stockLevel.color}`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{stockLevel.message}</span>

        {stockLevel.urgency === 'critical' && currentQuantity > 0 && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FireIcon className="w-4 h-4 text-red-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Additional Info for Low Stock */}
      {stockLevel.urgency === 'critical' && currentQuantity > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <BoltIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">Ação Urgente Necessária!</span>
          </div>
          <p className="text-xs text-red-700 mb-2">
            Este produto está quase esgotado. Recomendamos adicionar ao carrinho imediatamente.
          </p>
          <div className="text-xs text-red-600">
            ⚡ Próxima reposição em 2-3 semanas
          </div>
        </motion.div>
      )}

      {/* Viewers and Activity Indicators */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Current Viewers */}
        <div className="flex items-center gap-1 text-gray-600">
          <EyeIcon className="w-3 h-3" />
          <span>{viewersCount} visualizando</span>
        </div>

        {/* Recent Activity */}
        {recentPurchases > 0 && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircleIcon className="w-3 h-3" />
            <span>{recentPurchases} vendido(s) hoje</span>
          </div>
        )}
      </div>

      {/* Purchase Alert */}
      <AnimatePresence>
        {showPurchaseAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-orange-800">
                Alguém acabou de comprar este produto!
              </span>
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Estoque atualizado em tempo real
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Progress Bar for Low Stock */}
      {stockLevel.urgency !== 'none' && stockLevel.urgency !== 'critical' && currentQuantity > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Estoque disponível</span>
            <span>{currentQuantity} unidades</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (currentQuantity / 30) * 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${
                currentQuantity <= 3 ? 'bg-red-500' :
                currentQuantity <= 8 ? 'bg-orange-500' :
                currentQuantity <= 15 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            />
          </div>
        </div>
      )}

      {/* Out of Stock Banner */}
      {currentQuantity === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 border border-red-300 rounded-lg p-4 text-center"
        >
          <XCircleIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h4 className="font-semibold text-red-800 mb-1">Produto Esgotado</h4>
          <p className="text-sm text-red-700 mb-3">
            Este produto está temporariamente fora de estoque
          </p>
          <div className="space-y-2">
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              Notificar quando disponível
            </button>
            <button className="w-full border border-red-600 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
              Ver produtos similares
            </button>
          </div>
          <p className="text-xs text-red-600 mt-2">
            ⏰ Próxima reposição: 2-3 semanas
          </p>
        </motion.div>
      )}

      {/* Popular Product Badge */}
      {isPopular && currentQuantity > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-2"
        >
          <div className="flex items-center gap-2 text-purple-700">
            <FireIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">Produto Popular</span>
          </div>
          <p className="text-xs text-purple-600 mt-1">
            +{Math.floor(Math.random() * 50) + 20} clientes visualizaram hoje
          </p>
        </motion.div>
      )}

      {/* Estimated Delivery for Available Products */}
      {currentQuantity > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-center gap-2 text-blue-700">
            <ClockIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Entrega estimada</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {currentQuantity >= 10 ? '5-7 dias úteis' : '7-10 dias úteis'} para Europa
          </p>
        </div>
      )}
    </div>
  );
}