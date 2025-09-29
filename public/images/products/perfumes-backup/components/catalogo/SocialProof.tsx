'use client';

import { useState, useEffect } from 'react';
import { Eye, Users, ShoppingBag, Star, Clock, TrendingUp } from 'lucide-react';

interface SocialProofProps {
  productId: string;
  productName: string;
  variant?: 'viewing' | 'purchases' | 'trending' | 'full';
  className?: string;
}

interface ViewingData {
  count: number;
  location: string;
  timeAgo: string;
}

interface RecentPurchase {
  name: string;
  location: string;
  timeAgo: string;
  verified: boolean;
}

export default function SocialProof({
  productId,
  productName,
  variant = 'full',
  className = ''
}: SocialProofProps) {
  const [isClient, setIsClient] = useState(false);
  const [viewingNow, setViewingNow] = useState<ViewingData>({
    count: 12, // Default stable value
    location: 'Lisboa, Portugal',
    timeAgo: 'agora'
  });
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Initialize client-side hydration flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate realistic viewing data
  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    const updateViewingData = () => {
      const locations = [
        'Lisboa, Portugal',
        'Paris, França', 
        'Bruxelas, Bélgica',
        'Amsterdam, Holanda',
        'Berlim, Alemanha',
        'Madrid, Espanha',
        'Roma, Itália',
        'Zurich, Suíça'
      ];

      const baseCount = Math.floor(Math.random() * 20) + 8; // 8-28 people
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      setViewingNow({
        count: baseCount,
        location: randomLocation,
        timeAgo: 'agora'
      });
    };

    // Generate recent purchases data
    const generatePurchases = () => {
      const names = [
        'Maria S.', 'Ana P.', 'Carla M.', 'Fernanda L.', 'Juliana R.',
        'Beatriz C.', 'Camila F.', 'Débora S.', 'Flávia M.', 'Gabriela T.',
        'Helena V.', 'Isabela N.', 'Larissa B.', 'Mariana K.', 'Natália W.'
      ];

      const locations = [
        'Portugal', 'França', 'Bélgica', 'Holanda', 'Alemanha', 
        'Espanha', 'Itália', 'Áustria', 'Suíça', 'Luxemburgo'
      ];

      const timeOptions = [
        '2 minutos atrás', '5 minutos atrás', '8 minutos atrás', 
        '15 minutos atrás', '23 minutos atrás', '35 minutos atrás',
        '1 hora atrás', '2 horas atrás', '3 horas atrás'
      ];

      const purchases = Array.from({ length: 8 }, () => ({
        name: names[Math.floor(Math.random() * names.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        timeAgo: timeOptions[Math.floor(Math.random() * timeOptions.length)],
        verified: Math.random() > 0.3 // 70% verified purchases
      }));

      setRecentPurchases(purchases);
    };

    updateViewingData();
    generatePurchases();

    // Update viewing count every 15-45 seconds
    const viewingInterval = setInterval(() => {
      updateViewingData();
    }, (Math.random() * 30 + 15) * 1000);

    return () => clearInterval(viewingInterval);
  }, [productId, isClient]);

  // Cycle through recent purchases
  useEffect(() => {
    if (recentPurchases.length === 0) return;

    const purchaseInterval = setInterval(() => {
      setCurrentPurchaseIndex(prev => (prev + 1) % recentPurchases.length);
    }, 4000);

    return () => clearInterval(purchaseInterval);
  }, [recentPurchases.length]);

  const ViewingIndicator = () => (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        <div className="relative">
          <Eye className="w-4 h-4 text-green-600" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <span className="font-medium text-gray-700">{viewingNow.count}</span>
      </div>
      <span className="text-gray-600">
        {viewingNow.count === 1 ? 'pessoa vendo' : 'pessoas vendo'} agora
      </span>
    </div>
  );

  const RecentPurchaseAlert = () => {
    if (recentPurchases.length === 0) return null;
    
    const purchase = recentPurchases[currentPurchaseIndex];
    
    return (
      <div className={`
        bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3
        transition-all duration-500 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 text-sm">{purchase.name}</span>
              {purchase.verified && (
                <span className="text-green-600 text-xs">✓</span>
              )}
              <span className="text-xs text-gray-500">• {purchase.location}</span>
            </div>
            <p className="text-xs text-gray-600 truncate">
              Comprou este produto • {purchase.timeAgo}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const TrendingBadge = () => (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
      <TrendingUp className="w-3 h-3" />
      <span>Tendência</span>
    </div>
  );

  const PopularityStats = () => (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="font-bold text-gray-900">4.9</span>
        </div>
        <p className="text-xs text-gray-600">Avaliação média</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-gray-900">2.1k</span>
        </div>
        <p className="text-xs text-gray-600">Clientes satisfeitas</p>
      </div>
    </div>
  );

  if (variant === 'viewing') {
    return (
      <div className={`${className}`}>
        <ViewingIndicator />
      </div>
    );
  }

  if (variant === 'purchases') {
    return (
      <div className={`${className}`}>
        <RecentPurchaseAlert />
      </div>
    );
  }

  if (variant === 'trending') {
    return (
      <div className={`${className}`}>
        <TrendingBadge />
      </div>
    );
  }

  // Full variant with all indicators
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Viewing Now */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <ViewingIndicator />
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Última atualização: {viewingNow.timeAgo}</span>
        </div>
      </div>

      {/* Recent Purchase */}
      <RecentPurchaseAlert />

      {/* Trending Badge */}
      <div className="flex justify-between items-center">
        <TrendingBadge />
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TrendingUp className="w-3 h-3" />
          <span>+15% esta semana</span>
        </div>
      </div>

      {/* Popularity Stats */}
      <PopularityStats />

      {/* Social Proof Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-medium text-blue-900 mb-1 text-sm">
          Produto Popular Entre Brasileiras 🇧🇷
        </h4>
        <p className="text-xs text-blue-700">
          Este produto está entre os mais pedidos da nossa comunidade brasileira na Europa.
        </p>
      </div>

      {/* Urgency Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="font-medium text-yellow-800 text-sm">Estoque Limitado</span>
        </div>
        <p className="text-xs text-yellow-700">
          Últimas unidades disponíveis. Próxima remessa prevista para 15 dias.
        </p>
      </div>
    </div>
  );
}