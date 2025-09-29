'use client';

import { useState } from 'react';
import { Star, Heart, ShoppingBag, TrendingUp, Award, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal, { ModalContent, ModalFooter } from '../ui/Modal';
import AddToCartButton from '../shared/AddToCartButton';

// Tipos para os produtos
interface ProductVariant {
  id: string;
  size: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

interface ProgressivaProduct {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  fullDescription: string;
  benefits: string[];
  howToUse: string[];
  ingredients: string[];
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  badges: string[];
  variants?: ProductVariant[];
  isViral?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  flag?: string;
}

// Dados dos produtos
const progressivaProducts: ProgressivaProduct[] = [
  {
    id: 'cadiveu-plastica-fios',
    name: 'Plástica dos Fios',
    brand: 'Cadiveu',
    tagline: 'Produto dos sonhos das brasileiras',
    description: 'A revolução dos cabelos lisos e brilhantes',
    fullDescription: 'A Plástica dos Fios Cadiveu é o tratamento mais desejado pelas brasileiras. Com tecnologia avançada, proporciona alisamento natural, redução do volume e brilho incomparável. Ideal para todos os tipos de cabelo.',
    benefits: [
      'Alisamento natural e duradouro',
      'Reduz até 95% do frizz',
      'Cabelos 3x mais brilhantes',
      'Proteção térmica até 230°C',
      'Resultado de salão em casa'
    ],
    howToUse: [
      'Lave o cabelo 2 vezes com shampoo clarificante',
      'Seque 80% dos fios com secador',
      'Aplique mecha por mecha, respeitando 1cm da raiz',
      'Deixe agir por 20-30 minutos',
      'Enxágue e finalize com escova e prancha'
    ],
    ingredients: ['Queratina Hidrolisada', 'Colágeno', 'Arginina', 'Aminoácidos'],
    price: 95,
    image: '/images/products/cadiveu-plastica.jpg',
    gallery: [
      '/images/products/cadiveu-plastica-1.jpg',
      '/images/products/cadiveu-plastica-2.jpg',
      '/images/products/cadiveu-plastica-3.jpg'
    ],
    rating: 4.9,
    reviews: 2847,
    badges: ['MAIS VENDIDO', 'PREMIUM'],
    isBestSeller: true,
    isPremium: true,
    flag: '🇧🇷'
  },
  {
    id: 'zap-all-time-organic',
    name: 'ZAP All Time Organic',
    brand: 'ZAP',
    tagline: 'Sem Formol - Aprovado UE',
    description: 'Progressiva orgânica e segura',
    fullDescription: 'A primeira progressiva 100% orgânica aprovada pela União Europeia. Sem formol, sem cheiro forte, com ingredientes naturais que respeitam a saúde dos seus cabelos e do meio ambiente.',
    benefits: [
      '100% livre de formol e químicos agressivos',
      'Aprovado pela União Europeia',
      'Ingredientes orgânicos certificados',
      'Sem cheiro desagradável',
      'Resultado natural e saudável'
    ],
    howToUse: [
      'Aplique no cabelo limpo e úmido',
      'Distribua uniformemente com pente',
      'Deixe agir por 15-25 minutos',
      'Enxágue bem com água morna',
      'Finalize com escova progressiva'
    ],
    ingredients: ['Óleo de Argan Orgânico', 'Manteiga de Karité', 'Proteínas do Trigo', 'Extrato de Bambu'],
    price: 75,
    image: '/images/products/zap-organic.jpg',
    gallery: [
      '/images/products/zap-organic-1.jpg',
      '/images/products/zap-organic-2.jpg'
    ],
    rating: 4.7,
    reviews: 1523,
    badges: ['ECO-FRIENDLY', 'SEM FORMOL'],
    flag: '🌿'
  },
  {
    id: 'forever-liss-btx-zero',
    name: 'Forever Liss BTX Zero',
    brand: 'Forever Liss',
    tagline: 'Igual ao salão por fração do preço',
    description: 'Botox capilar profissional em casa',
    fullDescription: 'O BTX Zero oferece tratamento profissional de botox capilar no conforto da sua casa. Recupera cabelos danificados, sela cutículas e proporciona brilho intenso por até 4 meses.',
    benefits: [
      'Recuperação imediata de cabelos danificados',
      'Selo de cutículas por até 4 meses',
      'Brilho profissional',
      'Reduz quebra em 80%',
      'Economia de até 70% vs salão'
    ],
    howToUse: [
      'Lave com shampoo anti-resíduo',
      'Aplique o BTX mecha por mecha',
      'Massageie suavemente',
      'Deixe agir por 20 minutos',
      'Enxágue e finalize como desejar'
    ],
    ingredients: ['Botox Vegetal', 'Ácido Hialurônico', 'Colágeno Vegetal', 'Vitamina E'],
    price: 45,
    originalPrice: 85,
    variants: [
      { id: 'btx-150ml', size: '150ml', price: 45, originalPrice: 85, stock: 15 },
      { id: 'btx-500ml', size: '500ml', price: 85, originalPrice: 150, stock: 8 }
    ],
    image: '/images/products/forever-liss-btx.jpg',
    gallery: [
      '/images/products/forever-liss-btx-1.jpg',
      '/images/products/forever-liss-btx-2.jpg'
    ],
    rating: 4.6,
    reviews: 967,
    badges: ['PROMOCÃO', 'MELHOR CUSTO'],
    flag: '💰'
  },
  {
    id: 'karseell-collagen-mascara',
    name: 'Karseell Collagen Máscara',
    brand: 'Karseell',
    tagline: 'Viral no TikTok - 970K seguidores',
    description: 'A máscara que conquistou o mundo',
    fullDescription: 'Viral em todas as redes sociais! A máscara de colágeno Karseell virou febre mundial por seus resultados instantâneos. Em apenas 5 minutos, transforma cabelos ressecados em fios sedosos e brilhantes.',
    benefits: [
      'Resultado visível em 5 minutos',
      'Viral no TikTok e Instagram',
      'Hidratação profunda instantânea',
      'Cabelos 5x mais macios',
      'Aprovado por influencers mundiais'
    ],
    howToUse: [
      'Lave o cabelo normalmente',
      'Aplique a máscara no cabelo úmido',
      'Distribua das medidas às pontas',
      'Deixe agir por 5-10 minutos',
      'Enxágue completamente'
    ],
    ingredients: ['Colágeno Marinho', 'Ácido Hialurônico', 'Proteínas da Seda', 'Óleo de Argan'],
    price: 28,
    originalPrice: 48,
    variants: [
      { id: 'karseell-100ml', size: '100ml', price: 28, originalPrice: 48, stock: 23 },
      { id: 'karseell-300ml', size: '300ml', price: 48, originalPrice: 75, stock: 12 }
    ],
    image: '/images/products/karseell-collagen.jpg',
    gallery: [
      '/images/products/karseell-collagen-1.jpg',
      '/images/products/karseell-collagen-2.jpg'
    ],
    rating: 4.8,
    reviews: 3256,
    badges: ['VIRAL', 'TIKTOK FAMOUS'],
    isViral: true,
    flag: '📱'
  },
  {
    id: 'maria-escandalosa-botox-white',
    name: 'Maria Escandalosa Botox White',
    brand: 'Maria Escandalosa',
    tagline: 'Loiro dos sonhos',
    description: 'Botox matizador para loiros perfeitos',
    fullDescription: 'O Botox White Maria Escandalosa é especialmente desenvolvido para cabelos loiros. Além de hidratar profundamente, matiza tons amarelados e proporciona o loiro dos sonhos com brilho platinado.',
    benefits: [
      'Matiza tons amarelados',
      'Loiro platinado perfeito',
      'Hidratação intensa',
      'Brilho espelhado',
      'Especializado em cabelos loiros'
    ],
    howToUse: [
      'Use em cabelos pré-descoloridos',
      'Aplique com luvas nos fios úmidos',
      'Deixe agir por 15-30 minutos',
      'Monitore o tom desejado',
      'Enxágue bem com água fria'
    ],
    ingredients: ['Pigmentos Violetas', 'Queratina Líquida', 'Óleo de Coco', 'Proteínas do Leite'],
    price: 35,
    originalPrice: 65,
    variants: [
      { id: 'botox-white-200ml', size: '200ml', price: 35, originalPrice: 65, stock: 18 },
      { id: 'botox-white-500ml', size: '500ml', price: 65, originalPrice: 95, stock: 9 }
    ],
    image: '/images/products/maria-escandalosa-white.jpg',
    gallery: [
      '/images/products/maria-escandalosa-white-1.jpg',
      '/images/products/maria-escandalosa-white-2.jpg'
    ],
    rating: 4.5,
    reviews: 834,
    badges: ['ESPECIALISTA LOIROS', 'MATIZADOR'],
    flag: '👱‍♀️'
  },
  {
    id: 'truss-uso-obrigatorio',
    name: 'TRUSS Uso Obrigatório',
    brand: 'TRUSS',
    tagline: 'Marca premium dos salões',
    description: 'O padrão ouro dos tratamentos capilares',
    fullDescription: 'TRUSS Uso Obrigatório é a escolha número 1 dos salões premium. Com fórmula exclusiva desenvolvida para profissionais, oferece resultados superiores e duradouros. A marca de confiança dos melhores cabeleireiros.',
    benefits: [
      'Padrão profissional de salão',
      'Fórmula exclusiva TRUSS',
      'Resultados duradouros',
      'Preferida pelos profissionais',
      'Qualidade premium garantida'
    ],
    howToUse: [
      'Produto para uso profissional',
      'Siga orientações do cabeleireiro',
      'Aplicar com técnica específica',
      'Tempo de ação conforme diagnóstico',
      'Finalização profissional'
    ],
    ingredients: ['Complexo K3', 'Aminoácidos Essenciais', 'Queratina Profissional', 'Ceramidas'],
    price: 75,
    image: '/images/products/truss-uso-obrigatorio.jpg',
    gallery: [
      '/images/products/truss-uso-obrigatorio-1.jpg',
      '/images/products/truss-uso-obrigatorio-2.jpg'
    ],
    rating: 4.9,
    reviews: 1247,
    badges: ['PREMIUM', 'PROFISSIONAL'],
    isPremium: true,
    flag: '💎'
  }
];

interface ProgressivasTratamentosProps {
  className?: string;
}

export default function ProgressivasTratamentos({ className }: ProgressivasTratamentosProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProgressivaProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedVariant('');
  };

  const renderBadge = (badge: string, product: ProgressivaProduct) => {
    const badgeConfig: Record<string, { className: string; icon?: React.ReactNode }> = {
      'MAIS VENDIDO': { 
        className: 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg',
        icon: <TrendingUp className="w-3 h-3" />
      },
      'PREMIUM': { 
        className: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg',
        icon: <Award className="w-3 h-3" />
      },
      'VIRAL': { 
        className: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg animate-pulse',
        icon: <Sparkles className="w-3 h-3" />
      },
      'TIKTOK FAMOUS': { 
        className: 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg',
      },
      'ECO-FRIENDLY': { 
        className: 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg',
      },
      'SEM FORMOL': { 
        className: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg',
      },
      'PROMOCÃO': { 
        className: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg animate-pulse',
      },
      'MELHOR CUSTO': { 
        className: 'bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg',
      },
      'PROFISSIONAL': { 
        className: 'bg-gradient-to-r from-gray-900 to-black text-white shadow-lg',
      },
      'ESPECIALISTA LOIROS': { 
        className: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg',
      },
      'MATIZADOR': { 
        className: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg',
      }
    };

    const config = badgeConfig[badge] || { className: 'bg-gray-600 text-white' };

    return (
      <Badge
        key={badge}
        className={`${config.className} text-xs font-bold px-2 py-1 flex items-center gap-1`}
      >
        {config.icon}
        {badge}
      </Badge>
    );
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header Section com tema brasileiro premium */}
      <div className="text-center mb-12 py-12 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-none border border-amber-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-4xl">🇧🇷</span>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Progressivas & Tratamentos
            </h1>
            <span className="text-4xl">✨</span>
          </div>
          <p className="text-xl text-gray-700 font-medium mb-2">
            O melhor do Brasil para seus cabelos
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Produtos autênticos importados direto do Brasil. A tradição brasileira em cuidados capilares 
            agora na Europa, com a qualidade e resultados que você já conhece e ama.
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white">
              ✅ Produtos Autênticos
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              🚚 Importação Direta
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
              💯 Garantia de Qualidade
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {progressivaProducts.map((product) => {
          const currentPrice = product.variants ? product.variants[0].price : product.price;
          const originalPrice = product.variants 
            ? product.variants[0].originalPrice 
            : product.originalPrice;

          return (
            <Card 
              key={product.id} 
              className="group relative overflow-hidden bg-white border border-gray-200 hover:border-amber-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {/* Badges Container */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                  {product.badges.slice(0, 2).map(badge => renderBadge(badge, product))}
                </div>

                {/* Discount Badge */}
                {originalPrice && originalPrice > currentPrice && (
                  <div className="absolute top-3 right-3 z-20">
                    <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold animate-pulse">
                      -{getDiscountPercentage(originalPrice, currentPrice)}%
                    </Badge>
                  </div>
                )}

                {/* Heart/Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                  style={{ right: originalPrice && originalPrice > currentPrice ? '60px' : '12px' }}
                >
                  <Heart 
                    className={`w-4 h-4 transition-all duration-200 ${
                      favorites.has(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-400'
                    }`} 
                  />
                </button>

                {/* Product Image Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">{product.flag}</div>
                    <div className="font-bold text-lg text-amber-800">{product.brand}</div>
                    <div className="text-sm text-amber-600 mt-1">{product.name}</div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                    <Button
                      onClick={() => setSelectedProduct(product)}
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 text-black hover:bg-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Brand & Rating */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Badge variant="secondary" size="sm" className="mb-2">
                      {product.brand}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} avaliações)</span>
                    </div>
                  </div>
                </div>

                {/* Product Name & Tagline */}
                <h3 className="font-playfair text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-amber-600 font-medium mb-3 italic">
                  "{product.tagline}"
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      €{currentPrice}
                    </span>
                    {originalPrice && originalPrice > currentPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        €{originalPrice}
                      </span>
                    )}
                  </div>
                  {originalPrice && originalPrice > currentPrice && (
                    <Badge className="bg-green-100 text-green-800 border border-green-200">
                      Poupa €{originalPrice - currentPrice}
                    </Badge>
                  )}
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.name.toLowerCase().replace(/\s+/g, '-'),
                    price: currentPrice,
                    comparePrice: originalPrice,
                    images: [{ url: product.image, alt: product.name, isMain: true }],
                    status: 'ACTIVE',
                    quantity: 100,
                    variants: product.variants?.map(v => ({
                      id: v.id,
                      name: v.size,
                      price: v.price,
                      quantity: v.stock
                    }))
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  showIcon={true}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={closeModal}
          size="lg"
          title={selectedProduct.name}
          description={`${selectedProduct.brand} - ${selectedProduct.tagline}`}
        >
          <ModalContent>
            <div className="space-y-6">
              {/* Product Header */}
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-none flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{selectedProduct.flag}</div>
                    <div className="text-xs font-medium text-amber-800">{selectedProduct.brand}</div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-playfair font-bold text-gray-900">
                      {selectedProduct.name}
                    </h2>
                    <div className="flex gap-1">
                      {selectedProduct.badges.map(badge => renderBadge(badge, selectedProduct))}
                    </div>
                  </div>
                  
                  <p className="text-amber-600 font-medium italic mb-3">
                    "{selectedProduct.tagline}"
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">{selectedProduct.rating}</span>
                      <span className="text-gray-500 ml-1">({selectedProduct.reviews} avaliações)</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700">{selectedProduct.fullDescription}</p>
                </div>
              </div>

              {/* Variants Selection */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tamanhos Disponíveis:</h4>
                  <div className="flex gap-3">
                    {selectedProduct.variants.map((variant) => {
                      const isSelected = selectedVariant === variant.id;
                      const discount = variant.originalPrice 
                        ? getDiscountPercentage(variant.originalPrice, variant.price)
                        : 0;
                      
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant.id)}
                          className={`p-4 border rounded-none text-center transition-all duration-200 hover:shadow-md ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-50 shadow-md' 
                              : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{variant.size}</div>
                          <div className="text-lg font-bold text-amber-600">€{variant.price}</div>
                          {variant.originalPrice && (
                            <>
                              <div className="text-sm text-gray-400 line-through">€{variant.originalPrice}</div>
                              <div className="text-xs text-green-600 font-medium">-{discount}%</div>
                            </>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {variant.stock > 0 ? `${variant.stock} disponíveis` : 'Esgotado'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Benefícios:</h4>
                <ul className="space-y-2">
                  {selectedProduct.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mr-3"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to Use */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Como Usar:</h4>
                <ol className="space-y-2">
                  {selectedProduct.howToUse.map((step, index) => (
                    <li key={index} className="flex text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Ingredientes Principais:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ModalContent>
          
          <ModalFooter>
            <Button variant="ghost" onClick={closeModal}>
              Fechar
            </Button>
            <AddToCartButton
              product={{
                id: selectedProduct.id,
                name: selectedProduct.name,
                slug: selectedProduct.name.toLowerCase().replace(/\s+/g, '-'),
                price: selectedVariant 
                  ? selectedProduct.variants?.find(v => v.id === selectedVariant)?.price || selectedProduct.price
                  : selectedProduct.price,
                comparePrice: selectedVariant
                  ? selectedProduct.variants?.find(v => v.id === selectedVariant)?.originalPrice
                  : selectedProduct.originalPrice,
                images: [{ url: selectedProduct.image, alt: selectedProduct.name, isMain: true }],
                status: 'ACTIVE',
                quantity: 100,
                variants: selectedProduct.variants?.map(v => ({
                  id: v.id,
                  name: v.size,
                  price: v.price,
                  quantity: v.stock
                }))
              }}
              variantId={selectedVariant}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium border-0 shadow-lg hover:shadow-xl"
            />
          </ModalFooter>
        </Modal>
      )}

      {/* Brazilian Touch Footer */}
      <div className="text-center py-8 bg-gradient-to-r from-green-50 via-yellow-50 to-green-50 rounded-none border border-green-100 mt-12">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-2xl">🇧🇷</span>
          <h3 className="text-xl font-playfair font-bold text-green-700">
            Autêntico Brasil, Qualidade Europa
          </h3>
          <span className="text-2xl">🇪🇺</span>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Todos os produtos são importados diretamente do Brasil, mantendo a autenticidade 
          e qualidade originais. Desfrute da tradição brasileira em cuidados capilares 
          com a garantia e segurança do mercado europeu.
        </p>
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <Badge className="bg-green-100 text-green-800">🛡️ Garantia de Autenticidade</Badge>
          <Badge className="bg-blue-100 text-blue-800">📦 Importação Direta</Badge>
          <Badge className="bg-purple-100 text-purple-800">⚡ Entrega Rápida</Badge>
          <Badge className="bg-orange-100 text-orange-800">💝 Embalagem Original</Badge>
        </div>
      </div>
    </div>
  );
}