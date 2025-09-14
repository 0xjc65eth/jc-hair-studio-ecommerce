'use client';

import { useState } from 'react';
import { Heart, Star, MapPin, Truck, Info, ArrowRight, Sparkles } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge, { StatusBadge } from '../ui/Badge';
import { clsx } from 'clsx';

interface ProductOption {
  id: string;
  name: string;
  color?: string;
  price?: number;
}

interface ShampooMaquiagemProduct {
  id: string;
  name: string;
  brand: string;
  category: 'shampoo' | 'maquiagem';
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  influencerBadge?: string;
  description: string;
  nostalgiaText: string;
  origin: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  lowStock?: boolean;
  options?: ProductOption[];
  highlights: string[];
}

const products: ShampooMaquiagemProduct[] = [
  {
    id: 'natura-ekos-murumuru',
    name: 'Natura Ekos Murumuru Kit',
    brand: 'Natura',
    category: 'shampoo',
    price: 38,
    image: '/images/natura-ekos-murumuru.jpg',
    badge: 'AMAZÔNIA AUTÊNTICA',
    description: 'Kit completo com shampoo e condicionador Murumuru',
    nostalgiaText: 'Amazônia em cada gota - O cheiro que te transporta para casa',
    origin: 'Amazônia, Brasil',
    rating: 4.8,
    reviewsCount: 324,
    inStock: true,
    highlights: ['Óleo de Murumuru', 'Cabelos Secos', 'Fragrância Amazônica', 'Fórmula Vegana'],
  },
  {
    id: 'bio-extratus-jaborandi',
    name: 'Bio Extratus Jaborandi Antiqueda',
    brand: 'Bio Extratus',
    category: 'shampoo',
    price: 18,
    originalPrice: 45,
    image: '/images/bio-extratus-jaborandi.jpg',
    badge: 'SEGREDO INDÍGENA',
    description: 'Shampoo antiqueda com extrato de Jaborandi',
    nostalgiaText: 'Segredo indígena brasileiro - Tradição que funciona de verdade',
    origin: 'Caatinga, Brasil',
    rating: 4.6,
    reviewsCount: 187,
    inStock: true,
    lowStock: true,
    highlights: ['Anti-Queda', 'Jaborandi Natural', 'Crescimento', 'Tradição Brasileira'],
  },
  {
    id: 'boticario-nativa-spa',
    name: 'O Boticário Nativa SPA Matcha',
    brand: 'O Boticário',
    category: 'shampoo',
    price: 32,
    image: '/images/boticario-nativa-spa.jpg',
    badge: 'NOSTALGIA BRASIL',
    description: 'Linha completa Nativa SPA com extrato de Matcha',
    nostalgiaText: 'Cheiro de saudade - Como estar no Boticário da esquina',
    origin: 'São Paulo, Brasil',
    rating: 4.7,
    reviewsCount: 412,
    inStock: true,
    highlights: ['Matcha Verde', 'Hidratação Profunda', 'Relaxamento', 'Aromático'],
  },
  {
    id: 'mari-maria-base',
    name: 'Mari Maria Base Hype Up',
    brand: 'Mari Maria Makeup',
    category: 'maquiagem',
    price: 35,
    image: '/images/mari-maria-base.jpg',
    badge: 'MAKEUP BRASILEIRO',
    influencerBadge: 'MARI MARIA',
    description: 'Base líquida de alta cobertura para todos os tons',
    nostalgiaText: 'Sonho de consumo realizado - A base que toda brasileira quer',
    origin: 'São Paulo, Brasil',
    rating: 4.9,
    reviewsCount: 856,
    inStock: true,
    options: [
      { id: 'tom-01', name: 'Tom 01 - Muito Claro', color: '#F5DEB3' },
      { id: 'tom-02', name: 'Tom 02 - Claro', color: '#DEB887' },
      { id: 'tom-03', name: 'Tom 03 - Médio', color: '#D2B48C' },
      { id: 'tom-04', name: 'Tom 04 - Escuro', color: '#A0522D' },
      { id: 'tom-05', name: 'Tom 05 - Muito Escuro', color: '#8B4513' },
    ],
    highlights: ['Alta Cobertura', 'Longa Duração', '12h de Uso', 'Todos os Tons'],
  },
  {
    id: 'boca-rosa-beauty',
    name: 'Boca Rosa Beauty Stick',
    brand: 'Boca Rosa Beauty',
    category: 'maquiagem',
    price: 28,
    image: '/images/boca-rosa-beauty.jpg',
    badge: 'INFLUENCER BRASIL',
    influencerBadge: '18M SEGUIDORAS',
    description: 'Kit completo de sticks multifuncionais',
    nostalgiaText: 'O poder das brasileiras - Boca Rosa que conquistou o mundo',
    origin: 'São Paulo, Brasil',
    rating: 4.8,
    reviewsCount: 1240,
    inStock: true,
    options: [
      { id: 'coral', name: 'Coral Brasileiro', color: '#FF7F7F' },
      { id: 'vermelho', name: 'Vermelho Paixão', color: '#DC143C' },
      { id: 'nude', name: 'Nude Natural', color: '#DEB887' },
      { id: 'rosa', name: 'Rosa Chique', color: '#FFC0CB' },
    ],
    highlights: ['Multifuncional', 'Cremoso', 'Pigmentado', 'Tendência BR'],
  },
  {
    id: 'vult-makeup-kit',
    name: 'Vult Make Up Kit',
    brand: 'Vult',
    category: 'maquiagem',
    price: 85,
    image: '/images/vult-makeup-kit.jpg',
    badge: 'KIT COMPLETO',
    description: 'Kit profissional completo de maquiagem',
    nostalgiaText: 'Maquiador profissional em casa - Qualidade brasileira reconhecida',
    origin: 'Rio de Janeiro, Brasil',
    rating: 4.7,
    reviewsCount: 523,
    inStock: true,
    highlights: ['Kit Profissional', 'Paleta Completa', 'Pincéis Inclusos', 'Made in Brazil'],
  },
];

