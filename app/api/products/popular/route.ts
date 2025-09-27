import { NextResponse } from 'next/server';

// Produtos brasileiros populares em cache
const popularProducts = [
  {
    id: 'progressiva-vogue-1l',
    name: 'Progressiva Vogue Original 1L',
    price: 89.99,
    image: '/images/products/progressiva-vogue/progressiva-vogue-1l.jpg',
    category: 'Progressivas',
    brand: 'Vogue',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 324,
    inStock: true,
    trending: true
  },
  {
    id: 'mega-hair-60cm',
    name: 'Mega Hair Brasileiro 60cm - Loiro',
    price: 185.00,
    image: '/images/products/mega-hair/mega-hair-60cm-loiro.jpg',
    category: 'Mega Hair',
    brand: 'JC Hair',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 189,
    inStock: true,
    trending: true
  },
  {
    id: 'tinta-wella-cor-chocolate',
    name: 'Tinta Wella Cor & Ton - Chocolate 5.77',
    price: 24.99,
    image: '/images/products/tintas-wella/tinta-wella-chocolate.jpg',
    category: 'Tintas',
    brand: 'Wella',
    origin: 'Brasil',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    bestseller: true
  },
  {
    id: 'esmalte-impala-vermelho',
    name: 'Esmalte Impala Cremoso - Vermelho Brasil',
    price: 8.99,
    image: '/images/products/esmaltes-impala/esmalte-vermelho-brasil.jpg',
    category: 'Esmaltes',
    brand: 'Impala',
    origin: 'Brasil',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    newArrival: true
  },
  {
    id: 'base-mari-maria-02',
    name: 'Base Mari Maria Makeup - Cor 02',
    price: 45.90,
    image: '/images/products/mari-maria/base-mari-maria-02.jpg',
    category: 'Maquiagem',
    brand: 'Mari Maria',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    exclusive: true
  },
  {
    id: 'btx-capilar-portier',
    name: 'BTX Capilar Portier Matizador 1kg',
    price: 125.00,
    image: '/images/products/btx-portier/btx-matizador-1kg.jpg',
    category: 'Tratamentos',
    brand: 'Portier',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 267,
    inStock: true,
    professional: true
  }
];

export async function GET() {
  try {
    // Simula processamento com delay mínimo
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: popularProducts,
      meta: {
        total: popularProducts.length,
        cached: true,
        timestamp: new Date().toISOString(),
        origin: 'Brasil 🇧🇷'
      }
    });
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch popular products' },
      { status: 500 }
    );
  }
}