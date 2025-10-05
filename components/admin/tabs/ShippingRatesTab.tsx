'use client';

import { useState } from 'react';
import { Truck, Package, MapPin, DollarSign, Clock, Shield } from 'lucide-react';
import {
  ShippingCalculator,
  DEFAULT_ORIGIN,
  type ShippingAddress,
  type Package as ShippingPackage,
  type ShippingRate,
} from '@/lib/shipping/shipping-apis';

/**
 * Shipping Rates Tab
 *
 * Gestão de tarifas de envio com integração de APIs:
 * - Cálculo em tempo real de frete
 * - Comparação entre transportadoras
 * - Configuração de regras de frete grátis
 */
export function ShippingRatesTab() {
  const [destination, setDestination] = useState<Partial<ShippingAddress>>({
    country: 'PT',
    postalCode: '',
    city: '',
  });

  const [pkg, setPkg] = useState<ShippingPackage>({
    weight: 0.5,
    length: 20,
    width: 15,
    height: 10,
    value: 50,
  });

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculator = new ShippingCalculator();

  /**
   * Calculate shipping rates
   */
  const handleCalculate = async () => {
    if (!destination.country || !destination.postalCode) {
      setError('Preencha país e código postal');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullDestination: ShippingAddress = {
        country: destination.country,
        postalCode: destination.postalCode,
        city: destination.city || '',
        address: '',
        name: 'Cliente',
        phone: '',
      };

      const calculatedRates = await calculator.getAllRates(
        DEFAULT_ORIGIN,
        fullDestination,
        pkg
      );

      // Apply free shipping rule if applicable
      const finalRates = calculator.applyFreeShippingRule(
        calculatedRates,
        pkg.value,
        50
      );

      setRates(finalRates);
    } catch (err: any) {
      setError('Erro ao calcular frete: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📦 Tarifas & APIs de Envio</h2>
        <p className="text-blue-100">
          Calcule fretes em tempo real com CTT, DHL e UPS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Calculadora de Frete
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destination */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Destino</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <select
                  value={destination.country}
                  onChange={(e) => setDestination({ ...destination, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PT">Portugal</option>
                  <option value="ES">Espanha</option>
                  <option value="FR">França</option>
                  <option value="IT">Itália</option>
                  <option value="DE">Alemanha</option>
                  <option value="BE">Bélgica</option>
                  <option value="NL">Holanda</option>
                  <option value="GB">Reino Unido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal *
                </label>
                <input
                  type="text"
                  value={destination.postalCode}
                  onChange={(e) => setDestination({ ...destination, postalCode: e.target.value })}
                  placeholder="1000-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={destination.city}
                  onChange={(e) => setDestination({ ...destination, city: e.target.value })}
                  placeholder="Lisboa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Pacote</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={pkg.weight}
                  onChange={(e) => setPkg({ ...pkg, weight: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    C (cm)
                  </label>
                  <input
                    type="number"
                    value={pkg.length}
                    onChange={(e) => setPkg({ ...pkg, length: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    L (cm)
                  </label>
                  <input
                    type="number"
                    value={pkg.width}
                    onChange={(e) => setPkg({ ...pkg, width: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    A (cm)
                  </label>
                  <input
                    type="number"
                    value={pkg.height}
                    onChange={(e) => setPkg({ ...pkg, height: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Declarado (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pkg.value}
                  onChange={(e) => setPkg({ ...pkg, value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
          >
            {loading ? 'Calculando...' : 'Calcular Frete'}
          </button>
        </div>

        {/* Quick Info */}
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900 mb-1">Frete Grátis</h4>
                <p className="text-sm text-green-700">
                  Acima de €50,00 o frete é grátis automaticamente
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">APIs Integradas</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• CTT (Correios PT)</li>
                  <li>• DHL Express</li>
                  <li>• UPS Standard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-purple-900 mb-1">Origem</h4>
                <p className="text-sm text-purple-700">
                  {DEFAULT_ORIGIN.city}, {DEFAULT_ORIGIN.country}
                  <br />
                  CEP: {DEFAULT_ORIGIN.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Rates Results */}
      {rates.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Opções de Envio Disponíveis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rates.map((rate, index) => (
              <div
                key={index}
                className={`border-2 rounded-xl p-4 transition-all hover:shadow-lg ${
                  rate.price === 0
                    ? 'border-green-500 bg-green-50'
                    : index === 0
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{rate.carrier}</h4>
                    <p className="text-sm text-gray-600">{rate.service}</p>
                  </div>
                  {index === 0 && rate.price > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Mais Barato
                    </span>
                  )}
                  {rate.price === 0 && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      GRÁTIS
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      €{rate.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-600">{rate.currency}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{rate.estimatedDays} dias</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {rate.tracking && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        ✓ Rastreamento
                      </span>
                    )}
                    {rate.insurance && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        ✓ Seguro
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
