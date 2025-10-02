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
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Euro,
  Calendar,
  Check,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface PromoCode {
  _id: string
  code: string
  type: string
  description: string
  discountValue: number
  maxDiscount?: number
  minPurchase: number
  freeShipping: boolean
  maxUses: number
  currentUses: number
  maxUsesPerUser: number
  validFrom: string
  validTo: string
  isActive: boolean
  totalRevenue: number
  totalOrders: number
  createdAt: string
}

export default function PromoCodesAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user?.email !== 'admin@jchairstudios62.xyz') {
      router.push('/')
    }
  }, [status, session, router])

  // Load promo codes
  useEffect(() => {
    if (status === 'authenticated') {
      loadPromoCodes()
    }
  }, [status, filter])

  const loadPromoCodes = async () => {
    try {
      setLoading(true)
      let url = '/api/promo'
      if (filter !== 'all') {
        url += `?isActive=${filter === 'active'}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPromoCodes(data.promoCodes || [])
      } else {
        toast.error('Erro ao carregar códigos promocionais')
      }
    } catch (error) {
      console.error('Erro ao carregar códigos:', error)
      toast.error('Erro ao carregar códigos promocionais')
    } finally {
      setLoading(false)
    }
  }

  const deactivatePromoCode = async (code: string) => {
    if (!confirm(`Desativar o código ${code}?`)) return

    try {
      const response = await fetch(`/api/promo?code=${code}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Código desativado com sucesso')
        loadPromoCodes()
      } else {
        toast.error('Erro ao desativar código')
      }
    } catch (error) {
      console.error('Erro ao desativar código:', error)
      toast.error('Erro ao desativar código')
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      PERCENTAGE: 'Percentual',
      FIXED_AMOUNT: 'Valor Fixo',
      FREE_SHIPPING: 'Frete Grátis',
      BUY_X_GET_Y: 'Compre X Leve Y'
    }
    return types[type] || type
  }

  const getStatusBadge = (promo: PromoCode) => {
    const now = new Date()
    const validTo = new Date(promo.validTo)

    if (!promo.isActive) {
      return <Badge variant="secondary">Inativo</Badge>
    }
    if (now > validTo) {
      return <Badge variant="destructive">Expirado</Badge>
    }
    if (promo.maxUses !== -1 && promo.currentUses >= promo.maxUses) {
      return <Badge variant="destructive">Esgotado</Badge>
    }
    return <Badge className="bg-green-600">Ativo</Badge>
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  const activeCount = promoCodes.filter(p => p.isActive).length
  const totalRevenue = promoCodes.reduce((sum, p) => sum + p.totalRevenue, 0)
  const totalOrders = promoCodes.reduce((sum, p) => sum + p.totalOrders, 0)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Códigos Promocionais
          </h1>
          <p className="text-gray-600">
            Gerencie cupons e promoções da loja
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/promo-codes/create')}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Código
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Códigos
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promoCodes.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeCount} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos com Cupom
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total de pedidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue com Cupons
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de vendas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Uso
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promoCodes.length > 0
                ? ((totalOrders / promoCodes.length).toFixed(1))
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Média por código
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          Todos
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
          size="sm"
        >
          Ativos
        </Button>
        <Button
          variant={filter === 'inactive' ? 'default' : 'outline'}
          onClick={() => setFilter('inactive')}
          size="sm"
        >
          Inativos
        </Button>
      </div>

      {/* Promo Codes List */}
      <Card>
        <CardHeader>
          <CardTitle>Códigos Promocionais</CardTitle>
        </CardHeader>
        <CardContent>
          {promoCodes.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Nenhum código promocional encontrado
              </p>
              <Button
                onClick={() => router.push('/admin/promo-codes/create')}
                variant="outline"
              >
                Criar Primeiro Código
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {promoCodes.map((promo) => (
                <div
                  key={promo._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-lg text-purple-700">
                          {promo.code}
                        </span>
                        {getStatusBadge(promo)}
                        <Badge variant="outline">
                          {getTypeLabel(promo.type)}
                        </Badge>
                        {promo.freeShipping && (
                          <Badge variant="secondary" className="text-xs">
                            Frete Grátis
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {promo.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Desconto:</span>
                          <p className="font-semibold">
                            {promo.type === 'PERCENTAGE'
                              ? `${promo.discountValue}%`
                              : formatCurrency(promo.discountValue)}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-500">Usos:</span>
                          <p className="font-semibold">
                            {promo.currentUses} / {promo.maxUses === -1 ? '∞' : promo.maxUses}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-500">Pedidos:</span>
                          <p className="font-semibold">
                            {promo.totalOrders}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-500">Revenue:</span>
                          <p className="font-semibold">
                            {formatCurrency(promo.totalRevenue)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(promo.validFrom)} - {formatDate(promo.validTo)}
                        </span>
                        {promo.minPurchase > 0 && (
                          <span>
                            Compra mínima: {formatCurrency(promo.minPurchase)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/admin/promo-codes/${promo.code}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deactivatePromoCode(promo.code)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
