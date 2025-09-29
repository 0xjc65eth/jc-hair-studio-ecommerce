'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Trophy,
  Gift,
  Zap,
  Crown,
  Diamond,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface UserPoints {
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  tierLevel: string;
  tierProgress: number;
}

interface NextTierInfo {
  nextTier: string;
  pointsNeeded: number;
  progress: number;
}

interface PointsTransaction {
  id: string;
  type: string;
  points: number;
  description: string;
  createdAt: string;
  metadata?: any;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  type: string;
  pointsCost: number;
  discountPercent?: number;
  discountFixed?: number;
  freeShipping: boolean;
  minTierLevel: string;
  canRedeem: boolean;
  pointsNeeded: number;
}

interface Redemption {
  id: string;
  pointsUsed: number;
  couponCode: string;
  status: string;
  expiresAt?: string;
  createdAt: string;
  reward: {
    name: string;
    description: string;
  };
}

const tierConfig = {
  BRONZE: {
    name: 'Bronze',
    icon: Star,
    color: 'text-amber-600 bg-amber-100',
    multiplier: '1x'
  },
  SILVER: {
    name: 'Prata',
    icon: Trophy,
    color: 'text-gray-600 bg-gray-100',
    multiplier: '1.2x'
  },
  GOLD: {
    name: 'Ouro',
    icon: Crown,
    color: 'text-yellow-600 bg-yellow-100',
    multiplier: '1.5x'
  },
  PLATINUM: {
    name: 'Platina',
    icon: Zap,
    color: 'text-purple-600 bg-purple-100',
    multiplier: '1.8x'
  },
  DIAMOND: {
    name: 'Diamante',
    icon: Diamond,
    color: 'text-blue-600 bg-blue-100',
    multiplier: '2x'
  }
};

const transactionTypes = {
  PURCHASE: { label: 'Compra', icon: '🛍️' },
  SIGNUP_BONUS: { label: 'Bônus de boas-vindas', icon: '🎉' },
  BIRTHDAY_BONUS: { label: 'Bônus de aniversário', icon: '🎂' },
  REVIEW_BONUS: { label: 'Bônus por avaliação', icon: '⭐' },
  REFERRAL_BONUS: { label: 'Bônus por indicação', icon: '👥' },
  TIER_BONUS: { label: 'Bônus de tier', icon: '🏆' },
  REDEEM_DISCOUNT: { label: 'Resgate de desconto', icon: '🎁' },
  EXPIRED: { label: 'Pontos expirados', icon: '⏰' },
  ADJUSTMENT: { label: 'Ajuste', icon: '⚙️' }
};

