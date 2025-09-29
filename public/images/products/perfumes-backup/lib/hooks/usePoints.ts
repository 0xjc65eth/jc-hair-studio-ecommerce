import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

interface PointsData {
  points: UserPoints;
  nextTier: NextTierInfo | null;
  tierMultiplier: number;
}

export function usePoints() {
  const { data: session } = useSession();
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Controller para cancelar requisição se demorar muito
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

      const response = await fetch('/api/points', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Se API falhar, usar dados padrão em vez de erro
        console.warn('API points falhou, usando dados padrão');
        setPointsData({
          points: {
            totalPoints: 0,
            availablePoints: 0,
            usedPoints: 0,
            tierLevel: 'BRONZE',
            tierProgress: 0
          },
          nextTier: {
            nextTier: 'SILVER',
            pointsNeeded: 1000,
            progress: 0
          },
          tierMultiplier: 1
        });
        return;
      }

      const data = await response.json();
      setPointsData(data);
    } catch (err) {
      // Em caso de erro (timeout, rede, etc), usar dados padrão
      console.warn('Erro ao buscar pontos, usando dados padrão:', err);
      setPointsData({
        points: {
          totalPoints: 0,
          availablePoints: 0,
          usedPoints: 0,
          tierLevel: 'BRONZE',
          tierProgress: 0
        },
        nextTier: {
          nextTier: 'SILVER',
          pointsNeeded: 1000,
          progress: 0
        },
        tierMultiplier: 1
      });
      setError(null); // Não mostrar erro para não confundir usuário
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchPoints();
    }
  }, [session?.user?.id]);

  const refreshPoints = () => {
    fetchPoints();
  };

  return {
    pointsData,
    loading,
    error,
    refreshPoints
  };
}

export function useRewards() {
  const { data: session } = useSession();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/points/rewards');
      if (!response.ok) {
        throw new Error('Erro ao buscar recompensas');
      }

      const data = await response.json();
      setRewards(data.rewards || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId: string) => {
    try {
      const response = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao resgatar pontos');
      }

      const result = await response.json();

      // Refresh rewards after successful redemption
      await fetchRewards();

      return result;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchRewards();
    }
  }, [session?.user?.id]);

  return {
    rewards,
    loading,
    error,
    redeemReward,
    refreshRewards: fetchRewards
  };
}