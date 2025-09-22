'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePoints } from '@/lib/hooks/usePoints';
import { Star, Crown, Trophy, Zap, Diamond } from 'lucide-react';
import Link from 'next/link';

const tierIcons = {
  BRONZE: Star,
  SILVER: Trophy,
  GOLD: Crown,
  PLATINUM: Zap,
  DIAMOND: Diamond
};

const tierColors = {
  BRONZE: 'text-amber-600 bg-amber-100',
  SILVER: 'text-gray-600 bg-gray-100',
  GOLD: 'text-yellow-600 bg-yellow-100',
  PLATINUM: 'text-purple-600 bg-purple-100',
  DIAMOND: 'text-blue-600 bg-blue-100'
};

interface PointsWidgetProps {
  compact?: boolean;
  showProgress?: boolean;
}

export function PointsWidget({ compact = false, showProgress = true }: PointsWidgetProps) {
  const { data: session } = useSession();
  const { pointsData, loading } = usePoints();

  if (!session || loading || !pointsData) {
    return null;
  }

  const { points, nextTier, tierMultiplier } = pointsData;
  const TierIcon = tierIcons[points.tierLevel] || Star;

  if (compact) {
    return (
      <Link
        href="/conta/pontos"
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tierColors[points.tierLevel]}`}>
          <TierIcon className="w-3 h-3" />
        </div>
        <span className="font-medium">{points.availablePoints.toLocaleString()}</span>
        <span>pontos</span>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Seus Pontos</h3>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tierColors[points.tierLevel]}`}>
          <TierIcon className="w-3 h-3" />
          {points.tierLevel}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {points.availablePoints.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">pontos</span>
        </div>
        <p className="text-xs text-gray-500">
          Valor: €{(points.availablePoints * 0.01).toFixed(2)}
        </p>
      </div>

      {showProgress && nextTier && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Próximo: {nextTier.nextTier}</span>
            <span>{nextTier.pointsNeeded} pontos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${nextTier.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <Link
        href="/conta/pontos"
        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        Ver programa completo →
      </Link>
    </div>
  );
}

export default PointsWidget;