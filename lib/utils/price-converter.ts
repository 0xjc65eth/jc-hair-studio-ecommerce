// Conversor de preços de Reais para Euros
// Taxa de câmbio base: R$ 5.50 = €1.00 (pode ser atualizada)

const EXCHANGE_RATE = 5.50; // R$ para €1
const MARGIN_PERCENTAGE = 0.15; // 15% de margem para importação
const SHIPPING_COST = 2.50; // €2.50 custo de envio por produto

export interface PriceConversion {
  originalBRL: number;
  baseEUR: number;
  finalEUR: number;
  margin: number;
  shipping: number;
  savings?: number;
}

export function convertBRLtoEUR(priceBRL: number, originalPriceBRL?: number): PriceConversion {
  // Conversão base
  const baseEUR = priceBRL / EXCHANGE_RATE;

  // Adicionar margem e custos
  const margin = baseEUR * MARGIN_PERCENTAGE;
  const finalEUR = Math.round((baseEUR + margin + SHIPPING_COST) * 100) / 100;

  // Calcular economia se há preço original
  let savings = 0;
  if (originalPriceBRL) {
    const originalEUR = (originalPriceBRL / EXCHANGE_RATE) + ((originalPriceBRL / EXCHANGE_RATE) * MARGIN_PERCENTAGE) + SHIPPING_COST;
    savings = Math.round((originalEUR - finalEUR) * 100) / 100;
  }

  return {
    originalBRL: priceBRL,
    baseEUR: Math.round(baseEUR * 100) / 100,
    finalEUR,
    margin: Math.round(margin * 100) / 100,
    shipping: SHIPPING_COST,
    savings: savings > 0 ? savings : undefined
  };
}

export function formatPrice(price: number, currency: 'BRL' | 'EUR' = 'EUR'): string {
  if (currency === 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

// Validar preços do catálogo
export function validateCatalogPrices(products: any[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  products.forEach((product, index) => {
    // Verificar se o preço existe
    if (!product.price || product.price <= 0) {
      errors.push(`Produto ${index + 1} (${product.name}): Preço inválido ou ausente`);
    }

    // Verificar se preço original é maior que preço atual
    if (product.originalPrice && product.originalPrice <= product.price) {
      warnings.push(`Produto ${index + 1} (${product.name}): Preço original menor ou igual ao preço atual`);
    }

    // Verificar preços muito baixos (possível erro)
    if (product.price && product.price < 5) {
      warnings.push(`Produto ${index + 1} (${product.name}): Preço muito baixo (€${product.price})`);
    }

    // Verificar preços muito altos (possível erro)
    if (product.price && product.price > 200) {
      warnings.push(`Produto ${index + 1} (${product.name}): Preço muito alto (€${product.price})`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Aplicar desconto
export function applyDiscount(price: number, discountPercentage: number): number {
  const discountAmount = price * (discountPercentage / 100);
  return Math.round((price - discountAmount) * 100) / 100;
}

// Calcular economia total
export function calculateTotalSavings(products: any[]): number {
  return products.reduce((total, product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return total + (product.originalPrice - product.price);
    }
    return total;
  }, 0);
}

// Gerar relatório de preços
export function generatePriceReport(categories: any): {
  totalProducts: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  totalValue: number;
  discountedProducts: number;
  totalSavings: number;
  categoryBreakdown: any[];
} {
  const allProducts: any[] = [];
  const categoryBreakdown: any[] = [];

  Object.entries(categories).forEach(([key, category]: [string, any]) => {
    const categoryProducts = category.products;
    allProducts.push(...categoryProducts);

    const categoryTotal = categoryProducts.reduce((sum: number, p: any) => sum + p.price, 0);
    const categoryAvg = categoryTotal / categoryProducts.length;
    const categoryDiscounted = categoryProducts.filter((p: any) => p.originalPrice).length;

    categoryBreakdown.push({
      name: category.name,
      products: categoryProducts.length,
      totalValue: Math.round(categoryTotal * 100) / 100,
      averagePrice: Math.round(categoryAvg * 100) / 100,
      discountedProducts: categoryDiscounted
    });
  });

  const prices = allProducts.map(p => p.price);
  const totalValue = allProducts.reduce((sum, p) => sum + p.price, 0);
  const discountedProducts = allProducts.filter(p => p.originalPrice).length;
  const totalSavings = calculateTotalSavings(allProducts);

  return {
    totalProducts: allProducts.length,
    averagePrice: Math.round((totalValue / allProducts.length) * 100) / 100,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices)
    },
    totalValue: Math.round(totalValue * 100) / 100,
    discountedProducts,
    totalSavings: Math.round(totalSavings * 100) / 100,
    categoryBreakdown
  };
}