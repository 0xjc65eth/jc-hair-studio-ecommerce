'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalculatorIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface StrandCalculatorProps {
  productLength: number;
  productWeight: number;
  onCalculationChange?: (result: CalculationResult) => void;
}

interface CalculationResult {
  strandsNeeded: number;
  totalWeight: number;
  totalCost: number;
  applicationTime: string;
}

export default function StrandCalculator({
  productLength,
  productWeight,
  onCalculationChange
}: StrandCalculatorProps) {
  const [hairLength, setHairLength] = useState('medium');
  const [desiredVolume, setDesiredVolume] = useState('medium');
  const [hairThickness, setHairThickness] = useState('medium');
  const [showResult, setShowResult] = useState(false);

  const hairLengthOptions = {
    short: { label: 'Curto (até ombros)', multiplier: 0.7 },
    medium: { label: 'Médio (até meio das costas)', multiplier: 1.0 },
    long: { label: 'Longo (abaixo da cintura)', multiplier: 1.4 }
  };

  const volumeOptions = {
    light: { label: 'Volume Sutil', multiplier: 0.8 },
    medium: { label: 'Volume Natural', multiplier: 1.0 },
    full: { label: 'Volume Máximo', multiplier: 1.3 }
  };

  const thicknessOptions = {
    fine: { label: 'Cabelo Fino', multiplier: 1.2 },
    medium: { label: 'Cabelo Normal', multiplier: 1.0 },
    thick: { label: 'Cabelo Grosso', multiplier: 0.8 }
  };

  const calculateStrands = (): CalculationResult => {
    const baseStrands = 8; // Base padrão para aplicação completa

    const lengthMultiplier = hairLengthOptions[hairLength as keyof typeof hairLengthOptions].multiplier;
    const volumeMultiplier = volumeOptions[desiredVolume as keyof typeof volumeOptions].multiplier;
    const thicknessMultiplier = thicknessOptions[hairThickness as keyof typeof thicknessOptions].multiplier;

    const strandsNeeded = Math.ceil(baseStrands * lengthMultiplier * volumeMultiplier * thicknessMultiplier);
    const totalWeight = strandsNeeded * productWeight;
    const totalCost = strandsNeeded * 85; // Preço base estimado

    // Calcular tempo de aplicação
    const baseTime = 120; // 2 horas base
    const timeMultiplier = (strandsNeeded / 8);
    const totalMinutes = Math.ceil(baseTime * timeMultiplier);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const applicationTime = `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;

    return {
      strandsNeeded,
      totalWeight,
      totalCost,
      applicationTime
    };
  };

  const handleCalculate = () => {
    const result = calculateStrands();
    setShowResult(true);
    onCalculationChange?.(result);
  };

  const result = showResult ? calculateStrands() : null;

  return (
    <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-100">
      <div className="flex items-center gap-2 mb-6">
        <CalculatorIcon className="w-6 h-6 text-rose-600" />
        <h3 className="text-xl font-semibold text-gray-900">Calculadora de Mechas</h3>
      </div>

      <div className="space-y-6">
        {/* Comprimento do Cabelo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Comprimento do seu cabelo atual
          </label>
          <div className="space-y-2">
            {Object.entries(hairLengthOptions).map(([key, option]) => (
              <button
                key={key}
                onClick={() => setHairLength(key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  hairLength === key
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'bg-white hover:bg-rose-50 text-gray-700 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Desejado */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Volume desejado
          </label>
          <div className="space-y-2">
            {Object.entries(volumeOptions).map(([key, option]) => (
              <button
                key={key}
                onClick={() => setDesiredVolume(key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  desiredVolume === key
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'bg-white hover:bg-rose-50 text-gray-700 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Espessura do Cabelo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Espessura do seu cabelo
          </label>
          <div className="space-y-2">
            {Object.entries(thicknessOptions).map(([key, option]) => (
              <button
                key={key}
                onClick={() => setHairThickness(key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  hairThickness === key
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'bg-white hover:bg-rose-50 text-gray-700 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botão Calcular */}
        <button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          Calcular Quantidade Necessária
        </button>

        {/* Resultado */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-rose-600"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Resultado da Calculadora</h4>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-rose-50 rounded-lg">
                <div className="text-2xl font-bold text-rose-600">{result.strandsNeeded}</div>
                <div className="text-sm text-gray-600">Mechas Necessárias</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{result.totalWeight}g</div>
                <div className="text-sm text-gray-600">Peso Total</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">€{result.totalCost}</div>
                <div className="text-sm text-gray-600">Custo Estimado</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.applicationTime}</div>
                <div className="text-sm text-gray-600">Tempo de Aplicação</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Dica Profissional:</p>
                  <p>Recomendamos sempre ter 1-2 mechas extras para possíveis retoques.
                  O resultado pode variar conforme a técnica de aplicação e preferência pessoal.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}