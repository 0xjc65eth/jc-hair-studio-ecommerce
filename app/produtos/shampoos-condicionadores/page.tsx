import { Suspense } from 'react';
import { Metadata } from 'next';
import { Search, Filter, ArrowUp, ArrowDown, Grid, List, Waves, Sparkles, Shield } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/ui/FilterSidebar';

export const metadata: Metadata = {
  title: 'Shampoos e Condicionadores - Cuidado Diário',
  description: 'Shampoos e condicionadores para todos os tipos de cabelo. Produtos de limpeza e hidratação para o cuidado diário dos seus cabelos.',
  keywords: ['shampoo', 'condicionador', 'limpeza', 'hidratação', 'cuidado diário', 'cabelo'],
  openGraph: {
    title: 'Shampoos e Condicionadores - 62 Beauty\'s 62',
    description: 'Produtos essenciais para o cuidado diário: shampoos e condicionadores para todos os tipos de cabelo.',
    images: ['/og-shampoos.jpg'],
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

async function getProducts(category = 'shampoos-condicionadores'): Promise<Product[]> {
  // During build time, return static data to avoid external API calls
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    return getFallbackProducts();
  }

  try {
    // Use internal service directly during build to avoid HTTP calls
    if (typeof window === 'undefined') {
      const { MongoProductService } = await import('@/lib/services/mongoProductService');
      const result = await MongoProductService.getProducts({
        category: [category],
        limit: 20,
        sortBy: 'newest'
      });
      return result.products || [];
    }

    // Client-side fetch with proper caching
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`/api/products?category=${category}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
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
    return getFallbackProducts();
  }
}

function getFallbackProducts(): Product[] {
  // Static fallback products for build time
  return [
      {
        id: '1',
        name: 'Shampoo Hidratante Óleo de Coco',
        slug: 'shampoo-hidratante-oleo-coco',
        price: 15.90,
        comparePrice: 19.90,
        shortDesc: 'Shampoo hidratante com óleo de coco para cabelos secos',
        images: [
          { url: '/products/shampoo-coco.jpg', alt: 'Shampoo Óleo de Coco', isMain: true }
        ],
        categories: [{ category: { name: 'Shampoos e Condicionadores', slug: 'shampoos-condicionadores' } }],
        brand: 'CocoHair',
        rating: 4.8,
        reviewsCount: 234,
        inStock: true,
        tags: ['hidratante', 'coco', 'natural'],
        category: 'Shampoos e Condicionadores'
      },
      {
        id: '2',
        name: 'Kit Shampoo + Condicionador Keratin',
        slug: 'kit-shampoo-condicionador-keratin',
        price: 32.90,
        comparePrice: 39.90,
        shortDesc: 'Kit completo com shampoo e condicionador à base de queratina',
        images: [
          { url: '/products/kit-keratin.jpg', alt: 'Kit Keratin', isMain: true }
        ],
        categories: [{ category: { name: 'Shampoos e Condicionadores', slug: 'shampoos-condicionadores' } }],
        brand: 'KeratinPro',
        rating: 4.9,
        reviewsCount: 189,
        inStock: true,
        tags: ['kit', 'queratina', 'profissional'],
        category: 'Shampoos e Condicionadores'
      },
      {
        id: '3',
        name: 'Shampoo Antirresíduos Purificante',
        slug: 'shampoo-antiresiduos-purificante',
        price: 12.90,
        comparePrice: null,
        shortDesc: 'Shampoo de limpeza profunda para remoção de resíduos',
        images: [
          { url: '/products/shampoo-antiresiduos.jpg', alt: 'Shampoo Antirresíduos', isMain: true }
        ],
        categories: [{ category: { name: 'Shampoos e Condicionadores', slug: 'shampoos-condicionadores' } }],
        brand: 'PureClean',
        rating: 4.6,
        reviewsCount: 156,
        inStock: true,
        tags: ['limpeza profunda', 'purificante', 'antirresíduo'],
        category: 'Shampoos e Condicionadores'
      },
      {
        id: '4',
        name: 'Condicionador Nutritivo Argan & Vitaminas',
        slug: 'condicionador-nutritivo-argan-vitaminas',
        price: 18.50,
        comparePrice: 22.90,
        shortDesc: 'Condicionador nutritivo com óleo de argan e complexo vitamínico',
        images: [
          { url: '/products/condicionador-argan.jpg', alt: 'Condicionador Argan', isMain: true }
        ],
        categories: [{ category: { name: 'Shampoos e Condicionadores', slug: 'shampoos-condicionadores' } }],
        brand: 'ArganVit',
        rating: 4.7,
        reviewsCount: 198,
        inStock: true,
        tags: ['nutritivo', 'argan', 'vitaminas'],
        category: 'Shampoos e Condicionadores'
      },
      {
        id: '5',
        name: 'Shampoo Matizador Cabelos Loiros',
        slug: 'shampoo-matizador-loiros',
        price: 24.90,
        comparePrice: null,
        shortDesc: 'Shampoo matizador para cabelos loiros e grisalhos',
        images: [
          { url: '/products/shampoo-matizador.jpg', alt: 'Shampoo Matizador', isMain: true }
        ],
        categories: [{ category: { name: 'Shampoos e Condicionadores', slug: 'shampoos-condicionadores' } }],
        brand: 'BlondePro',
        rating: 4.8,
        reviewsCount: 145,
        inStock: true,
        tags: ['matizador', 'loiro', 'desamarelante'],
        category: 'Shampoos e Condicionadores'
      }
    ];
}

const categoryFilters = [
  {
    id: 'price',
    label: 'Preço',
    type: 'range' as const,
    range: { min: 0, max: 60 },
    icon: <ArrowUp className="w-4 h-4" />,
  },
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox' as const,
    options: [
      { id: 'cocohair', label: 'CocoHair', count: 8 },
      { id: 'keratinpro', label: 'KeratinPro', count: 12 },
      { id: 'pureclean', label: 'PureClean', count: 6 },
      { id: 'arganvit', label: 'ArganVit', count: 10 },
      { id: 'blondepro', label: 'BlondePro', count: 7 },
      { id: 'loreal', label: 'L\'Oréal', count: 15 },
    ],
  },
  {
    id: 'product-type',
    label: 'Tipo de Produto',
    type: 'checkbox' as const,
    icon: <Waves className="w-4 h-4" />,
    options: [
      { id: 'shampoo', label: 'Shampoo', count: 25 },
      { id: 'condicionador', label: 'Condicionador', count: 22 },
      { id: 'kit-duo', label: 'Kit Shampoo + Condicionador', count: 12 },
      { id: 'co-wash', label: 'Co-Wash', count: 6 },
    ],
  },
  {
    id: 'hair-concern',
    label: 'Necessidade do Cabelo',
    type: 'checkbox' as const,
    icon: <Shield className="w-4 h-4" />,
    options: [
      { id: 'hidratacao', label: 'Hidratação', count: 28 },
      { id: 'limpeza-profunda', label: 'Limpeza Profunda', count: 8 },
      { id: 'nutricao', label: 'Nutrição', count: 18 },
      { id: 'controle-oleosidade', label: 'Controle de Oleosidade', count: 12 },
      { id: 'anticaspa', label: 'Anticaspa', count: 9 },
      { id: 'matizacao', label: 'Matização', count: 7 },
    ],
  },
  {
    id: 'hair-type',
    label: 'Tipo de Cabelo',
    type: 'checkbox' as const,
    options: [
      { id: 'cacheado', label: 'Cacheado', count: 16 },
      { id: 'crespo', label: 'Crespo', count: 14 },
      { id: 'liso', label: 'Liso', count: 20 },
      { id: 'ondulado', label: 'Ondulado', count: 18 },
      { id: 'colorido', label: 'Colorido', count: 15 },
      { id: 'quimicamente-tratado', label: 'Quimicamente Tratado', count: 12 },
    ],
  },
  {
    id: 'ingredients',
    label: 'Ingredientes Especiais',
    type: 'checkbox' as const,
    icon: <Sparkles className="w-4 h-4" />,
    options: [
      { id: 'queratina', label: 'Queratina', count: 18 },
      { id: 'oleo-coco', label: 'Óleo de Coco', count: 12 },
      { id: 'oleo-argan', label: 'Óleo de Argan', count: 15 },
      { id: 'colageno', label: 'Colágeno', count: 8 },
      { id: 'acido-hialuronico', label: 'Ácido Hialurônico', count: 6 },
      { id: 'vitaminas', label: 'Complexo Vitamínico', count: 20 },
    ],
  },
  {
    id: 'formula',
    label: 'Fórmula',
    type: 'checkbox' as const,
    options: [
      { id: 'sem-sulfato', label: 'Sem Sulfato', count: 22 },
      { id: 'sem-sal', label: 'Sem Sal', count: 18 },
      { id: 'sem-parabeno', label: 'Sem Parabenos', count: 25 },
      { id: 'vegano', label: 'Vegano', count: 16 },
      { id: 'organico', label: 'Orgânico', count: 10 },
    ],
  },
];

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
          <Waves className="w-full h-full" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            compareAtPrice: product.comparePrice || undefined,
            images: product.images.map(img => typeof img === 'string' ? img : img.url),
            category: product.category || 'shampoos-condicionadores'
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

export default function ShampoosCondicionadoresPage() {
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
              <li className="text-gray-900 font-medium">Shampoos e Condicionadores</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-900 via-blue-900 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Shampoos e <span className="text-cyan-400">Condicionadores</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Produtos essenciais para o cuidado diário dos seus cabelos. 
              Limpeza, hidratação e nutrição para todos os tipos de cabelo.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Waves className="w-4 h-4" />
                Limpeza Suave
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Proteção Diária
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Nutrição Completa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hair Routine Guide */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Como Montar sua Rotina Ideal?
            </h2>
            <p className="text-gray-600">
              Descubra os produtos certos para cada etapa do cuidado com seus cabelos
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pré-Shampoo</h3>
              <p className="text-sm text-gray-600">
                Óleos ou cremes para proteger durante a lavagem
              </p>
            </div>
            
            <div className="text-center p-6 bg-cyan-50 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-cyan-100 rounded-full flex items-center justify-center">
                <span className="text-cyan-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Shampoo</h3>
              <p className="text-sm text-gray-600">
                Limpeza adequada para seu tipo de cabelo e couro cabeludo
              </p>
            </div>
            
            <div className="text-center p-6 bg-teal-50 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Condicionador</h3>
              <p className="text-sm text-gray-600">
                Hidratação e desembaraço dos fios
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Finalização</h3>
              <p className="text-sm text-gray-600">
                Leave-in, óleos ou cremes para proteger e definir
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
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
                    Exibindo produtos de <span className="font-medium">Shampoos e Condicionadores</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort Options */}
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option>Relevância</option>
                    <option>Menor Preço</option>
                    <option>Maior Preço</option>
                    <option>Mais Vendidos</option>
                    <option>Melhor Avaliados</option>
                    <option>Lançamentos</option>
                  </select>
                  
                  {/* View Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button className="p-2 bg-cyan-600 text-white">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Benefits Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por Que Escolher Nossos Shampoos e Condicionadores?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Waves className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fórmulas Balanceadas</h3>
              <p className="text-gray-600 text-sm">
                Produtos com pH equilibrado para respeitar a estrutura natural dos fios
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredientes Premium</h3>
              <p className="text-gray-600 text-sm">
                Óleos naturais, vitaminas e proteínas para nutrição completa
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resultados Visíveis</h3>
              <p className="text-gray-600 text-sm">
                Cabelos mais macios, brilhosos e saudáveis desde os primeiros usos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}