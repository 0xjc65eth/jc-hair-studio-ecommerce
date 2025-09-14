import { Suspense } from 'react';
import { Metadata } from 'next';
import { Search, Filter, ArrowUp, ArrowDown, Grid, List, Zap, Shield, Award, Flame } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/ui/FilterSidebar';

export const metadata: Metadata = {
  title: 'Ferramentas Profissionais - Equipamentos para Salão',
  description: 'Ferramentas profissionais para cabeleireiros: secadores, chapinhas, babyliss, escovas e acessórios de alta qualidade para salões de beleza.',
  keywords: ['ferramentas profissionais', 'secador', 'chapinha', 'babyliss', 'escova', 'equipamentos salão'],
  openGraph: {
    title: 'Ferramentas Profissionais - JC Hair Studio\'s 62',
    description: 'Equipamentos e ferramentas profissionais de alta qualidade para cabeleireiros e salões de beleza.',
    images: ['/og-ferramentas.jpg'],
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

async function getProducts(category = 'ferramentas-profissionais'): Promise<Product[]> {
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
        name: 'Secador Profissional Íons 2000W',
        slug: 'secador-profissional-ions-2000w',
        price: 189.90,
        comparePrice: 229.90,
        shortDesc: 'Secador profissional com tecnologia íons negativos e 2000W de potência',
        images: [
          { url: '/products/secador-ions.jpg', alt: 'Secador Íons 2000W', isMain: true }
        ],
        categories: [{ category: { name: 'Ferramentas Profissionais', slug: 'ferramentas-profissionais' } }],
        brand: 'ProHair',
        rating: 4.9,
        reviewsCount: 156,
        inStock: true,
        tags: ['secador', 'profissional', '2000W', 'íons'],
        category: 'Ferramentas Profissionais'
      },
      {
        id: '2',
        name: 'Chapinha Titanium Pro 230°C',
        slug: 'chapinha-titanium-pro-230c',
        price: 159.90,
        comparePrice: 199.90,
        shortDesc: 'Chapinha profissional com placas de titanium e controle de temperatura',
        images: [
          { url: '/products/chapinha-titanium.jpg', alt: 'Chapinha Titanium Pro', isMain: true }
        ],
        categories: [{ category: { name: 'Ferramentas Profissionais', slug: 'ferramentas-profissionais' } }],
        brand: 'TitaniumPro',
        rating: 4.8,
        reviewsCount: 234,
        inStock: true,
        tags: ['chapinha', 'titanium', '230°C', 'profissional'],
        category: 'Ferramentas Profissionais'
      },
      {
        id: '3',
        name: 'Babyliss Automático Cerâmica',
        slug: 'babyliss-automatico-ceramica',
        price: 89.90,
        comparePrice: null,
        shortDesc: 'Babyliss automático com barril de cerâmica para cachos perfeitos',
        images: [
          { url: '/products/babyliss-ceramica.jpg', alt: 'Babyliss Cerâmica', isMain: true }
        ],
        categories: [{ category: { name: 'Ferramentas Profissionais', slug: 'ferramentas-profissionais' } }],
        brand: 'CurlPro',
        rating: 4.7,
        reviewsCount: 189,
        inStock: true,
        tags: ['babyliss', 'automático', 'cerâmica', 'cachos'],
        category: 'Ferramentas Profissionais'
      },
      {
        id: '4',
        name: 'Kit Escovas Térmicas Profissionais',
        slug: 'kit-escovas-termicas-profissionais',
        price: 79.90,
        comparePrice: 99.90,
        shortDesc: 'Kit com 5 escovas térmicas de diferentes tamanhos para modelagem',
        images: [
          { url: '/products/kit-escovas.jpg', alt: 'Kit Escovas Térmicas', isMain: true }
        ],
        categories: [{ category: { name: 'Ferramentas Profissionais', slug: 'ferramentas-profissionais' } }],
        brand: 'BrushPro',
        rating: 4.6,
        reviewsCount: 124,
        inStock: true,
        tags: ['escovas', 'térmicas', 'kit', 'modelagem'],
        category: 'Ferramentas Profissionais'
      },
      {
        id: '5',
        name: 'Modelador 3 em 1 Multifuncional',
        slug: 'modelador-3em1-multifuncional',
        price: 129.90,
        comparePrice: 149.90,
        shortDesc: 'Modelador multifuncional: chapinha, babyliss e escova em um só aparelho',
        images: [
          { url: '/products/modelador-3em1.jpg', alt: 'Modelador 3 em 1', isMain: true }
        ],
        categories: [{ category: { name: 'Ferramentas Profissionais', slug: 'ferramentas-profissionais' } }],
        brand: 'MultiStyle',
        rating: 4.5,
        reviewsCount: 98,
        inStock: true,
        tags: ['modelador', '3 em 1', 'multifuncional', 'versátil'],
        category: 'Ferramentas Profissionais'
      }
    ];
  }
}

