/**
 * TABELA DE PREÇOS MEGA HAIR - SISTEMA DE IMPORTAÇÃO EUROPA-BRASIL
 *
 * DADOS BASE:
 * - Custo: €70 por 100g, 50cm (cabelo liso)
 * - Margem: 50%
 * - Preço venda base: €105 por 100g, 50cm
 *
 * DESCONTOS PROGRESSIVOS POR VOLUME:
 * - 100g: 0% desconto
 * - 200g: 10% desconto
 * - 300g: 15% desconto
 * - 500g: 20% desconto
 */

import { megaHairPricing } from './megaHairPricing';

// Gerar tabela completa de preços
export function generateFullPriceTable() {
  return megaHairPricing.generatePriceTable();
}

// Exportar tabela de preços formatada para visualização
export function getPriceTableFormatted(): string {
  const table = megaHairPricing.generatePriceTable();

  let output = '\n=== TABELA DE PREÇOS MEGA HAIR ===\n';
  output += 'Base: €70/100g, 50cm | Margem: 50%\n\n';

  const weights = [100, 200, 300, 500];
  const lengths = [50, 60, 70];
  const textures = ['STRAIGHT', 'WAVY', 'CURLY', 'COILY'];
  const textureNames = {
    'STRAIGHT': 'Liso',
    'WAVY': 'Ondulado',
    'CURLY': 'Cacheado',
    'COILY': 'Crespo'
  };

  for (const texture of textures) {
    output += `\n${'-'.repeat(80)}\n`;
    output += `TEXTURA: ${textureNames[texture as keyof typeof textureNames]}\n`;
    output += `${'-'.repeat(80)}\n`;
    output += 'Peso | Comprimento | Custo (€) | Preço Venda (€) | Desconto | Margem\n';
    output += `${'-'.repeat(80)}\n`;

    for (const weight of weights) {
      for (const length of lengths) {
        const item = table.find(
          t => t.weight === weight && t.length === length && t.texture === texture
        );

        if (item) {
          output += `${weight}g`.padEnd(5);
          output += ' | ';
          output += `${length}cm`.padEnd(12);
          output += ' | ';
          output += `€${item.cost.toFixed(2)}`.padEnd(10);
          output += ' | ';
          output += `€${item.price.toFixed(2)}`.padEnd(16);
          output += ' | ';
          output += `${item.discount.toFixed(0)}%`.padEnd(9);
          output += ' | ';
          output += `${item.margin.toFixed(1)}%\n`;
        }
      }
    }
  }

  return output;
}

// Exportar apenas preços por comprimento (liso, 100g como base)
export function getBasePricesByLength() {
  const pricing100gStraight = [50, 60, 70].map(length => {
    const result = megaHairPricing.calculateImportPrice(100, length, 'STRAIGHT');
    return {
      length,
      cost: result.finalCost,
      price: result.salePrice,
      margin: result.profitMargin
    };
  });

  return pricing100gStraight;
}

// Exportar preços por volume (50cm, liso como base)
export function getBasePricesByVolume() {
  const pricing50cmStraight = [100, 200, 300, 500].map(weight => {
    const result = megaHairPricing.calculateImportPrice(weight, 50, 'STRAIGHT');
    return {
      weight,
      cost: result.finalCost,
      price: result.salePrice,
      discount: result.volumeDiscount,
      margin: result.profitMargin
    };
  });

  return pricing50cmStraight;
}

// Calcular preço para produto específico
export function calculateProductPrice(
  weight: number,
  length: number,
  texture: 'STRAIGHT' | 'WAVY' | 'CURLY' | 'COILY'
) {
  return megaHairPricing.calculateImportPrice(weight, length, texture);
}

// Exportar tabela resumida (formato JSON limpo)
export function getPriceTableJSON() {
  return megaHairPricing.generatePriceTable();
}

// Função para integração com produtos do catálogo
export function applyPricingToProduct(
  weight: number,
  length: number,
  hairType: 'STRAIGHT' | 'WAVY' | 'CURLY' | 'COILY'
) {
  const pricing = megaHairPricing.calculateImportPrice(weight, length, hairType);

  return {
    price: pricing.salePrice,
    comparePrice: pricing.salePrice * 1.3, // Preço "de" (30% a mais)
    pricePerGram: pricing.salePrice / weight,
    costPrice: pricing.finalCost,
    margin: pricing.profitMargin,
    volumeDiscount: pricing.volumeDiscount,
    breakdown: {
      baseCost: pricing.costPrice,
      lengthMultiplier: pricing.lengthMultiplier,
      textureMultiplier: pricing.textureMultiplier,
      finalCost: pricing.finalCost,
      margin: pricing.margin
    }
  };
}

// Exportar constantes para referência
export const PRICING_CONSTANTS = {
  BASE_COST: 70, // EUR
  BASE_WEIGHT: 100, // gramas
  BASE_LENGTH: 50, // cm
  MARGIN: 50, // %

  VOLUME_DISCOUNTS: {
    '100g': '0%',
    '200g': '10%',
    '300g': '15%',
    '500g': '20%'
  },

  LENGTH_MULTIPLIERS: {
    '50cm': '1.0x (base)',
    '60cm': '1.3x (+30%)',
    '70cm': '1.6x (+60%)'
  },

  TEXTURE_MULTIPLIERS: {
    'Liso': '1.0x (base)',
    'Ondulado': '1.15x (+15%)',
    'Cacheado': '1.30x (+30%)',
    'Crespo': '1.45x (+45%)'
  }
};
