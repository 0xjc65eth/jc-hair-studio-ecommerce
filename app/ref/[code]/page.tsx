'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Gift,
  User,
  ShoppingBag,
  Star,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface ReferralCodeData {
  id: string
  code: string
  referrerRewardType: string
  referrerRewardValue: number
  refereeRewardType: string
  refereeRewardValue: number
  currentUses: number
  maxUses: number
  validTo?: string
}

interface Props {
  params: {
    code: string
  }
}

export default function ReferralPage({ params }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)
  const [referralData, setReferralData] = useState<ReferralCodeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processed, setProcessed] = useState(false)

  // Validate referral code on mount
  useEffect(() => {
    validateReferralCode()
  }, [params.code])

  // Process referral if user is authenticated
  useEffect(() => {
    if (status === 'authenticated' && referralData && !processed) {
      processReferral()
    }
  }, [status, referralData, processed])

  const validateReferralCode = async () => {
    try {
      const response = await fetch(`/api/referrals/${params.code}`)

      if (response.ok) {
        const data = await response.json()
        setReferralData(data.referralCode)

        // Store referral code in localStorage for later processing
        localStorage.setItem('pendingReferralCode', params.code)
      } else {
        const errorData = await response.json()
        setError(errorData.error)
      }
    } catch (error) {
      console.error('Erro ao validar código:', error)
      setError('Erro ao validar código de referral')
    } finally {
      setLoading(false)
    }
  }

  const processReferral = async () => {
    if (!session?.user?.id || !referralData) return

    try {
      setValidating(true)

      const response = await fetch('/api/referrals/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          referralCode: params.code,
          source: 'direct_link'
        })
      })

      if (response.ok) {
        setProcessed(true)
        localStorage.removeItem('pendingReferralCode')
        toast.success('Referral processado com sucesso! Você receberá seu desconto na primeira compra.')

        // Redirect to homepage after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        const errorData = await response.json()
        console.error('Erro ao processar referral:', errorData)
        // Don't show error toast - user might already be processed
      }
    } catch (error) {
      console.error('Erro ao processar referral:', error)
    } finally {
      setValidating(false)
    }
  }

  const handleSignUp = () => {
    router.push(`/auth/signup?ref=${params.code}`)
  }

  const handleSignIn = () => {
    router.push(`/auth/signin?ref=${params.code}&callbackUrl=${window.location.href}`)
  }

  const getRewardText = (type: string, value: number) => {
    switch (type) {
      case 'PERCENTAGE':
        return `${(value * 100).toFixed(0)}% de desconto`
      case 'FIXED':
        return `€${value.toFixed(2)} de desconto`
      case 'POINTS':
        return `${value} pontos`
      case 'CASHBACK':
        return `${(value * 100).toFixed(0)}% em cashback`
      default:
        return 'Recompensa especial'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Validando código de referral...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Código Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-red-600">{error}</p>
            <div className="space-y-2">
              <Button
                onClick={() => router.push('/')}
                className="w-full"
              >
                Ir para a loja
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!referralData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
            <Gift className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            🎉 Você foi convidado!
          </CardTitle>
          <p className="text-gray-600">
            Alguém especial te indicou a JC Hair Studio's 62
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Referral Code Display */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-700 mb-1">Código de Referral</p>
            <p className="text-2xl font-bold text-purple-900 font-mono">
              {referralData.code}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Seus benefícios:
              </h3>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">
                    Você ganha: {getRewardText(referralData.refereeRewardType, referralData.refereeRewardValue)}
                  </p>
                  <p className="text-sm text-green-600">
                    Na sua primeira compra
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800">
                    Quem te indicou ganha: {getRewardText(referralData.referrerRewardType, referralData.referrerRewardValue)}
                  </p>
                  <p className="text-sm text-blue-600">
                    Quando você fizer sua primeira compra
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          {status === 'loading' ? (
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Verificando seu status...</p>
            </div>
          ) : status === 'authenticated' ? (
            <div className="space-y-4">
              {processed ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                  <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">
                    Referral processado com sucesso!
                  </p>
                  <p className="text-sm text-green-600">
                    Você receberá seu desconto na primeira compra.
                  </p>
                </div>
              ) : validating ? (
                <div className="text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Processando referral...</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Logado como: {session.user?.email}
                  </p>
                  <Button
                    onClick={() => router.push('/')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Começar a Comprar
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600">
                Para aproveitar os benefícios, você precisa:
              </p>

              <Button
                onClick={handleSignUp}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Criar Conta e Ganhar Desconto
              </Button>

              <div className="text-center text-sm text-gray-500">
                ou
              </div>

              <Button
                onClick={handleSignIn}
                variant="outline"
                className="w-full"
              >
                Já tenho conta - Fazer Login
              </Button>
            </div>
          )}

          {/* Code Usage Stats */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Usos do código:</span>
              <Badge variant="secondary">
                {referralData.currentUses} / {referralData.maxUses}
              </Badge>
            </div>
            {referralData.validTo && (
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Válido até:</span>
                <span className="text-gray-800">
                  {new Date(referralData.validTo).toLocaleDateString('pt-PT')}
                </span>
              </div>
            )}
          </div>

          {/* Trust indicators */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Por que escolher a JC Hair Studio's 62?
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>✨ Produtos brasileiros autênticos em Portugal</li>
              <li>🚚 Entrega rápida e segura</li>
              <li>💯 Garantia de qualidade</li>
              <li>🤝 Atendimento personalizado</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}