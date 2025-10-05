'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Gift,
  Euro,
  Share2,
  Copy,
  Star,
  TrendingUp,
  Award,
  Wallet,
  Eye,
  MousePointer
} from 'lucide-react'
import { toast } from 'sonner'

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  totalReferralSales: number
  totalRewardsEarned: number
  totalCashbackEarned: number
  totalPointsEarned: number
  monthlyReferrals: number
  monthlyReferralSales: number
  profileViews: number
  linkClicks: number
  socialShares: number
}

interface ReferralCode {
  id: string
  code: string
  isActive: boolean
  currentUses: number
  maxUses: number
  referrerRewardType: string
  referrerRewardValue: number
  refereeRewardType: string
  refereeRewardValue: number
  shareUrl: string
  createdAt: string
}

interface CashbackData {
  totalEarned: number
  totalPaid: number
  availableBalance: number
  pendingBalance: number
  minPayoutAmount: number
}

export default function ReferralsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [cashback, setCashback] = useState<CashbackData | null>(null)
  const [recentReferrals, setRecentReferrals] = useState([])
  const [recentRewards, setRecentRewards] = useState([])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/conta/referrals')
    }
  }, [status, router])

  // Load referral data
  useEffect(() => {
    if (status === 'authenticated') {
      loadReferralData()
    }
  }, [status])

  const loadReferralData = async () => {
    try {
      // Load referral code
      const codeResponse = await fetch('/api/referrals')
      if (codeResponse.ok) {
        const codeData = await codeResponse.json()
        setReferralCode(codeData.referralCode)
      }

      // Load stats
      const statsResponse = await fetch('/api/referrals/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
        setRecentReferrals(statsData.recentReferrals)
        setRecentRewards(statsData.recentRewards)
        setCashback(statsData.cashback)
      }
    } catch (error) {
      console.error('Erro ao carregar dados de referral:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const createReferralCode = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      if (response.ok) {
        const data = await response.json()
        setReferralCode(data.referralCode)
        toast.success('Código de referral criado com sucesso!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao criar código')
      }
    } catch (error) {
      toast.error('Erro ao criar código de referral')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado para a área de transferência!')
  }

  const shareOnSocial = (platform: string) => {
    if (!referralCode) return

    const text = `Descobri os melhores produtos brasileiros de cabelo em Portugal! Use meu código ${referralCode.code} e ganhe desconto! 💇‍♀️✨`
    const url = referralCode.shareUrl

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getRewardTypeLabel = (type: string) => {
    const types = {
      PERCENTAGE: 'Desconto (%)',
      FIXED: 'Valor Fixo',
      POINTS: 'Pontos',
      CASHBACK: 'Cashback'
    }
    return types[type as keyof typeof types] || type
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Programa de Referrals
        </h1>
        <p className="text-gray-600">
          Indique amigos e ganhe recompensas incríveis! 💰
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Indicações
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.successfulReferrals || 0} converteram
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Geradas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalReferralSales || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats?.monthlyReferralSales || 0)} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recompensas Ganhas
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalRewardsEarned || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalPointsEarned || 0} pontos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cashback Disponível
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(cashback?.availableBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(cashback?.pendingBalance || 0)} pendente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Seu Código de Referral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!referralCode ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Você ainda não tem um código de referral.
              </p>
              <Button onClick={createReferralCode}>
                Criar Código de Referral
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Seu código:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={referralCode.code}
                    readOnly
                    className="font-mono font-bold text-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralCode.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Link de compartilhamento:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={referralCode.shareUrl}
                    readOnly
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralCode.shareUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial('whatsapp')}
                  className="bg-green-50 text-green-700 hover:bg-green-100"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial('facebook')}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial('twitter')}
                  className="bg-sky-50 text-sky-700 hover:bg-sky-100"
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial('telegram')}
                  className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                >
                  Telegram
                </Button>
              </div>

              {/* Code Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Usos:</span>
                    <span className="font-semibold ml-2">
                      {referralCode.currentUses} / {referralCode.maxUses}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      variant={referralCode.isActive ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {referralCode.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Rewards Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Como funcionam as recompensas:
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Você ganha:</span>
                    <p className="font-semibold text-purple-700">
                      {referralCode.referrerRewardValue * 100}%
                      {referralCode.referrerRewardType === 'PERCENTAGE' ? ' desconto' : ''}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Seu amigo ganha:</span>
                    <p className="font-semibold text-pink-700">
                      {referralCode.refereeRewardValue * 100}%
                      {referralCode.refereeRewardType === 'PERCENTAGE' ? ' desconto' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="referrals">Indicações</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          <TabsTrigger value="cashback">Cashback</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suas Indicações</CardTitle>
            </CardHeader>
            <CardContent>
              {recentReferrals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Você ainda não tem indicações.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentReferrals.map((referral: any) => (
                    <div
                      key={referral.id}
                      className="border rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          Indicação #{referral.id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(referral.createdAt).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <Badge
                        variant={
                          referral.status === 'QUALIFIED' ? 'default' :
                          referral.status === 'PENDING' ? 'secondary' : 'outline'
                        }
                      >
                        {referral.status === 'PENDING' ? 'Pendente' :
                         referral.status === 'QUALIFIED' ? 'Convertido' : referral.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Recompensas</CardTitle>
            </CardHeader>
            <CardContent>
              {recentRewards.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Você ainda não tem recompensas.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentRewards.map((reward: any) => (
                    <div
                      key={reward.id}
                      className="border rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {getRewardTypeLabel(reward.type)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(reward.createdAt).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {reward.type === 'CASHBACK' ?
                            formatCurrency(reward.cashbackAmount) :
                            reward.type === 'POINTS' ?
                            `${reward.points} pts` :
                            formatCurrency(reward.value)
                          }
                        </p>
                        <Badge variant="outline">
                          {reward.status === 'DELIVERED' ? 'Entregue' :
                           reward.status === 'PENDING' ? 'Pendente' : reward.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Cashback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Saldo Disponível
                  </h4>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(cashback?.availableBalance || 0)}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Saldo Pendente
                  </h4>
                  <p className="text-2xl font-bold text-yellow-900">
                    {formatCurrency(cashback?.pendingBalance || 0)}
                  </p>
                </div>
              </div>

              {(cashback?.availableBalance || 0) >= (cashback?.minPayoutAmount || 25) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Solicitar Saque
                  </h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Valor mínimo para saque: {formatCurrency(cashback?.minPayoutAmount || 25)}
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push('/conta/cashback')}
                  >
                    Solicitar Saque
                  </Button>
                </div>
              )}

              <div className="text-xs text-gray-500">
                <p>• Cashback é creditado após confirmação do pedido</p>
                <p>• Saques são processados em até 5 dias úteis</p>
                <p>• Taxas podem aplicar-se dependendo do método de saque</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}