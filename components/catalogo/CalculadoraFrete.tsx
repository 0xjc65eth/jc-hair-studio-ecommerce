'use client';

import { useState } from 'react';
import { Truck, MapPin, Clock, Package, Calculator, Info, CheckCircle } from 'lucide-react';
import { ShippingCalculation } from '../../types/product';

interface CalculadoraFreteProps {
  productWeight?: number;
  productValue?: number;
  className?: string;
}

// European countries and shipping info
const SHIPPING_ZONES = {
  'belgium': {
    name: '🇧🇪 Bélgica',
    zone: 'local',
    baseCost: 5.99,
    perKg: 2.50,
    minDays: 1,
    maxDays: 3,
    express: true,
    free: 50
  },
  'netherlands': {
    name: '🇳🇱 Holanda',
    zone: 'zone1',
    baseCost: 8.99,
    perKg: 3.50,
    minDays: 2,
    maxDays: 5,
    express: true,
    free: 75
  },
  'germany': {
    name: '🇩🇪 Alemanha',
    zone: 'zone1',
    baseCost: 9.99,
    perKg: 4.00,
    minDays: 3,
    maxDays: 7,
    express: true,
    free: 75
  },
  'france': {
    name: '🇫🇷 França',
    zone: 'zone1',
    baseCost: 10.99,
    perKg: 4.50,
    minDays: 3,
    maxDays: 7,
    express: true,
    free: 75
  },
  'luxemburg': {
    name: '🇱🇺 Luxemburgo',
    zone: 'zone1',
    baseCost: 7.99,
    perKg: 3.00,
    minDays: 2,
    maxDays: 5,
    express: true,
    free: 75
  },
  'austria': {
    name: '🇦🇹 Áustria',
    zone: 'zone2',
    baseCost: 12.99,
    perKg: 5.00,
    minDays: 4,
    maxDays: 8,
    express: false,
    free: 100
  },
  'italy': {
    name: '🇮🇹 Itália',
    zone: 'zone2',
    baseCost: 13.99,
    perKg: 5.50,
    minDays: 5,
    maxDays: 10,
    express: false,
    free: 100
  },
  'spain': {
    name: '🇪🇸 Espanha',
    zone: 'zone2',
    baseCost: 14.99,
    perKg: 6.00,
    minDays: 5,
    maxDays: 10,
    express: false,
    free: 100
  },
  'portugal': {
    name: '🇵🇹 Portugal',
    zone: 'zone2',
    baseCost: 13.99,
    perKg: 5.50,
    minDays: 5,
    maxDays: 10,
    express: false,
    free: 100
  },
  'denmark': {
    name: '🇩🇰 Dinamarca',
    zone: 'zone2',
    baseCost: 15.99,
    perKg: 6.50,
    minDays: 5,
    maxDays: 10,
    express: false,
    free: 100
  },
  'sweden': {
    name: '🇸🇪 Suécia',
    zone: 'zone3',
    baseCost: 18.99,
    perKg: 7.50,
    minDays: 7,
    maxDays: 14,
    express: false,
    free: 125
  },
  'norway': {
    name: '🇳🇴 Noruega',
    zone: 'zone3',
    baseCost: 22.99,
    perKg: 8.50,
    minDays: 7,
    maxDays: 14,
    express: false,
    free: 125
  },
  'finland': {
    name: '🇫🇮 Finlândia',
    zone: 'zone3',
    baseCost: 19.99,
    perKg: 8.00,
    minDays: 7,
    maxDays: 14,
    express: false,
    free: 125
  },
  'poland': {
    name: '🇵🇱 Polônia',
    zone: 'zone2',
    baseCost: 14.99,
    perKg: 5.50,
    minDays: 5,
    maxDays: 12,
    express: false,
    free: 100
  },
  'czech': {
    name: '🇨🇿 República Tcheca',
    zone: 'zone2',
    baseCost: 15.99,
    perKg: 6.00,
    minDays: 6,
    maxDays: 12,
    express: false,
    free: 100
  },
  'other': {
    name: '🌍 Outros países EU',
    zone: 'zone3',
    baseCost: 19.99,
    perKg: 8.00,
    minDays: 7,
    maxDays: 21,
    express: false,
    free: 150
  }
};

