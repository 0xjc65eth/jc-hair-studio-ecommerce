import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Star, CheckCircle, ShoppingCart, Palette, Eye, Droplet, Brush, Sparkles, Heart, Filter, Search } from 'lucide-react';
import { ProductService } from '../../lib/services/productService';
import ProductGrid from '@/components/category/ProductGrid';
import ProductCard from '@/components/products/ProductCard';

export const metadata: Metadata = {
  title: 'Cosméticos - Maquiagem e Produtos de Beleza Premium',
  description: 'Produtos cosméticos premium: maquiagem profissional, paletas de sombras, bases, esmaltes e acessórios de beleza. Marcas brasileiras e internacionais.',
  keywords: ['cosméticos', 'maquiagem', 'base', 'paleta sombras', 'esmaltes', 'beleza', 'boca rosa', 'vult', 'make b'],
  openGraph: {
    title: 'Cosméticos Premium - JC Hair Studio\'s 62',
    description: 'Descubra nossa linha completa de produtos cosméticos premium para realçar sua beleza natural',
    images: ['/og-cosmeticos.jpg'],
  },
};

// Fetch cosmetics products
async function getCosmeticsProducts() {
  try {
    const result = await ProductService.getProductsByCategory('cosmeticos', 24);
    return result;
  } catch (error) {
    console.error('Error fetching cosmetics products:', error);
    return [];
  }
}

// Fetch featured cosmetics
async function getFeaturedCosmetics() {
  try {
    const allProducts = await ProductService.getProductsByCategory('cosmeticos', 50);
    return allProducts.filter(product => product.isFeatured).slice(0, 6);
  } catch (error) {
    console.error('Error fetching featured cosmetics:', error);
    return [];
  }
}

// Get products by brand
async function getProductsByBrand(brand: string) {
  try {
    const products = await ProductService.getProductsByBrand(brand, 8);
    return products.filter(product =>
      product.categories.some(cat => cat.category.slug === 'cosmeticos')
    );
  } catch (error) {
    console.error(`Error fetching products for brand ${brand}:`, error);
    return [];
  }
}

const cosmeticsCategories = [
  {
    id: 'maquiagem-rosto',
    name: 'Maquiagem para Rosto',
    icon: <Palette className="w-6 h-6" />,
    description: 'Bases, corretivos e pós para uma pele perfeita',
    subcategories: ['Bases Líquidas', 'Corretivos', 'Pós Compactos', 'Primers', 'Sticks Multifuncionais'],
    color: 'from-rose-100 to-pink-100',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    tags: ['base', 'corretivo', 'po', 'primer']
  },
  {
    id: 'maquiagem-olhos',
    name: 'Maquiagem para Olhos',
    icon: <Eye className="w-6 h-6" />,
    description: 'Paletas de sombras e produtos para olhos marcantes',
    subcategories: ['Paletas de Sombras', 'Sombras Individuais', 'Delineadores', 'Máscaras para Cílios'],
    color: 'from-purple-100 to-indigo-100',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    tags: ['paleta', 'sombra', 'delineador', 'mascara']
  },
  {
    id: 'maquiagem-labios',
    name: 'Maquiagem para Lábios',
    icon: <Droplet className="w-6 h-6" />,
    description: 'Batons, glosses e produtos labiais',
    subcategories: ['Batons Matte', 'Batons Cremosos', 'Gloss Labial', 'Lápis de Boca'],
    color: 'from-red-100 to-rose-100',
    borderColor: 'border-red-200',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    tags: ['batom', 'gloss', 'lapis-boca']
  },
  {
    id: 'esmaltes-unhas',
    name: 'Esmaltes e Unhas',
    icon: <Sparkles className="w-6 h-6" />,
    description: 'Esmaltes, base coat, top coat e nail art',
    subcategories: ['Esmaltes Cremosos', 'Esmaltes Cintilantes', 'Base e Top Coat', 'Kit Nail Art'],
    color: 'from-emerald-100 to-teal-100',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    tags: ['esmalte', 'nail-art', 'base-coat', 'top-coat']
  },
  {
    id: 'pinceis-acessorios',
    name: 'Pincéis e Acessórios',
    icon: <Brush className="w-6 h-6" />,
    description: 'Ferramentas profissionais para aplicação perfeita',
    subcategories: ['Kits de Pincéis', 'Pincéis Individuais', 'Esponjas', 'Acessórios'],
    color: 'from-gray-100 to-slate-100',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    tags: ['pincel', 'kit', 'acessorio', 'esponja']
  },
  {
    id: 'blushes-contorno',
    name: 'Blushes e Contorno',
    icon: <Heart className="w-6 h-6" />,
    description: 'Blushes, bronzeadores e produtos de contorno',
    subcategories: ['Blushes em Pó', 'Blushes Cremosos', 'Bronzeadores', 'Iluminadores'],
    color: 'from-orange-100 to-amber-100',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    tags: ['blush', 'bronzeador', 'contorno', 'iluminador']
  }
];

