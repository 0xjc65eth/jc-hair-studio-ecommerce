import { Suspense } from 'react';
import { Metadata } from 'next';
import { Search, Filter, ArrowUp, ArrowDown, Grid, List, Heart, Droplets, Sparkles } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/ui/FilterSidebar';

export const metadata: Metadata = {
  title: 'Tratamentos Capilares - Máscaras e Reconstrução',
  description: 'Tratamentos intensivos para cabelos: máscaras hidratantes, reconstrução capilar, ampolas e séruns para todos os tipos de cabelo.',
  keywords: ['tratamento capilar', 'máscara hidratante', 'reconstrução', 'ampola', 'sérum', 'hidratação'],
  openGraph: {
    title: 'Tratamentos Capilares - 62 Beauty\'s 62',
    description: 'Tratamentos intensivos e máscaras para restaurar, hidratar e fortalecer seus cabelos.',
    images: ['/og-tratamentos.jpg'],
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

async function getProducts(category = 'tratamentos-capilares'): Promise<Product[]> {
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
        name: 'Máscara Hidratante Intensiva Argan Oil',
        slug: 'mascara-hidratante-argan-oil',
        price: 28.90,
        comparePrice: 35.90,
        shortDesc: 'Máscara hidratante com óleo de argan para cabelos secos e danificados',
        images: [
          { url: '/products/mascara-argan.jpg', alt: 'Máscara Hidratante Argan Oil', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Argan Oil Pro',
        rating: 4.9,
        reviewsCount: 156,
        inStock: true,
        tags: ['hidratante', 'argan', 'intensivo'],
        category: 'Tratamentos Capilares'
      },
      {
        id: '2',
        name: 'Kit Reconstrução Capilar Keratin Plus',
        slug: 'kit-reconstrucao-keratin-plus',
        price: 42.50,
        comparePrice: null,
        shortDesc: 'Kit completo para reconstrução capilar com queratina hidrolisada',
        images: [
          { url: '/products/kit-reconstrucao-keratin.jpg', alt: 'Kit Reconstrução Keratin Plus', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Keratin Plus',
        rating: 4.8,
        reviewsCount: 203,
        inStock: true,
        tags: ['reconstrução', 'queratina', 'profissional'],
        category: 'Tratamentos Capilares'
      },
      {
        id: '3',
        name: 'Ampolas Hidratação Intensiva Colágeno',
        slug: 'ampolas-hidratacao-colageno',
        price: 18.90,
        comparePrice: 22.90,
        shortDesc: 'Kit com 12 ampolas de colágeno para hidratação profunda',
        images: [
          { url: '/products/ampolas-colageno.jpg', alt: 'Ampolas Hidratação Colágeno', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'CollagenHair',
        rating: 4.7,
        reviewsCount: 89,
        inStock: true,
        tags: ['ampola', 'colágeno', 'hidratação'],
        category: 'Tratamentos Capilares'
      },
      {
        id: '4',
        name: 'Sérum Reparador Leave-In Vitamina E',
        slug: 'serum-reparador-vitamina-e',
        price: 22.90,
        comparePrice: null,
        shortDesc: 'Sérum leave-in com vitamina E para proteção e brilho',
        images: [
          { url: '/products/serum-vitamina-e.jpg', alt: 'Sérum Vitamina E', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'VitaHair',
        rating: 4.6,
        reviewsCount: 124,
        inStock: true,
        tags: ['leave-in', 'vitamina e', 'brilho'],
        category: 'Tratamentos Capilares'
      }
    ];
  }
}

const categoryFilters = [
  {
    id: 'price',
    label: 'Preço',
    type: 'range' as const,
    range: { min: 0, max: 80 },
    icon: <ArrowUp className="w-4 h-4" />,
  },
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox' as const,
    options: [
      { id: 'argan-oil-pro', label: 'Argan Oil Pro', count: 8 },
      { id: 'keratin-plus', label: 'Keratin Plus', count: 12 },
      { id: 'collagenhair', label: 'CollagenHair', count: 6 },
      { id: 'vitahair', label: 'VitaHair', count: 9 },
      { id: 'olaplex', label: 'Olaplex', count: 4 },
    ],
  },
  {
    id: 'treatment-type',
    label: 'Tipo de Tratamento',
    type: 'checkbox' as const,
    icon: <Heart className="w-4 h-4" />,
    options: [
      { id: 'hidratacao', label: 'Hidratação', count: 18 },
      { id: 'reconstrucao', label: 'Reconstrução', count: 12 },
      { id: 'nutricao', label: 'Nutrição', count: 15 },
      { id: 'reparacao', label: 'Reparação', count: 10 },
      { id: 'fortalecimento', label: 'Fortalecimento', count: 8 },
    ],
  },
  {
    id: 'format',
    label: 'Formato',
    type: 'checkbox' as const,
    icon: <Droplets className="w-4 h-4" />,
    options: [
      { id: 'mascara', label: 'Máscara', count: 16 },
      { id: 'ampola', label: 'Ampola', count: 8 },
      { id: 'serum', label: 'Sérum', count: 12 },
      { id: 'leave-in', label: 'Leave-in', count: 10 },
      { id: 'oleo', label: 'Óleo', count: 7 },
    ],
  },
  {
    id: 'active-ingredient',
    label: 'Ingrediente Ativo',
    type: 'checkbox' as const,
    icon: <Sparkles className="w-4 h-4" />,
    options: [
      { id: 'queratina', label: 'Queratina', count: 14 },
      { id: 'colageno', label: 'Colágeno', count: 8 },
      { id: 'argan', label: 'Óleo de Argan', count: 10 },
      { id: 'vitamina-e', label: 'Vitamina E', count: 12 },
      { id: 'acido-hialuronico', label: 'Ácido Hialurônico', count: 6 },
    ],
  },
  {
    id: 'hair-type',
    label: 'Tipo de Cabelo',
    type: 'checkbox' as const,
    options: [
      { id: 'seco-danificado', label: 'Seco e Danificado', count: 20 },
      { id: 'oleoso', label: 'Oleoso', count: 8 },
      { id: 'misto', label: 'Misto', count: 12 },
      { id: 'colorido', label: 'Colorido/Descolorido', count: 15 },
      { id: 'quimicamente-tratado', label: 'Quimicamente Tratado', count: 18 },
    ],
  },
];

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
          <Heart className="w-full h-full" />
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
            category: product.category || 'tratamentos-capilares'
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

export default function TratamentosCapilaresPage() {
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
              <li className="text-gray-900 font-medium">Tratamentos Capilares</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tratamentos <span className="text-blue-400">Capilares</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Máscaras hidratantes, reconstrução capilar e tratamentos intensivos para 
              restaurar a saúde e beleza dos seus cabelos.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Hidratação Profunda
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Reconstrução Capilar
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Nutrição Intensiva
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Types Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-blue-50 rounded-lg">
              <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Hidratação</h3>
              <p className="text-sm text-gray-600">
                Para cabelos secos, ressecados e que perderam o brilho natural
              </p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Reconstrução</h3>
              <p className="text-sm text-gray-600">
                Para cabelos danificados por químicas, calor e tratamentos
              </p>
            </div>
            
            <div className="p-6 bg-yellow-50 rounded-lg">
              <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Nutrição</h3>
              <p className="text-sm text-gray-600">
                Para cabelos opacos, sem vida e que precisam de vitalidade
              </p>
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
                    Exibindo produtos de <span className="font-medium">Tratamentos Capilares</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort Options */}
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Relevância</option>
                    <option>Menor Preço</option>
                    <option>Maior Preço</option>
                    <option>Mais Vendidos</option>
                    <option>Melhor Avaliados</option>
                    <option>Lançamentos</option>
                  </select>
                  
                  {/* View Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button className="p-2 bg-blue-600 text-white">
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como Escolher o Tratamento Ideal?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada tipo de cabelo tem necessidades específicas. Entenda qual tratamento é ideal para você.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-3">Teste de Porosidade</h3>
              <p className="text-gray-600 text-sm text-center">
                Cabelos porosos absorvem rapidamente a água. Use tratamentos hidratantes mais leves.
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-3">Teste de Elasticidade</h3>
              <p className="text-gray-600 text-sm text-center">
                Cabelos que quebram facilmente precisam de reconstrução com proteínas.
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-3">Teste de Brilho</h3>
              <p className="text-gray-600 text-sm text-center">
                Cabelos opacos e sem vida precisam de nutrição com óleos e vitaminas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}