const categoryFilters = [
  {
    id: 'price',
    label: 'Preço',
    type: 'range' as const,
    range: { min: 0, max: 300 },
    icon: <ArrowUp className="w-4 h-4" />,
  },
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox' as const,
    options: [
      { id: 'prohair', label: 'ProHair', count: 8 },
      { id: 'titaniumpro', label: 'TitaniumPro', count: 12 },
      { id: 'curlpro', label: 'CurlPro', count: 6 },
      { id: 'brushpro', label: 'BrushPro', count: 9 },
      { id: 'multistyle', label: 'MultiStyle', count: 4 },
      { id: 'babyliss', label: 'BaByliss', count: 15 },
      { id: 'philips', label: 'Philips', count: 7 },
    ],
  },
  {
    id: 'tool-type',
    label: 'Tipo de Ferramenta',
    type: 'checkbox' as const,
    icon: <Zap className="w-4 h-4" />,
    options: [
      { id: 'secador', label: 'Secador de Cabelo', count: 12 },
      { id: 'chapinha', label: 'Chapinha/Prancha', count: 15 },
      { id: 'babyliss', label: 'Babyliss/Modelador', count: 18 },
      { id: 'escova-termica', label: 'Escova Térmica', count: 8 },
      { id: 'diffusor', label: 'Difusor', count: 6 },
      { id: 'acessorios', label: 'Acessórios', count: 10 },
    ],
  },
  {
    id: 'power',
    label: 'Potência',
    type: 'checkbox' as const,
    icon: <Flame className="w-4 h-4" />,
    options: [
      { id: '1000w-1500w', label: '1000W - 1500W', count: 8 },
      { id: '1500w-2000w', label: '1500W - 2000W', count: 15 },
      { id: '2000w-plus', label: '2000W+', count: 12 },
    ],
  },
  {
    id: 'technology',
    label: 'Tecnologia',
    type: 'checkbox' as const,
    icon: <Award className="w-4 h-4" />,
    options: [
      { id: 'ions-negativos', label: 'Íons Negativos', count: 18 },
      { id: 'ceramica', label: 'Cerâmica', count: 22 },
      { id: 'titanium', label: 'Titanium', count: 15 },
      { id: 'turmalina', label: 'Turmalina', count: 12 },
      { id: 'infravermelho', label: 'Infravermelho', count: 8 },
      { id: 'temperatura-variavel', label: 'Temperatura Variável', count: 25 },
    ],
  },
  {
    id: 'professional-level',
    label: 'Nível Profissional',
    type: 'checkbox' as const,
    icon: <Shield className="w-4 h-4" />,
    options: [
      { id: 'uso-domestico', label: 'Uso Doméstico', count: 15 },
      { id: 'semi-profissional', label: 'Semi-Profissional', count: 18 },
      { id: 'profissional-salao', label: 'Profissional para Salão', count: 22 },
    ],
  },
  {
    id: 'voltage',
    label: 'Voltagem',
    type: 'checkbox' as const,
    options: [
      { id: '110v', label: '110V', count: 28 },
      { id: '220v', label: '220V', count: 25 },
      { id: 'bivolt', label: 'Bivolt (110V/220V)', count: 18 },
    ],
  },
];

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
          <Zap className="w-full h-full" />
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
            compareAtPrice: product.comparePrice || undefined
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

export default function FerramentasProfissionaisPage() {
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
              <li className="text-gray-900 font-medium">Ferramentas Profissionais</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ferramentas <span className="text-yellow-400">Profissionais</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Equipamentos e ferramentas de alta qualidade para cabeleireiros profissionais. 
              Secadores, chapinhas, modeladores e acessórios para resultados perfeitos.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Alta Potência
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Durabilidade Premium
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Award className="w-4 h-4" />
                Tecnologia Avançada
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secadores</h3>
              <p className="text-sm text-gray-600">
                Alta potência com tecnologia íons e cerâmica
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Chapinhas</h3>
              <p className="text-sm text-gray-600">
                Placas de titanium e cerâmica para alisamento perfeito
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Modeladores</h3>
              <p className="text-sm text-gray-600">
                Babyliss e modeladores para cachos e ondas
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Escovas</h3>
              <p className="text-sm text-gray-600">
                Escovas térmicas e acessórios para modelagem
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
              <FilterSidebar filters={categoryFilters} />
            </div>
          </aside>

          {/* Products Area */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Exibindo produtos de <span className="font-medium">Ferramentas Profissionais</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort Options */}
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option>Relevância</option>
                    <option>Menor Preço</option>
                    <option>Maior Preço</option>
                    <option>Mais Vendidos</option>
                    <option>Melhor Avaliados</option>
                    <option>Lançamentos</option>
                  </select>
                  
                  {/* View Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button className="p-2 bg-yellow-600 text-white">
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

      {/* Professional Tips Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-t border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dicas de Uso Profissional
            </h2>
            <p className="text-lg text-gray-600">
              Maximize o potencial das suas ferramentas com nossas dicas especializadas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-3">Proteção Térmica</h3>
              <p className="text-gray-600 text-sm text-center">
                Sempre use protetor térmico antes de usar ferramentas de calor. 
                Protege os fios e prolonga a vida útil dos equipamentos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-3">Temperatura Ideal</h3>
              <p className="text-gray-600 text-sm text-center">
                Cabelos finos: 150-180°C. Cabelos médios: 180-200°C. 
                Cabelos grossos: 200-230°C. Ajuste conforme a necessidade.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-3">Manutenção</h3>
              <p className="text-gray-600 text-sm text-center">
                Limpe as placas regularmente com álcool isopropílico. 
                Guarde em local seco e use as capas protetoras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}