interface ProductCardProps {
  product: ShampooMaquiagemProduct;
  onAddToCart: (productId: string, options?: any) => void;
  onQuickView: (productId: string) => void;
}

function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card variant="luxury" className="group relative overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.badge && (
          <Badge variant="default" size="sm" className="bg-green-700 text-white shadow-lg">
            {product.badge}
          </Badge>
        )}
        {product.influencerBadge && (
          <Badge variant="accent" size="sm" className="bg-pink-600 text-white shadow-lg">
            <Sparkles className="w-3 h-3 mr-1" />
            {product.influencerBadge}
          </Badge>
        )}
        {discount > 0 && (
          <Badge variant="danger" size="sm" className="shadow-lg">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <Heart 
          className={clsx('w-4 h-4 transition-colors', 
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
          )} 
        />
      </button>

      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-amber-50 to-green-50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Placeholder - In real app, replace with actual image */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-amber-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">{product.brand[0]}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{product.category === 'shampoo' ? 'Shampoo' : 'Makeup'}</p>
          </div>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onQuickView(product.id)}
            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            Vista Rápida
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Brand and Origin */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-none">
            {product.brand}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            Brasil
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-playfair font-medium text-gray-900 mb-2 line-clamp-2 text-lg">
          {product.name}
        </h3>

        {/* Nostalgia Text */}
        <p className="text-sm text-amber-700 italic mb-3 font-medium">
          "{product.nostalgiaText}"
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={clsx('w-4 h-4', 
                  star <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewsCount} reviews)
          </span>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.highlights.slice(0, 3).map((highlight) => (
            <Badge key={highlight} variant="secondary" size="sm">
              {highlight}
            </Badge>
          ))}
        </div>

        {/* Options */}
        {product.options && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {product.category === 'maquiagem' ? 'Cores Disponíveis:' : 'Opções:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1 border text-xs rounded-none transition-all',
                    selectedOption === option.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  )}
                >
                  {option.color && (
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300" 
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">€{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">€{product.originalPrice}</span>
          )}
          {discount > 0 && (
            <span className="text-sm text-green-600 font-medium">
              Economiza €{(product.originalPrice! - product.price).toFixed(0)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.lowStock ? (
            <StatusBadge status="low-stock" size="sm" />
          ) : product.inStock ? (
            <StatusBadge status="in-stock" size="sm" />
          ) : (
            <StatusBadge status="out-of-stock" size="sm" />
          )}
        </div>

        {/* Shipping Calculator */}
        <div className="mb-4">
          <button
            onClick={() => setShowShipping(!showShipping)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Truck className="w-4 h-4" />
            Calcular Frete
            <Info className="w-3 h-3" />
          </button>
          
          {showShipping && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Entrega Expressa (2-3 dias):</span>
                  <span className="font-medium">€8.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega Standard (5-7 dias):</span>
                  <span className="font-medium">€4.90</span>
                </div>
                <div className="text-green-600 text-xs">
                  Frete grátis em compras acima de €50
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onAddToCart(product.id, { selectedOption })}
            disabled={!product.inStock}
            className="bg-green-700 hover:bg-green-800"
          >
            {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onQuickView(product.id)}
            className="text-xs"
          >
            Ver Detalhes
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ShampoosMaquiagemProps {
  onAddToCart?: (productId: string, options?: any) => void;
  onQuickView?: (productId: string) => void;
}

export default function ShampoosMaquiagem({ 
  onAddToCart = () => {}, 
  onQuickView = () => {} 
}: ShampoosMaquiagemProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'shampoo' | 'maquiagem'>('all');
  
  const filteredProducts = products.filter(product => 
    activeFilter === 'all' || product.category === activeFilter
  );

  return (
    <section className="py-12 bg-gradient-to-b from-green-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
            Shampoos & Maquiagem Brasileira
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Produtos autênticos do Brasil para sua rotina de beleza. 
            Sinta a nostalgia e a qualidade que só o Brasil tem.
          </p>
          
          {/* Exclusive Banner */}
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-2 rounded-none">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 font-medium">
              Exclusivo na Europa - Produtos Importados Diretamente do Brasil
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white border border-gray-200 rounded-none overflow-hidden">
            {[
              { key: 'all', label: 'Todos os Produtos' },
              { key: 'shampoo', label: 'Shampoos & Cuidados' },
              { key: 'maquiagem', label: 'Maquiagem' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={clsx(
                  'px-6 py-3 text-sm font-medium transition-all',
                  activeFilter === filter.key
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Brazilian Authenticity Banner */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-amber-600 text-white p-8 rounded-none text-center">
          <h3 className="text-2xl font-playfair font-bold mb-4">
            Autenticidade Brasileira Garantida
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 mb-2" />
              <h4 className="font-medium mb-1">Origem Verificada</h4>
              <p className="text-green-100">Produtos importados diretamente das marcas brasileiras</p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-8 h-8 mb-2" />
              <h4 className="font-medium mb-1">Qualidade Premium</h4>
              <p className="text-green-100">Fórmulas exclusivas que fazem sucesso no Brasil</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-8 h-8 mb-2" />
              <h4 className="font-medium mb-1">Nostalgia & Cuidado</h4>
              <p className="text-green-100">Reconecte-se com suas origens através da beleza</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}