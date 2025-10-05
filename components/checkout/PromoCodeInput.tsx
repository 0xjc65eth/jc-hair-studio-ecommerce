'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tag, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PromoCodeInputProps {
  cartTotal: number
  cartItems: Array<{
    productId: string
    category?: string
    quantity: number
    price: number
  }>
  onPromoApplied: (discount: number, freeShipping: boolean, promoCodeId: string) => void
  onPromoRemoved: () => void
}

export function PromoCodeInput({
  cartTotal,
  cartItems,
  onPromoApplied,
  onPromoRemoved
}: PromoCodeInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string
    discount: number
    freeShipping: boolean
    promoCodeId: string
  } | null>(null)

  const validatePromoCode = async () => {
    if (!code.trim()) {
      toast.error('Digite um código promocional')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          cartTotal,
          cartItems
        })
      })

      const data = await response.json()

      if (data.success && data.valid) {
        setAppliedPromo({
          code: code.trim().toUpperCase(),
          discount: data.discount,
          freeShipping: data.freeShipping,
          promoCodeId: data.promoCodeId
        })
        onPromoApplied(data.discount, data.freeShipping, data.promoCodeId)
        toast.success(data.message || 'Código aplicado com sucesso!')
        setCode('')
      } else {
        toast.error(data.message || 'Código promocional inválido')
      }
    } catch (error) {
      console.error('Erro ao validar código:', error)
      toast.error('Erro ao validar código promocional')
    } finally {
      setLoading(false)
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    onPromoRemoved()
    toast.info('Código promocional removido')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validatePromoCode()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Código Promocional
        </span>
      </div>

      {!appliedPromo ? (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Digite o código"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            className="flex-1 uppercase"
            disabled={loading}
          />
          <Button
            onClick={validatePromoCode}
            disabled={loading || !code.trim()}
            variant="outline"
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Validando...
              </>
            ) : (
              'Aplicar'
            )}
          </Button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-green-800">
                    {appliedPromo.code}
                  </span>
                  {appliedPromo.freeShipping && (
                    <Badge variant="secondary" className="text-xs">
                      Frete Grátis
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-green-700">
                  Desconto de €{appliedPromo.discount.toFixed(2)} aplicado
                </p>
              </div>
            </div>
            <Button
              onClick={removePromoCode}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-700 hover:text-green-900 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Help text */}
      {!appliedPromo && (
        <p className="text-xs text-gray-500">
          Insira um código promocional para obter desconto
        </p>
      )}
    </div>
  )
}
