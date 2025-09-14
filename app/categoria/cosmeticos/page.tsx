import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Filter, SortAsc, Search, Sparkles, Palette, Eye, Droplet, Brush, Heart } from 'lucide-react';
import { ProductService } from '../../../lib/services/productService';
import ProductGrid from '../../../components/category/ProductGrid';
import ProductCard from '../../../components/products/ProductCard';

interface CosmeticsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    price_min?: string;
    price_max?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Categoria Cosméticos - Maquiagem e Produtos de Beleza Premium',
  description: 'Explore nossa categoria completa de cosméticos: maquiagem, esmaltes, pincéis e acessórios de beleza das melhores marcas brasileiras.',
  keywords: ['cosméticos categoria', 'maquiagem', 'esmaltes', 'beleza', 'categoria produtos'],
  openGraph: {
    title: 'Categoria Cosméticos - JC Hair Studio\'s 62',
    description: 'Explore nossa categoria completa de cosméticos premium',
    images: ['/og-categoria-cosmeticos.jpg'],
  },
};

async function getCosmeticsProducts(filters?: any) {
  try {
    const products = await ProductService.getProductsByCategory('cosmeticos', 50);
    return products;
  } catch (error) {
    console.error('Error fetching cosmetics products:', error);
    return [];
  }
}

const categoryFilters = [
  {
    id: 'maquiagem-rosto',
    name: 'Maquiagem para Rosto',
    icon: <Palette className="w-5 h-5" />,
    description: 'Bases, corretivos, pós e primers',
    tags: ['base', 'corretivo', 'po', 'primer'],
    color: 'bg-rose-50 border-rose-200 hover:bg-rose-100'
  },
  {
    id: 'maquiagem-olhos',
    name: 'Maquiagem para Olhos',
    icon: <Eye className="w-5 h-5" />,
    description: 'Paletas, sombras e delineadores',
    tags: ['paleta', 'sombra', 'delineador', 'mascara'],
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  {
    id: 'maquiagem-labios',
    name: 'Maquiagem para Lábios',
    icon: <Droplet className="w-5 h-5" />,
    description: 'Batons, glosses e lápis labiais',
    tags: ['batom', 'gloss', 'lapis-boca', 'labial'],
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  },
  {
    id: 'esmaltes-unhas',
    name: 'Esmaltes & Unhas',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Esmaltes, base coat e nail art',
    tags: ['esmalte', 'nail-art', 'base-coat', 'top-coat'],
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
  },
  {
    id: 'pinceis-acessorios',
    name: 'Pincéis & Acessórios',
    icon: <Brush className="w-5 h-5" />,
    description: 'Ferramentas de aplicação',
    tags: ['pincel', 'kit', 'acessorio', 'esponja'],
    color: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
  },
  {
    id: 'blushes-contorno',
    name: 'Blushes & Contorno',
    icon: <Heart className="w-5 h-5" />,
    description: 'Blushes, bronzeadores e iluminadores',
    tags: ['blush', 'bronzeador', 'contorno', 'iluminador'],
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
  }
];

function CategoryFilter({ category, isActive, onClick }: {
  category: typeof categoryFilters[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
        ${isActive
          ? `${category.color} border-opacity-100 shadow-md`
          : `${category.color} border-opacity-50 hover:border-opacity-75`
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white shadow-sm ${
          isActive ? 'text-gray-700' : 'text-gray-500'
        }`}>
          {category.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
        </div>
      </div>
    </button>
  );
}

function FilterProducts({ products, category }: { products: any[]; category?: string }) {
  if (!category || category === 'todos') return products;

  const selectedCategory = categoryFilters.find(cat => cat.id === category);
  if (!selectedCategory) return products;

  return products.filter(product => {
    const productTags = product.tags?.map((tag: any) =>
      tag.tag?.slug || tag.slug || tag
    ).join(' ').toLowerCase() || '';
    const productName = product.name.toLowerCase();
    const productDescription = product.description?.toLowerCase() || '';

    return selectedCategory.tags.some(tag =>
      productTags.includes(tag) ||
      productName.includes(tag) ||
      productDescription.includes(tag)
    );
  });
}

export default async function CosmeticsCategoryPage({ searchParams }: CosmeticsPageProps) {
  const resolvedSearchParams = await searchParams;
  const allProducts = await getCosmeticsProducts();
  const selectedCategory = resolvedSearchParams.category || 'todos';
  const filteredProducts = FilterProducts(allProducts, selectedCategory);

  const activeCategoryData = categoryFilters.find(cat => cat.id === selectedCategory);
  const pageTitle = activeCategoryData
    ? activeCategoryData.name
    : 'Todos os Cosméticos';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {pageTitle}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {activeCategoryData
                ? `Explore nossa seleção de ${activeCategoryData.description.toLowerCase()}`
                : 'Descubra nossa coleção completa de produtos cosméticos premium'
              }
            </p>

            {/* Breadcrumb */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700 transition-colors">Início</Link>
              <span>/</span>
              <Link href="/cosmeticos" className="hover:text-gray-700 transition-colors">Cosméticos</Link>
              {activeCategoryData && (
                <>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{activeCategoryData.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtrar por Categoria
              </h2>

              <div className="space-y-3">
                <CategoryFilter
                  category={{
                    id: 'todos',
                    name: 'Todos os Cosméticos',
                    icon: <Sparkles className="w-5 h-5" />,
                    description: 'Ver todos os produtos',
                    tags: [],
                    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }}
                  isActive={selectedCategory === 'todos'}
                  onClick={() => window.location.href = '/categoria/cosmeticos'}
                />

                {categoryFilters.map((category) => (
                  <CategoryFilter
                    key={category.id}
                    category={category}
                    isActive={selectedCategory === category.id}
                    onClick={() => window.location.href = `/categoria/cosmeticos?category=${category.id}`}
                  />
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                <h3 className="font-semibold text-gray-900 mb-2">Resultados</h3>
                <p className="text-2xl font-bold text-rose-600">{filteredProducts.length}</p>
                <p className="text-sm text-gray-600">produtos encontrados</p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {pageTitle} ({filteredProducts.length} produtos)
              </h2>

              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <option value="newest">Mais Recentes</option>
                <option value="price-low-high">Preço: Menor para Maior</option>
                <option value="price-high-low">Preço: Maior para Menor</option>
                <option value="name-asc">Nome A-Z</option>
                <option value="featured">Produtos em Destaque</option>
              </select>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              }>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </Suspense>
            ) : (
              <div className="text-center py-16">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Não encontramos produtos nesta categoria. Que tal explorar outras opções?
                </p>
                <Link
                  href="/cosmeticos"
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300"
                >
                  Ver Todos os Cosméticos
                </Link>
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > 12 && (
              <div className="text-center mt-12">
                <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Carregar Mais Produtos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-xl mb-8 text-rose-100">
            Explore nossa coleção completa ou entre em contato conosco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cosmeticos"
              className="bg-white text-rose-600 px-8 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors"
            >
              Ver Todos os Cosméticos
            </Link>
            <Link
              href="/contato"
              className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Falar Conosco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}