'use client';

import React, { useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import AdvancedProductCard from '@/components/catalog/AdvancedProductCard';
import QuickViewModal from '@/components/catalog/QuickViewModal';
import ReviewSystem from '@/components/catalog/ReviewSystem';
import EnhancedCartDrawer from '@/components/cart/EnhancedCartDrawer';
import { useEnhancedCartStore } from '@/lib/stores/enhancedCartStore';
import productsData from '@/lib/data/products-complete.json';

// Convert JSON data to component props format
const convertProductData = (product: any) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  brand: product.brand,
  shortDesc: product.shortDesc,
  description: product.description,
  price: product.price,
  comparePrice: product.comparePrice,
  sku: product.sku,
  category: product.category,
  subcategory: product.subcategory,
  tags: product.tags,
  rating: product.rating,
  reviewsCount: product.reviewsCount,
  inStock: product.inStock,
  stockQuantity: product.stockQuantity,
  weight: product.weight,
  labels: product.labels,
  images: product.images,
  variants: product.variants
});

// Sample reviews data
const sampleReviews = [
  {
    id: '1',
    userName: 'Maria Silva',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    title: 'Produto excelente!',
    comment: 'Superou minhas expectativas. A qualidade é realmente profissional e o resultado durou muito mais tempo do que esperava. Recomendo para quem busca qualidade.',
    date: '2024-01-15',
    verified: true,
    helpful: 12,
    notHelpful: 1,
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop',
        alt: 'Resultado do produto'
      }
    ]
  },
  {
    id: '2',
    userName: 'Ana Costa',
    rating: 4,
    title: 'Muito bom custo-benefício',
    comment: 'Produto de qualidade, chegou rápido e bem embalado. O único ponto é que o cheiro poderia ser mais suave, mas o resultado é ótimo.',
    date: '2024-01-10',
    verified: true,
    helpful: 8,
    notHelpful: 0
  },
  {
    id: '3',
    userName: 'Juliana Santos',
    rating: 5,
    title: 'Já é o terceiro que compro!',
    comment: 'Cliente fiel deste produto. Sempre funciona perfeitamente e o preço é justo. A entrega é sempre rápida também.',
    date: '2024-01-08',
    verified: false,
    helpful: 6,
    notHelpful: 0
  }
];

const reviewSummary = {
  totalReviews: 45,
  averageRating: 4.7,
  ratingDistribution: {
    5: 28,
    4: 12,
    3: 3,
    2: 1,
    1: 1
  }
};

export default function CatalogDemoPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const { addItem, openCart } = useEnhancedCartStore();

  // Get all products from all categories
  const allProducts = productsData.categories.flatMap(category => 
    category.products.map(product => ({
      ...convertProductData(product),
      categorySlug: category.slug
    }))
  );

  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.categorySlug === selectedCategory);

  const handleAddToCart = (productId: string, quantity: number, variant?: any) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        price: variant?.price || product.price,
        comparePrice: product.comparePrice,
        image: product.images[0]?.url || '/placeholder-product.jpg',
        quantity,
        variant,
        maxQuantity: product.stockQuantity,
        weight: product.weight,
        category: product.category
      });
      openCart();
    }
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuickView = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Catálogo Completo - Demo
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Reviews Toggle */}
              <button
                onClick={() => setShowReviews(!showReviews)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showReviews 
                    ? 'bg-amber-100 border-amber-300 text-amber-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {showReviews ? 'Ocultar' : 'Ver'} Avaliações
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({allProducts.length})
            </button>
            {productsData.categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon} {category.name} ({category.products.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Reviews Section */}
        {showReviews && (
          <div className="mb-8">
            <ReviewSystem
              productId="demo-product"
              reviews={sampleReviews}
              summary={reviewSummary}
              onSubmitReview={(review) => console.log('Nova avaliação:', review)}
              onVoteReview={(reviewId, vote) => console.log('Voto:', reviewId, vote)}
              allowReviews={true}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="space-y-6">
          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option>Relevância</option>
              <option>Menor preço</option>
              <option>Maior preço</option>
              <option>Mais vendidos</option>
              <option>Melhor avaliados</option>
              <option>Lançamentos</option>
            </select>
          </div>

          {/* Products Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <AdvancedProductCard
                  key={product.id}
                  {...product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={handleQuickView}
                  isInWishlist={wishlist.includes(product.id)}
                  viewMode="grid"
                  showQuickActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducts.map(product => (
                <AdvancedProductCard
                  key={product.id}
                  {...product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={handleQuickView}
                  isInWishlist={wishlist.includes(product.id)}
                  viewMode="list"
                  showQuickActions={true}
                />
              ))}
            </div>
          )}

          {/* No products found */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                <Search className="w-full h-full" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Tente selecionar uma categoria diferente
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ver Todos os Produtos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isInWishlist={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
      />

      {/* Enhanced Cart Drawer */}
      <EnhancedCartDrawer
        onGoToCheckout={() => console.log('Ir para checkout')}
      />

      {/* Demo Info Banner */}
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm z-40">
        <h4 className="font-semibold mb-2">🎯 Demonstração Completa</h4>
        <p className="text-sm mb-3">
          Esta página demonstra todos os 42 produtos com funcionalidades completas:
        </p>
        <ul className="text-xs space-y-1">
          <li>✅ Cards responsivos com quick view</li>
          <li>✅ Sistema de avaliações</li>
          <li>✅ Carrinho avançado</li>
          <li>✅ Wishlist funcional</li>
          <li>✅ Labels dinâmicas</li>
          <li>✅ Filtros por categoria</li>
        </ul>
      </div>
    </div>
  );
}