'use client';

import React, { useState } from 'react';
import {
  Truck,
  Clock,
  DollarSign,
  Shield,
  Star,
  Check,
  X,
  Info,
  MapPin,
  Package,
  Globe,
  Zap
} from 'lucide-react';

interface ShippingRate {
  carrier: string;
  service: string;
  cost: number;
  currency: string;
  estimatedDays: number;
  estimatedDelivery: string;
  features: string[];
  trackingIncluded: boolean;
  insuranceIncluded: boolean;
  maxInsuranceValue?: number;
  restrictions?: string[];
}

interface CarrierRateComparisonProps {
  rates: ShippingRate[];
  origin?: any;
  destination?: any;
  onSelectRate?: (rate: ShippingRate) => void;
  loading?: boolean;
}

export const CarrierRateComparison: React.FC<CarrierRateComparisonProps> = ({
  rates,
  origin,
  destination,
  onSelectRate,
  loading = false
}) => {
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'cost' | 'time' | 'carrier'>('cost');

  // Sort rates based on selected criteria
  const sortedRates = [...rates].sort((a, b) => {
    switch (sortBy) {
      case 'cost':
        return a.cost - b.cost;
      case 'time':
        return a.estimatedDays - b.estimatedDays;
      case 'carrier':
        return a.carrier.localeCompare(b.carrier);
      default:
        return 0;
    }
  });

  const getCarrierIcon = (carrier: string) => {
    switch (carrier.toLowerCase()) {
      case 'ctt':
        return '🇵🇹';
      case 'correios':
        return '🇧🇷';
      case 'dpd':
        return '🇪🇺';
      case 'ups':
        return '📦';
      case 'dhl':
        return '✈️';
      default:
        return '🚚';
    }
  };

  const getDeliverySpeed = (days: number) => {
    if (days <= 1) return { label: 'Express', color: 'text-red-600', bg: 'bg-red-100' };
    if (days <= 3) return { label: 'Fast', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (days <= 5) return { label: 'Standard', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { label: 'Economy', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getCostRange = (cost: number) => {
    if (cost <= 10) return { label: 'Budget', color: 'text-green-600' };
    if (cost <= 20) return { label: 'Standard', color: 'text-blue-600' };
    if (cost <= 35) return { label: 'Premium', color: 'text-orange-600' };
    return { label: 'Express', color: 'text-red-600' };
  };

  const handleSelectRate = (rate: ShippingRate) => {
    setSelectedRate(`${rate.carrier}-${rate.service}`);
    onSelectRate?.(rate);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shipping rates available</h3>
          <p className="text-gray-500">
            Please check your destination and package details, then try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-500" />
              Shipping Rate Comparison
            </h3>
            {destination && (
              <p className="text-sm text-gray-600 mt-1">
                To: {destination.city}, {destination.country}
              </p>
            )}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cost">Price</option>
              <option value="time">Delivery Time</option>
              <option value="carrier">Carrier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rates Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRates.map((rate, index) => {
            const isSelected = selectedRate === `${rate.carrier}-${rate.service}`;
            const deliverySpeed = getDeliverySpeed(rate.estimatedDays);
            const costRange = getCostRange(rate.cost);
            const isCheapest = index === 0 && sortBy === 'cost';
            const isFastest = rate.estimatedDays === Math.min(...rates.map(r => r.estimatedDays));

            return (
              <div
                key={`${rate.carrier}-${rate.service}`}
                className={`
                  relative border rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
                onClick={() => handleSelectRate(rate)}
              >
                {/* Best Value Badge */}
                {isCheapest && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Best Value
                  </div>
                )}

                {/* Fastest Badge */}
                {isFastest && !isCheapest && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Fastest
                  </div>
                )}

                {/* Carrier Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCarrierIcon(rate.carrier)}</span>
                    <div>
                      <h4 className="font-bold text-gray-900">{rate.carrier}</h4>
                      <p className="text-sm text-gray-600">{rate.service}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Price and Delivery */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Cost</span>
                    </div>
                    <div className="font-bold text-xl text-gray-900">
                      €{rate.cost.toFixed(2)}
                    </div>
                    <div className={`text-xs font-medium ${costRange.color}`}>
                      {costRange.label}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Delivery</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {rate.estimatedDays} day{rate.estimatedDays !== 1 ? 's' : ''}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${deliverySpeed.bg} ${deliverySpeed.color}`}>
                      {deliverySpeed.label}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-2">Features:</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {rate.trackingIncluded ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-xs text-gray-700">Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {rate.insuranceIncluded ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-xs text-gray-700">
                        Insurance
                        {rate.maxInsuranceValue && (
                          <span className="text-gray-500 ml-1">
                            (up to €{rate.maxInsuranceValue})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Features */}
                {rate.features.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-600 mb-1">Included:</div>
                    <div className="flex flex-wrap gap-1">
                      {rate.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {rate.features.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{rate.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Restrictions */}
                {rate.restrictions && rate.restrictions.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Info className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600">Restrictions:</span>
                    </div>
                    <div className="text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                      {rate.restrictions.join(', ')}
                    </div>
                  </div>
                )}

                {/* Estimated Delivery Date */}
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Expected delivery: {rate.estimatedDelivery}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {rates.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Rate Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Price range:</span>
                <span className="font-medium ml-2">
                  €{Math.min(...rates.map(r => r.cost)).toFixed(2)} - €{Math.max(...rates.map(r => r.cost)).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Delivery time:</span>
                <span className="font-medium ml-2">
                  {Math.min(...rates.map(r => r.estimatedDays))} - {Math.max(...rates.map(r => r.estimatedDays))} days
                </span>
              </div>
              <div>
                <span className="text-gray-600">Carriers available:</span>
                <span className="font-medium ml-2">
                  {new Set(rates.map(r => r.carrier)).size}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrierRateComparison;