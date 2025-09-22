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
      const response = await fetch('/api/points');
      if (!response.ok) {
        throw new Error('Erro ao buscar pontos');
      }

      const data = await response.json();
      setPointsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
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