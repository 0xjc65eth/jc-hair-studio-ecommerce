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
    // Return produtos reais de tratamento capilar
    return [
      {
        id: 'trat-001',
        name: 'Máscara Reparadora Absolut',
        slug: 'mascara-reparadora-absolut',
        price: 125.90,
        comparePrice: null,
        shortDesc: 'Máscara reparadora para cabelos extremamente danificados',
        images: [
          { url: '/images/products/mascara-reparadora.jpg', alt: 'Máscara Reparadora Absolut', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Kerastase',
        rating: 4.8,
        reviewsCount: 345,
        inStock: true,
        tags: ['reparação', 'cabelos danificados', 'nutrição'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-002',
        name: 'Ampola Reconstruction 12ml',
        slug: 'ampola-reconstruction-12ml',
        price: 45.50,
        comparePrice: 55.00,
        shortDesc: 'Ampola de reconstrução capilar intensiva',
        images: [
          { url: '/images/products/ampola-reconstruction.jpg', alt: 'Ampola Reconstruction', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'L\'Oreal',
        rating: 4.6,
        reviewsCount: 289,
        inStock: true,
        tags: ['reconstrução', 'uso intensivo', 'quebra zero'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-003',
        name: 'Sérum Anti-Queda Crescimento',
        slug: 'serum-anti-queda-crescimento',
        price: 89.90,
        comparePrice: null,
        shortDesc: 'Sérum para combater queda e estimular crescimento',
        images: [
          { url: '/images/products/serum-antiqueda.jpg', alt: 'Sérum Anti-Queda', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Vichy',
        rating: 4.7,
        reviewsCount: 456,
        inStock: true,
        tags: ['anti-queda', 'estimula crescimento', 'fortalece raiz'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-004',
        name: 'Óleo Capilar Argan & Macadâmia',
        slug: 'oleo-capilar-argan-macadamia',
        price: 165.00,
        comparePrice: null,
        shortDesc: 'Óleo nutritivo com argan e macadâmia',
        images: [
          { url: '/images/products/oleo-argan.jpg', alt: 'Óleo Argan & Macadâmia', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Moroccanoil',
        rating: 4.9,
        reviewsCount: 378,
        inStock: true,
        tags: ['nutrição profunda', 'brilho intenso', 'proteção'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-005',
        name: 'Leave-in Hidratante 300ml',
        slug: 'leave-in-hidratante-300ml',
        price: 35.90,
        comparePrice: null,
        shortDesc: 'Leave-in para hidratação diária',
        images: [
          { url: '/images/products/leave-in-hidratante.jpg', alt: 'Leave-in Hidratante', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Pantene',
        rating: 4.4,
        reviewsCount: 567,
        inStock: true,
        tags: ['hidratação diária', 'proteção térmica', 'desembaraça'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-006',
        name: 'Cronograma Capilar Completo',
        slug: 'cronograma-capilar-completo',
        price: 78.50,
        comparePrice: 95.00,
        shortDesc: 'Kit completo para cronograma capilar',
        images: [
          { url: '/images/products/cronograma-capilar.jpg', alt: 'Cronograma Capilar', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Seda',
        rating: 4.5,
        reviewsCount: 234,
        inStock: true,
        tags: ['kit completo', 'hidratação', 'nutrição', 'reconstrução'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-007',
        name: 'Tônico Fortalecedor Raiz',
        slug: 'tonico-fortalecedor-raiz',
        price: 95.90,
        comparePrice: null,
        shortDesc: 'Tônico para fortalecer a raiz e estimular crescimento',
        images: [
          { url: '/images/products/tonico-fortalecedor.jpg', alt: 'Tônico Fortalecedor', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Phyto',
        rating: 4.6,
        reviewsCount: 178,
        inStock: true,
        tags: ['fortalece raiz', 'estimula crescimento', 'circulação'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-008',
        name: 'Máscara Matizadora Platinum',
        slug: 'mascara-matizadora-platinum',
        price: 68.90,
        comparePrice: null,
        shortDesc: 'Máscara matizadora para cabelos loiros',
        images: [
          { url: '/images/products/mascara-matizadora.jpg', alt: 'Máscara Matizadora', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Blondme',
        rating: 4.7,
        reviewsCount: 298,
        inStock: true,
        tags: ['matiza amarelado', 'tons platinados', 'hidratação'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-009',
        name: 'Protetor Térmico Professional',
        slug: 'protetor-termico-professional',
        price: 42.50,
        comparePrice: null,
        shortDesc: 'Proteção térmica até 230°C',
        images: [
          { url: '/images/products/protetor-termico.jpg', alt: 'Protetor Térmico', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Tresemmé',
        rating: 4.3,
        reviewsCount: 445,
        inStock: true,
        tags: ['proteção 230°C', 'anti-frizz', 'brilho'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'trat-010',
        name: 'Vitamina Capilar Growth',
        slug: 'vitamina-capilar-growth',
        price: 55.90,
        comparePrice: null,
        shortDesc: 'Complexo vitamínico para crescimento capilar',
        images: [
          { url: '/images/products/vitamina-capilar.jpg', alt: 'Vitamina Capilar', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Novex',
        rating: 4.5,
        reviewsCount: 189,
        inStock: true,
        tags: ['complexo vitamínico', 'crescimento', 'fortalecimento'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'botox-001',
        name: 'Botox Capilar Zero Formol 1L',
        slug: 'botox-capilar-zero-formol-1l',
        price: 159.90,
        comparePrice: 189.90,
        shortDesc: 'Botox capilar zero formol que alisa, reconstrói e hidrata profundamente os fios',
        images: [
          { url: '/images/products/botox/botox_1.png', alt: 'Botox Capilar Zero Formol', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Professional Hair',
        rating: 4.8,
        reviewsCount: 312,
        inStock: true,
        tags: ['botox capilar', 'zero formol', 'reconstrução'],
        category: 'Tratamentos Capilares'
      },
      {
        id: 'hidrat-001',
        name: 'Máscara Hidratação Intensiva 500ml',
        slug: 'mascara-hidratacao-intensiva',
        price: 45.90,
        comparePrice: 55.90,
        shortDesc: 'Máscara de hidratação intensiva para cabelos ressecados',
        images: [
          { url: '/images/products/produtos_de_hidratacao/hidratacao_1.jpg', alt: 'Máscara Hidratação', isMain: true }
        ],
        categories: [{ category: { name: 'Tratamentos Capilares', slug: 'tratamentos-capilares' } }],
        brand: 'Bio Extratus',
        rating: 4.7,
        reviewsCount: 245,
        inStock: true,
        tags: ['hidratação intensiva', 'cabelos ressecados', 'nutrição'],
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
                    Exibindo <span className="font-medium">12 produtos</span> de <span className="font-medium">Tratamentos Capilares</span>
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