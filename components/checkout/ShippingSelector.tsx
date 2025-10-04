'use client';

import { useState, useEffect } from 'react';
import { Truck, Clock, Shield, Check, AlertCircle } from 'lucide-react';
import type { ShippingRate } from '@/lib/shipping/shipping-apis';

interface ShippingSelectorProps {
  destination: {
    country: string;
    postalCode: string;
    city?: string;
    address?: string;
    name?: string;
  };
  cartTotal: number;
  onShippingSelect: (rate: ShippingRate | null) => void;
  selectedShipping?: ShippingRate | null;
}

/**
 * Shipping Selector Component
 *
 * Allows customer to choose shipping method during checkout
 *
 * Features:
 * - Auto-calculate rates when address changes
 * - Show all available carriers
 * - Highlight cheapest and fastest options
 * - Show free shipping badge
 * - Display estimated delivery time
 */
export function ShippingSelector({
  destination,
  cartTotal,
  onShippingSelect,
  selectedShipping,
}: ShippingSelectorProps) {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasFreeShipping, setHasFreeShipping] = useState(false);

  /**
   * Calculate shipping rates when destination changes
   */
  useEffect(() => {
    if (destination.country && destination.postalCode) {
      calculateRates();
    }
  }, [destination.country, destination.postalCode, cartTotal]);

  /**
   * Fetch shipping rates from API
   */
  const calculateRates = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          cartTotal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate shipping');
      }

      const data = await response.json();

      setRates(data.rates || []);
      setHasFreeShipping(data.hasFreeShipping || false);

      // Auto-select cheapest option
      if (data.rates && data.rates.length > 0 && !selectedShipping) {
        onShippingSelect(data.rates[0]);
      }
    } catch (err: any) {
      setError('Erro ao calcular frete. Tente novamente.');
      console.error('Shipping calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle shipping method selection
   */
  const handleSelect = (rate: ShippingRate) => {
    onShippingSelect(rate);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Opções de Envio
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Calculando opções de envio...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-red-200">
        <div className="flex items-start gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Erro ao calcular frete</h4>
            <p className="text-sm">{error}</p>
            <button
              onClick={calculateRates}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Opções de Envio
        </h3>
        <p className="text-gray-600 text-sm">
          Preencha o endereço de entrega para ver as opções de envio disponíveis.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Opções de Envio
        </h3>
        {hasFreeShipping && (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
            ✓ Frete Grátis
          </span>
        )}
      </div>

      {/* Free Shipping Progress */}
      {!hasFreeShipping && cartTotal < 100 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">
            <strong>Faltam €{(100 - cartTotal).toFixed(2)}</strong> para frete grátis!
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((cartTotal / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Shipping Options */}
      <div className="space-y-3">
        {rates.map((rate, index) => {
          const isSelected = selectedShipping?.carrier === rate.carrier &&
                            selectedShipping?.service === rate.service;
          const isCheapest = index === 0 && rate.price > 0;
          const isFastest = rate.estimatedDays.split('-')[0] === '1';

          return (
            <button
              key={`${rate.carrier}-${rate.service}`}
              onClick={() => handleSelect(rate)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{rate.carrier}</h4>
                    {isCheapest && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                        Mais Barato
                      </span>
                    )}
                    {isFastest && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                        Mais Rápido
                      </span>
                    )}
                    {rate.price === 0 && (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        GRÁTIS
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rate.service}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rate.estimatedDays} dias úteis</span>
                    </div>
                    {rate.tracking && (
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Rastreamento</span>
                      </div>
                    )}
                    {rate.insurance && (
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>Seguro</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${rate.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {rate.price === 0 ? 'Grátis' : `€${rate.price.toFixed(2)}`}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Message */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          ℹ️ O prazo de entrega começa a contar após a confirmação do pagamento.
          {!hasFreeShipping && ' Adicione mais €' + (100 - cartTotal).toFixed(2) + ' para frete grátis!'}
        </p>
      </div>
    </div>
  );
}