// Category component for displaying product categories
function CategorySection({ category, products }: { category: typeof cosmeticsCategories[0], products: any[] }) {
  // Filter products that match this category based on tags or product type
  const categoryProducts = products.filter(product => {
    const productTags = product.tags?.map((tag: any) => tag.tag?.slug || tag.slug || tag).join(' ').toLowerCase() || '';
    const productName = product.name.toLowerCase();
    const productDescription = product.description?.toLowerCase() || '';

    return category.tags.some(tag =>
      productTags.includes(tag) ||
      productName.includes(tag) ||
      productDescription.includes(tag)
    );
  }).slice(0, 4);

  if (categoryProducts.length === 0) return null;

  return (
    <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 border ${category.borderColor}`}>
      <div className="flex items-center mb-6">
        <div className={`p-4 bg-white rounded-xl ${category.textColor} mr-6 shadow-sm`}>
          {category.icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
          <p className="text-gray-600 mt-1">{category.description}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Categorias:</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {category.subcategories.map((sub, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-gray-700 shadow-sm">
              {sub}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Produtos em Destaque:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryProducts.map((product) => {
            const mainImage = product.images?.find((img: any) => img.isMain) || product.images?.[0];
            return (
              <div key={product.id} className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  {mainImage && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={mainImage.url}
                        alt={mainImage.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produto/${product.slug}`}
                      className="block hover:text-blue-600 transition-colors"
                    >
                      <h5 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h5>
                    </Link>
                    <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">€{Number(product.price).toFixed(2)}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-500 line-through">€{Number(product.comparePrice).toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.averageRating > 0 ? product.averageRating.toFixed(1) : '4.5'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/50">
        <Link
          href={`/categoria/cosmeticos?category=${category.id}`}
          className={`block text-center py-4 px-6 bg-white ${category.textColor} rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md`}
        >
          Ver Todos os Produtos de {category.name}
        </Link>
      </div>
    </div>
  );
}

// Featured brands component
async function FeaturedBrandsSection() {
  const brands = [
    { name: 'Vult', slug: 'vult', description: 'Maquiagem profissional brasileira' },
    { name: 'O Boticário Make B', slug: 'O Boticário Make B', description: 'Cosméticos premium' },
    { name: 'Boca Rosa Beauty', slug: 'Boca Rosa Beauty', description: 'Tendências e inovação' },
    { name: 'Florenza', slug: 'florenza', description: 'Beleza acessível' }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Marcas Premium Brasileiras
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            As melhores marcas de cosméticos do Brasil, agora disponíveis na Europa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marca/${encodeURIComponent(brand.slug)}`}
              className="group text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-rose-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-rose-200 group-hover:to-pink-200 transition-all duration-300">
                <span className="text-rose-600 font-bold text-lg">
                  {brand.name.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
                {brand.name}
              </h3>
              <p className="text-sm text-gray-600">
                {brand.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function CosmeticsPage() {
  const [cosmeticsProducts, featuredProducts] = await Promise.all([
    getCosmeticsProducts(),
    getFeaturedCosmetics()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-rose-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Cosméticos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600">
                Premium
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-4xl mx-auto">
              Descubra nossa coleção completa de produtos cosméticos premium.
              Maquiagem profissional, esmaltes exclusivos e acessórios de beleza das melhores marcas brasileiras.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-rose-200/50 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Produtos Disponíveis</div>
                <div className="text-3xl font-bold text-gray-900">{cosmeticsProducts.length}+</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-pink-200/50 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Marcas Brasileiras</div>
                <div className="text-3xl font-bold text-gray-900">15+</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-purple-200/50 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Satisfação</div>
                <div className="text-3xl font-bold text-gray-900">98%</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="#categorias"
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explorar Categorias
              </Link>
              <Link
                href="#produtos"
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-10 py-4 rounded-xl font-semibold border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Quick Preview */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Produtos em Destaque</h2>
              <p className="text-xl text-gray-600">Os mais populares da nossa coleção</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section id="categorias" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore por Categoria
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Encontre os produtos perfeitos para cada necessidade.
              Qualidade profissional e resultados excepcionais.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {cosmeticsCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                products={cosmeticsProducts}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      {cosmeticsProducts.length > 0 && (
        <section id="produtos" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Todos os Produtos Cosméticos
              </h2>
              <p className="text-xl text-gray-600">
                Navegue por nossa coleção completa
              </p>
            </div>

            <Suspense fallback={<div className="text-center py-12">Carregando produtos...</div>}>
              <ProductGrid products={cosmeticsProducts} />
            </Suspense>

            <div className="text-center mt-12">
              <Link
                href="/categoria/cosmeticos"
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Todos os Cosméticos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Brands */}
      <Suspense fallback={<div className="py-20 bg-gray-100">Carregando marcas...</div>}>
        <FeaturedBrandsSection />
      </Suspense>

      {/* Beauty Tips Section */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Dicas de Beleza Premium
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Aprenda com os profissionais e descubra os segredos da maquiagem perfeita
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                <Palette className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Base Perfeita</h3>
              <p className="text-gray-300 leading-relaxed">
                Use primer antes da base para maior durabilidade. Aplique em movimentos para cima e esfume bem nas bordas.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Eye className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Olhos Marcantes</h3>
              <p className="text-gray-300 leading-relaxed">
                Use primer para sombras para fixação. Comece com cores claras e vá intensificando gradualmente.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center">
                <Droplet className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lábios Duradouros</h3>
              <p className="text-gray-300 leading-relaxed">
                Hidrate os lábios antes da aplicação. Use lápis de boca para maior precisão e durabilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-rose-50 to-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Complete Seu Kit de Beleza
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Descubra produtos capilares premium para complementar sua rotina de beleza.
            Da raiz às pontas, tudo o que você precisa para ficar deslumbrante.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/produtos"
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ver Produtos Capilares
            </Link>
            <Link
              href="/ferramentas-profissionais"
              className="bg-white text-gray-900 px-10 py-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
            >
              Ferramentas Profissionais
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}