import { Suspense } from 'react';
import { Metadata } from 'next';
import { Search, Filter, ArrowUp, ArrowDown, Grid, List } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/ui/FilterSidebar';

export const metadata: Metadata = {
  title: 'Progressivas e Alisamentos - Produtos Profissionais',
  description: 'Progressivas, alisamentos e tratamentos químicos profissionais para cabelos. Produtos de alta qualidade para resultados duradouros.',
  keywords: ['progressiva', 'alisamento', 'tratamento químico', 'cabelo liso', 'profissional'],
  openGraph: {
    title: 'Progressivas e Alisamentos - 62 Beauty\'s 62',
    description: 'Produtos profissionais para progressivas e alisamentos. Transforme seus cabelos com qualidade premium.',
    images: ['/og-progressivas.jpg'],
  },
};

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  shortDesc: string;
  images: {
    url: string;
    alt: string;
    isMain: boolean;
  }[];
  categories: {
    category: {
      name: string;
      slug: string;
    };
  }[];
  brand?: string;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  tags?: string[];
  category?: string;
  compareAtPrice?: number;
}

async function getProducts(category = 'progressivas-alisamentos'): Promise<Product[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?category=${category}`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data for now
    return [
      {
        id: '1',
        name: 'Kit Progressiva Vogue Premium',
        slug: 'kit-progressiva-vogue-premium',
        price: 45.90,
        comparePrice: 55.90,
        shortDesc: 'Kit completo para progressiva profissional com resultados duradouros',
        images: [
          { url: '/products/progressiva-vogue-kit.jpg', alt: 'Kit Progressiva Vogue Premium', isMain: true }
        ],
        categories: [{ category: { name: 'Progressivas e Alisamentos', slug: 'progressivas-alisamentos' } }],
        brand: 'Vogue',
        rating: 4.8,
        reviewsCount: 124,
        inStock: true,
        tags: ['profissional', 'duradouro', 'premium'],
        category: 'Progressivas e Alisamentos'
      },
      {
        id: '2',
        name: 'Alisamento Definitivo Smooth Hair',
        slug: 'alisamento-definitivo-smooth-hair',
        price: 38.50,
        comparePrice: 45.00,
        shortDesc: 'Alisamento definitivo para cabelos cacheados e crespos',
        images: [
          { url: '/products/alisamento-smooth-hair.jpg', alt: 'Alisamento Definitivo Smooth Hair', isMain: true }
        ],
        categories: [{ category: { name: 'Progressivas e Alisamentos', slug: 'progressivas-alisamentos' } }],
        brand: 'Smooth Hair',
        rating: 4.6,
        reviewsCount: 89,
        inStock: true,
        tags: ['alisamento', 'definitivo', 'cacheados'],
        category: 'Progressivas e Alisamentos'
      },
      {
        id: '3',
        name: 'Progressiva Orgânica Natural Beauty',
        slug: 'progressiva-organica-natural-beauty',
        price: 52.90,
        comparePrice: null,
        shortDesc: 'Progressiva com ingredientes orgânicos, sem formol',
        images: [
          { url: '/products/progressiva-organica.jpg', alt: 'Progressiva Orgânica Natural Beauty', isMain: true }
        ],
        categories: [{ category: { name: 'Progressivas e Alisamentos', slug: 'progressivas-alisamentos' } }],
        brand: 'Natural Beauty',
        rating: 4.9,
        reviewsCount: 67,
        inStock: true,
        tags: ['orgânica', 'sem formol', 'natural'],
        category: 'Progressivas e Alisamentos'
      }
    ];
  }
}

const categoryFilters = [
  {
    id: 'price',
    label: 'Preço',
    type: 'range' as const,
    range: { min: 0, max: 100 },
    icon: <ArrowUp className="w-4 h-4" />,
  },
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox' as const,
    options: [
      { id: 'vogue', label: 'Vogue', count: 8 },
      { id: 'smooth-hair', label: 'Smooth Hair', count: 6 },
      { id: 'natural-beauty', label: 'Natural Beauty', count: 4 },
      { id: 'professional-line', label: 'Professional Line', count: 5 },
    ],
  },
  {
    id: 'type',
    label: 'Tipo de Produto',
    type: 'checkbox' as const,
    options: [
      { id: 'progressiva', label: 'Progressiva', count: 12 },
      { id: 'alisamento', label: 'Alisamento', count: 8 },
      { id: 'relaxamento', label: 'Relaxamento', count: 6 },
      { id: 'reconstrução', label: 'Reconstrução', count: 7 },
    ],
  },
  {
    id: 'composition',
    label: 'Composição',
    type: 'checkbox' as const,
    options: [
      { id: 'sem-formol', label: 'Sem Formol', count: 15 },
      { id: 'organica', label: 'Orgânica', count: 8 },
      { id: 'vegana', label: 'Vegana', count: 6 },
      { id: 'cruelty-free', label: 'Cruelty Free', count: 18 },
    ],
  },
  {
    id: 'hair-type',
    label: 'Tipo de Cabelo',
    type: 'checkbox' as const,
    options: [
      { id: 'cacheado', label: 'Cacheado', count: 14 },
      { id: 'crespo', label: 'Crespo', count: 12 },
      { id: 'ondulado', label: 'Ondulado', count: 16 },
      { id: 'liso', label: 'Liso', count: 10 },
    ],
  },
];

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-xl text-gray-500 mb-4">Nenhum produto encontrado</p>
        <p className="text-gray-400 mb-6">Tente ajustar os filtros ou navegue por outras categorias</p>
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          Ver Todos os Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            compareAtPrice: product.comparePrice || undefined,
            images: product.images.map(img => typeof img === 'string' ? img : img.url),
            category: product.category || 'progressivas-alisamentos'
          }} 
          variant="default"
          showQuickActions={true}
          showProfessionalPrice={true}
        />
      ))}
    </div>
  );
}

async function ProductsList() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}

export default function ProgressivasAlisamentosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">Início</a>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <a href="/produtos" className="text-gray-500 hover:text-gray-700">Produtos</a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Progressivas e Alisamentos</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Progressivas e <span className="text-yellow-400">Alisamentos</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Produtos profissionais para transformar seus cabelos com resultados duradouros. 
              Progressivas, alisamentos e tratamentos químicos de alta qualidade.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ✨ Resultados Profissionais
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                🔬 Tecnologia Avançada
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ⏱️ Longa Duração
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
                <FilterSidebar filters={categoryFilters} />
              </Suspense>
            </div>
          </aside>

          {/* Products Area */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Exibindo produtos de <span className="font-medium">Progressivas e Alisamentos</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort Options */}
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent">
                    <option>Relevância</option>
                    <option>Menor Preço</option>
                    <option>Maior Preço</option>
                    <option>Mais Vendidos</option>
                    <option>Melhor Avaliados</option>
                    <option>Lançamentos</option>
                  </select>
                  
                  {/* View Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button className="p-2 bg-black text-white">
                      <Grid className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100">
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Mobile Filter Toggle */}
                  <button className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} variant="default" />
                ))}
              </div>
            }>
              <ProductsList />
            </Suspense>
          </main>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualidade Profissional</h3>
              <p className="text-gray-600 text-sm">
                Produtos desenvolvidos especificamente para uso profissional em salões de beleza
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resultados Imediatos</h3>
              <p className="text-gray-600 text-sm">
                Transformação visível desde a primeira aplicação com duração prolongada
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cuidado e Proteção</h3>
              <p className="text-gray-600 text-sm">
                Fórmulas que tratam e protegem os fios durante o processo de alisamento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}