export default function PontosPage() {
  const { data: session, status } = useSession();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [nextTier, setNextTier] = useState<NextTierInfo | null>(null);
  const [tierMultiplier, setTierMultiplier] = useState<number>(1);
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history' | 'redemptions'>('overview');

  useEffect(() => {
    const fetchPointsData = async () => {
      if (!session) return;

      try {
        // Buscar dados de pontos e histórico
        const pointsResponse = await fetch('/api/points?includeHistory=true&limit=10');
        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          setUserPoints(pointsData.points);
          setNextTier(pointsData.nextTier);
          setTierMultiplier(pointsData.tierMultiplier);
          setHistory(pointsData.history?.transactions || []);
        }

        // Buscar recompensas disponíveis
        const rewardsResponse = await fetch('/api/points/rewards');
        if (rewardsResponse.ok) {
          const rewardsData = await rewardsResponse.json();
          setRewards(rewardsData.rewards || []);
        }

        // Buscar resgates ativos
        const redemptionsResponse = await fetch('/api/points/redeem');
        if (redemptionsResponse.ok) {
          const redemptionsData = await redemptionsResponse.json();
          setRedemptions(redemptionsData.redemptions || []);
        }

      } catch (error) {
        console.error('Erro ao carregar dados de pontos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, [session]);

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const response = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Resgate realizado com sucesso! Código do cupom: ${result.couponCode}`);

        // Recarregar dados
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao resgatar pontos:', error);
      alert('Erro ao resgatar pontos. Tente novamente.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Você precisa estar logado para ver seus pontos.</p>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  if (!userPoints) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Erro ao carregar dados dos pontos.</p>
        </div>
      </div>
    );
  }

  const currentTierConfig = tierConfig[userPoints.tierLevel] || tierConfig.BRONZE;
  const TierIcon = currentTierConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Programa de Pontos</h1>
          <p className="text-gray-600">Ganhe pontos a cada compra e resgate por recompensas exclusivas</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pontos Disponíveis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Pontos Disponíveis</h3>
                <p className="text-3xl font-bold text-gray-900">{userPoints.availablePoints.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Valor: €{(userPoints.availablePoints * 0.01).toFixed(2)}
            </p>
          </div>

          {/* Tier Atual */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Tier Atual</h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${currentTierConfig.color}`}>
                    <TierIcon className="w-4 h-4" />
                    {currentTierConfig.name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Multiplicador</p>
                <p className="text-xl font-bold text-gray-900">{currentTierConfig.multiplier}</p>
              </div>
            </div>

            {nextTier && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Próximo: {tierConfig[nextTier.nextTier]?.name}</span>
                  <span>{nextTier.pointsNeeded} pontos restantes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${nextTier.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Total de Pontos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total de Pontos</h3>
                <p className="text-3xl font-bold text-gray-900">{userPoints.totalPoints.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Utilizados: {userPoints.usedPoints.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Como Ganhar Pontos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Como Ganhar Pontos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Compras</h3>
              <p className="text-sm text-gray-600">10 pontos por €1 gasto</p>
              <p className="text-xs text-blue-600 mt-1">Multiplicador: {currentTierConfig.multiplier}</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Avaliações</h3>
              <p className="text-sm text-gray-600">200 pontos por review</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎂</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Aniversário</h3>
              <p className="text-sm text-gray-600">1.000 pontos no seu dia</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Indicações</h3>
              <p className="text-sm text-gray-600">1.500 pontos por amigo</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
                { id: 'rewards', label: 'Recompensas', icon: Gift },
                { id: 'history', label: 'Histórico', icon: Clock },
                { id: 'redemptions', label: 'Meus Resgates', icon: CheckCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900">Recompensas Disponíveis</h2>

            {rewards.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma recompensa disponível</h3>
                <p className="text-gray-600">Continue comprando para desbloquear recompensas!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <div key={reward.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{reward.name}</h3>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tierConfig[reward.minTierLevel]?.name}+
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-gray-900">
                        {reward.pointsCost.toLocaleString()} pontos
                      </div>
                      {reward.discountPercent && (
                        <div className="text-green-600 font-medium">
                          {reward.discountPercent}% OFF
                        </div>
                      )}
                      {reward.discountFixed && (
                        <div className="text-green-600 font-medium">
                          €{reward.discountFixed} OFF
                        </div>
                      )}
                      {reward.freeShipping && (
                        <div className="text-blue-600 font-medium">
                          Frete Grátis
                        </div>
                      )}
                    </div>

                    {reward.canRedeem ? (
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Resgatar
                      </button>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">
                          Faltam {reward.pointsNeeded.toLocaleString()} pontos
                        </p>
                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
                        >
                          Pontos insuficientes
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900">Histórico de Pontos</h2>

            {history.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma transação encontrada</h3>
                <p className="text-gray-600">Suas transações de pontos aparecerão aqui.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm">
                {history.map((transaction, index) => {
                  const typeConfig = transactionTypes[transaction.type] || { label: transaction.type, icon: '📝' };
                  const isPositive = transaction.points > 0;

                  return (
                    <div key={transaction.id} className={`p-4 ${index !== history.length - 1 ? 'border-b border-gray-200' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{typeConfig.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                            <p className="text-sm text-gray-600">{typeConfig.label}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="text-lg font-bold">
                            {isPositive ? '+' : ''}{transaction.points.toLocaleString()}
                          </span>
                          <p className="text-sm">pontos</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'redemptions' && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900">Meus Resgates</h2>

            {redemptions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resgate encontrado</h3>
                <p className="text-gray-600">Seus cupons resgatados aparecerão aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {redemptions.map((redemption) => (
                  <div key={redemption.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{redemption.reward.name}</h3>
                        <p className="text-sm text-gray-600">{redemption.reward.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        redemption.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : redemption.status === 'USED'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {redemption.status === 'ACTIVE' ? 'Ativo' :
                         redemption.status === 'USED' ? 'Usado' : 'Expirado'}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-600 mb-1">Código do Cupom:</p>
                      <p className="font-mono text-lg font-bold text-gray-900">{redemption.couponCode}</p>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{redemption.pointsUsed.toLocaleString()} pontos utilizados</span>
                      {redemption.expiresAt && (
                        <span>Expira: {new Date(redemption.expiresAt).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}