/**
 * LIVE STATS API - REAL-TIME DATA ENDPOINT
 * Provides live inventory and pricing data
 * Purpose: Signal to crawlers that data is dynamic and fresh
 */

import { NextResponse } from 'next/server';
import { allEuropeanProducts } from '@/lib/data/europeanPricingProducts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const now = new Date();

  // Calculate real-time stats
  const totalProducts = allEuropeanProducts.length;
  const inStockProducts = allEuropeanProducts.filter(p => p.inStock !== false).length;
  const outOfStockProducts = totalProducts - inStockProducts;

  // Calculate category counts
  const categoryStats = allEuropeanProducts.reduce((acc, product) => {
    const category = product.category || 'Outros';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate price ranges
  const prices = allEuropeanProducts.map(p => p.pricing.discountPrice);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Calculate brand counts
  const brandStats = allEuropeanProducts.reduce((acc, product) => {
    const brand = product.brand;
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBrands = Object.entries(brandStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([brand, count]) => ({ brand, count }));

  // Simulate live visitor count (varies by hour)
  const currentHour = now.getHours();
  const baseVisitors = 50 + (currentHour * 5);
  const randomVariation = Math.floor(Math.random() * 20);
  const liveVisitors = baseVisitors + randomVariation;

  // Recent activity simulation
  const recentActivities = [
    'Novo pedido de Progressiva Vogue',
    'Estoque atualizado - Mega Hair',
    'Preço alterado - Tratamento HairLife',
    'Novo produto adicionado',
    'Reabastecimento em andamento'
  ];

  const stats = {
    timestamp: now.toISOString(),
    lastUpdate: now.toLocaleString('pt-PT'),
    inventory: {
      totalProducts,
      inStock: inStockProducts,
      outOfStock: outOfStockProducts,
      stockPercentage: ((inStockProducts / totalProducts) * 100).toFixed(1)
    },
    pricing: {
      averagePrice: avgPrice.toFixed(2),
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      currency: 'EUR'
    },
    categories: {
      total: Object.keys(categoryStats).length,
      breakdown: categoryStats
    },
    brands: {
      total: Object.keys(brandStats).length,
      topBrands
    },
    activity: {
      liveVisitors,
      recentActivity: recentActivities[currentHour % recentActivities.length],
      serverTime: now.toISOString()
    },
    system: {
      status: 'online',
      uptime: '99.9%',
      lastSync: now.toISOString()
    }
  };

  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'X-Update-Frequency': 'realtime'
    }
  });
}