export default function CalculadoraFrete({
  productWeight = 0.2,
  productValue = 25,
  className = ''
}: CalculadoraFreteProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [calculation, setCalculation] = useState<ShippingCalculation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateShipping = () => {
    if (!selectedCountry) return;

    const country = SHIPPING_ZONES[selectedCountry as keyof typeof SHIPPING_ZONES];
    if (!country) return;

    const totalWeight = productWeight * quantity;
    const totalValue = productValue * quantity;
    
    // Calculate cost
    let cost = country.baseCost + (country.perKg * Math.max(0, totalWeight - 0.1));
    
    // Apply free shipping if applicable
    const isFreeShipping = totalValue >= country.free;
    if (isFreeShipping) {
      cost = 0;
    }

    // Express shipping option
    const expressCost = country.express ? cost + 5.99 : 0;

    const result: ShippingCalculation = {
      country: country.name,
      weight: totalWeight,
      value: totalValue,
      estimatedDays: country.minDays,
      cost: cost,
      trackingIncluded: true
    };

    setCalculation(result);
  };

  const getEstimatedDelivery = () => {
    if (!selectedCountry || !calculation) return '';
    
    const country = SHIPPING_ZONES[selectedCountry as keyof typeof SHIPPING_ZONES];
    const today = new Date();
    const minDate = new Date(today);
    const maxDate = new Date(today);
    
    minDate.setDate(today.getDate() + country.minDays);
    maxDate.setDate(today.getDate() + country.maxDays);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'short' 
      });
    };

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  const isEligibleForFreeShipping = () => {
    if (!selectedCountry) return false;
    const country = SHIPPING_ZONES[selectedCountry as keyof typeof SHIPPING_ZONES];
    return (productValue * quantity) >= country.free;
  };

  const getAmountForFreeShipping = () => {
    if (!selectedCountry) return 0;
    const country = SHIPPING_ZONES[selectedCountry as keyof typeof SHIPPING_ZONES];
    const currentTotal = productValue * quantity;
    return Math.max(0, country.free - currentTotal);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-[#8B4513]" />
        <h3 className="text-lg font-semibold text-gray-900">Calculadora de Frete</h3>
      </div>

      <div className="space-y-4">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Selecione seu país:
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513]"
          >
            <option value="">Escolha um país...</option>
            {Object.entries(SHIPPING_ZONES).map(([key, country]) => (
              <option key={key} value={key}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 inline mr-1" />
            Quantidade:
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
            >
              −
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
            <span className="text-sm text-gray-600 ml-2">
              (≈ {(productWeight * quantity).toFixed(1)}kg)
            </span>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateShipping}
          disabled={!selectedCountry}
          className="w-full py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Calcular Frete
        </button>

        {/* Results */}
        {calculation && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Resultado do Frete</h4>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-[#8B4513] hover:text-[#6B3410]"
              >
                {showDetails ? 'Menos detalhes' : 'Mais detalhes'}
              </button>
            </div>

            {/* Free Shipping Badge */}
            {isEligibleForFreeShipping() && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Frete Grátis Aplicado!</span>
              </div>
            )}

            {/* Shipping Cost */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Destino:</span>
                <span className="font-medium">{calculation.country}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Custo do frete:</span>
                <span className={`font-bold text-lg ${calculation.cost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {calculation.cost === 0 ? 'GRÁTIS' : `€${calculation.cost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Prazo estimado:
                </span>
                <span className="font-medium">{getEstimatedDelivery()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Rastreamento:
                </span>
                <span className="font-medium text-green-600">✓ Incluído</span>
              </div>

              {/* Almost Free Shipping */}
              {!isEligibleForFreeShipping() && getAmountForFreeShipping() > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-blue-800 font-medium">
                        Adicione mais €{getAmountForFreeShipping().toFixed(2)} e ganhe frete grátis!
                      </p>
                      <p className="text-blue-600 text-xs mt-1">
                        Frete grátis a partir de €{SHIPPING_ZONES[selectedCountry as keyof typeof SHIPPING_ZONES]?.free}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Information */}
              {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Peso total:</span>
                    <span>{calculation.weight.toFixed(1)}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor da compra:</span>
                    <span>€{calculation.value.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seguro incluído:</span>
                    <span className="text-green-600">✓ Sim</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nota fiscal brasileira:</span>
                    <span className="text-green-600">✓ Incluída</span>
                  </div>
                  
                  {/* Express Option */}
                  {SHIPPING_ZONES[selectedCountry as keyof typeof SHIPPING_ZONES]?.express && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-800">⚡ Entrega Expressa disponível</span>
                        <span className="text-yellow-600">
                          (+€5.99 • 1-2 dias mais rápido)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shipping Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Informações Importantes
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Todos os envios incluem seguro e rastreamento</li>
            <li>• Produtos enviados diretamente do Brasil</li>
            <li>• Nota fiscal brasileira sempre incluída</li>
            <li>• Atendimento em português via WhatsApp</li>
            <li>• Conformidade com regulamentações da UE</li>
          </ul>
        </div>
      </div>
    </div>
  );
}