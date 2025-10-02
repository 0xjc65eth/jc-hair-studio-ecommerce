'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function CreatePromoCodePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    description: '',
    discountValue: 0,
    maxDiscount: '',
    minPurchase: '',
    freeShipping: false,
    maxUses: '',
    maxUsesPerUser: 1,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
    firstPurchaseOnly: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || !formData.description || !formData.discountValue || !formData.validTo) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          type: formData.type,
          description: formData.description,
          discountValue: Number(formData.discountValue),
          maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
          minPurchase: formData.minPurchase ? Number(formData.minPurchase) : undefined,
          freeShipping: formData.freeShipping,
          maxUses: formData.maxUses ? Number(formData.maxUses) : -1,
          maxUsesPerUser: Number(formData.maxUsesPerUser),
          validFrom: formData.validFrom ? new Date(formData.validFrom) : undefined,
          validTo: new Date(formData.validTo),
          firstPurchaseOnly: formData.firstPurchaseOnly
        })
      })

      if (response.ok) {
        toast.success('Código promocional criado com sucesso!')
        router.push('/admin/promo-codes')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao criar código')
      }
    } catch (error) {
      console.error('Erro ao criar código:', error)
      toast.error('Erro ao criar código promocional')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/promo-codes')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          Criar Código Promocional
        </h1>
        <p className="text-gray-600">
          Configure um novo cupom de desconto
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Código</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="Ex: BEMVINDO10"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="uppercase font-mono"
                required
              />
              <p className="text-xs text-gray-500">
                Código único que os clientes vão usar
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                type="text"
                placeholder="Ex: Desconto de boas-vindas"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Desconto</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="PERCENTAGE">Percentual (%)</option>
                <option value="FIXED_AMOUNT">Valor Fixo (€)</option>
                <option value="FREE_SHIPPING">Frete Grátis</option>
              </select>
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Valor do Desconto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                step="0.01"
                min="0"
                max={formData.type === 'PERCENTAGE' ? '100' : undefined}
                placeholder={formData.type === 'PERCENTAGE' ? '10' : '5.00'}
                value={formData.discountValue || ''}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                required
              />
              <p className="text-xs text-gray-500">
                {formData.type === 'PERCENTAGE' ? 'Percentual de desconto (0-100)' : 'Valor em euros'}
              </p>
            </div>

            {/* Max Discount (for percentage) */}
            {formData.type === 'PERCENTAGE' && (
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Desconto Máximo (€)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 50.00"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Limite máximo do desconto em euros (opcional)
                </p>
              </div>
            )}

            {/* Min Purchase */}
            <div className="space-y-2">
              <Label htmlFor="minPurchase">Compra Mínima (€)</Label>
              <Input
                id="minPurchase"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 30.00"
                value={formData.minPurchase}
                onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Valor mínimo de compra para usar o código (opcional)
              </p>
            </div>

            {/* Free Shipping */}
            <div className="flex items-center space-x-2">
              <input
                id="freeShipping"
                type="checkbox"
                checked={formData.freeShipping}
                onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="freeShipping" className="cursor-pointer">
                Incluir frete grátis
              </Label>
            </div>

            <hr className="my-6" />

            {/* Usage Limits */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUses">Limite Total de Usos</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="-1"
                  placeholder="-1 (ilimitado)"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  -1 para ilimitado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUsesPerUser">Usos por Usuário</Label>
                <Input
                  id="maxUsesPerUser"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.maxUsesPerUser}
                  onChange={(e) => setFormData({ ...formData, maxUsesPerUser: Number(e.target.value) })}
                />
              </div>
            </div>

            <hr className="my-6" />

            {/* Validity Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Válido De</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validTo">
                  Válido Até <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* First Purchase Only */}
            <div className="flex items-center space-x-2">
              <input
                id="firstPurchaseOnly"
                type="checkbox"
                checked={formData.firstPurchaseOnly}
                onChange={(e) => setFormData({ ...formData, firstPurchaseOnly: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="firstPurchaseOnly" className="cursor-pointer">
                Apenas primeira compra
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Criar Código
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/promo-codes')}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
