'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getLegacyCompatibleProducts } from '@/lib/data/megaHairProducts';
import { useCart } from '@/lib/stores/cartStore';
import { CategorySchema } from '@/components/seo/SchemaMarkup';
import OptimizedMegaHairImage, { useMegaHairImagePreload } from '@/components/mega-hair/OptimizedMegaHairImage';
import HairTypeSection from '@/components/mega-hair/HairTypeSection';
import CollectionSection from '@/components/mega-hair/CollectionSection';

// Enhanced product data structure (mantém compatibilidade)
interface MegaHairProduct {
  id: number;
  name: string;
  type: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  color: 'loiro' | 'castanho' | 'preto' | 'ruivo' | 'ombre';
  length: number;
  price: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  origin: string;
  weight: number;
}

// Mapeamentos para compatibilidade
const hairTypes: Array<'liso' | 'ondulado' | 'cacheado' | 'crespo'> = ['liso', 'ondulado', 'cacheado', 'crespo'];
const hairColors: Array<'loiro' | 'castanho' | 'preto' | 'ruivo' | 'ombre'> = ['loiro', 'castanho', 'preto', 'ruivo', 'ombre'];
const lengths = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

const typeNames: Record<string, string> = {
  'liso': 'Liso Natural',
  'ondulado': 'Ondulado Suave',
  'cacheado': 'Cacheado Definido',
  'crespo': 'Crespo Natural'
};

// Usar sistema unificado como fonte de dados
function generateProducts(): MegaHairProduct[] {
  return getLegacyCompatibleProducts();
}

// Filter interfaces
interface Filters {
  type: string;
  color: string;
  length: string;
  priceRange: string;
  collection: string;
  badge: string;
  inStock: boolean;
}

// Premium gradient animations
const gradientVariants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 10,
      ease: 'linear',
      repeat: Infinity
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function MegaHairCatalog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<MegaHairProduct | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'categories' | 'collections'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [compareProducts, setCompareProducts] = useState<MegaHairProduct[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    liso: true,
    ondulado: false,
    cacheado: false,
    crespo: false
  });
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({
    CLASSIC: true,
    PREMIUM: false,
    GOLD: false,
    RAPUNZEL: false,
    PROFESSIONAL: false
  });
  const { addItem: addToCartStore, getItemCount, openCart, items } = useCart();
  const [isClient, setIsClient] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<Filters>({
    type: 'todos',
    color: 'todos',
    length: 'todos',
    priceRange: 'todos',
    collection: 'todos',
    badge: 'todos',
    inStock: false
  });

  // Generate products once usando sistema unificado
  const allProducts = useMemo(() => generateProducts(), []);

  // Preload das primeiras imagens críticas
  const criticalImages = useMemo(() =>
    allProducts.slice(0, 6).map(p => p.image).filter(Boolean),
    [allProducts]
  );
  useMegaHairImagePreload(criticalImages, 6);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search query filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        const searchFields = [
          product.name,
          product.type,
          product.color,
          product.origin,
          product.badge,
          product.description,
          product.technicalSpecs
        ].filter(Boolean);

        return searchFields.some(field =>
          field?.toLowerCase().includes(searchLower)
        );
      });
    }

    if (filters.type !== 'todos') {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.color !== 'todos') {
      filtered = filtered.filter(p => p.color === filters.color);
    }
    if (filters.length !== 'todos') {
      filtered = filtered.filter(p => p.length === parseInt(filters.length));
    }

    // Price range filter using slider
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (filters.collection !== 'todos') {
      filtered = filtered.filter(p => {
        // Determinar coleção baseada no preço se não estiver definida
        let collection = p.collection || 'CLASSIC';
        if (!p.collection) {
          if (p.price < 80) collection = 'CLASSIC';
          else if (p.price < 130) collection = 'PREMIUM';
          else if (p.price < 180) collection = 'GOLD';
          else if (p.price < 220) collection = 'RAPUNZEL';
          else collection = 'PROFESSIONAL';
        }
        return collection === filters.collection;
      });
    }
    if (filters.badge !== 'todos') {
      filtered = filtered.filter(p => p.badge === filters.badge);
    }
    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock);
    }

    return filtered;
  }, [allProducts, filters, searchQuery, priceRange]);

  // Agrupar produtos por tipo de cabelo
  const productsByType = useMemo(() => {
    const grouped = {
      liso: [] as MegaHairProduct[],
      ondulado: [] as MegaHairProduct[],
      cacheado: [] as MegaHairProduct[],
      crespo: [] as MegaHairProduct[]
    };

    filteredProducts.forEach(product => {
      if (product.type && grouped[product.type]) {
        grouped[product.type].push(product);
      }
    });

    return grouped;
  }, [filteredProducts]);

  // Agrupar produtos por coleção
  const productsByCollection = useMemo(() => {
    const grouped = {
      CLASSIC: [] as MegaHairProduct[],
      PREMIUM: [] as MegaHairProduct[],
      GOLD: [] as MegaHairProduct[],
      RAPUNZEL: [] as MegaHairProduct[],
      PROFESSIONAL: [] as MegaHairProduct[]
    };

    filteredProducts.forEach(product => {
      // Determinar coleção baseada no preço se não estiver definida
      let collection = product.collection || 'CLASSIC';

      if (!product.collection) {
        if (product.price < 80) collection = 'CLASSIC';
        else if (product.price < 130) collection = 'PREMIUM';
        else if (product.price < 180) collection = 'GOLD';
        else if (product.price < 220) collection = 'RAPUNZEL';
        else collection = 'PROFESSIONAL';
      }

      if (grouped[collection as keyof typeof grouped]) {
        grouped[collection as keyof typeof grouped].push(product);
      }
    });

    return grouped;
  }, [filteredProducts]);

  // Controlar expansão de seções
  const toggleSection = (type: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const expandAllSections = () => {
    setExpandedSections({
      liso: true,
      ondulado: true,
      cacheado: true,
      crespo: true
    });
  };

  const collapseAllSections = () => {
    setExpandedSections({
      liso: false,
      ondulado: false,
      cacheado: false,
      crespo: false
    });
  };

  // Controlar expansão de coleções
  const toggleCollection = (collection: string) => {
    setExpandedCollections(prev => ({
      ...prev,
      [collection]: !prev[collection]
    }));
  };

  const expandAllCollections = () => {
    setExpandedCollections({
      CLASSIC: true,
      PREMIUM: true,
      GOLD: true,
      RAPUNZEL: true,
      PROFESSIONAL: true
    });
  };

  const collapseAllCollections = () => {
    setExpandedCollections({
      CLASSIC: false,
      PREMIUM: false,
      GOLD: false,
      RAPUNZEL: false,
      PROFESSIONAL: false
    });
  };

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cart is now managed by global store
  useEffect(() => {
    // Global cart store handles persistence automatically
  }, [isClient]);

  // Save cart to localStorage
  // Remove old cart localStorage logic
  useEffect(() => {
    // Cart is now managed by global store
  }, [isClient]);

  // Simulate loading - ensure loading state is properly handled
  useEffect(() => {
    // Set loading to false after component mounts and client-side hydration is complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Fallback: Force loading to false after maximum wait time to prevent stuck loading
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Additional safety check - ensure loading state resets if component re-mounts
  useEffect(() => {
    if (isClient && isLoading) {
      const emergencyTimer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(emergencyTimer);
    }
  }, [isClient, isLoading]);

  const handleFilterChange = (filterType: keyof Filters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      type: 'todos',
      color: 'todos',
      length: 'todos',
      priceRange: 'todos',
      collection: 'todos',
      badge: 'todos',
      inStock: false
    });
    setSearchQuery('');
    setPriceRange([0, 300]);
  };

  // Wishlist functions
  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  // Compare functions
  const toggleCompare = (product: MegaHairProduct) => {
    setCompareProducts(prev => {
      const isAlreadyComparing = prev.some(p => p.id === product.id);
      if (isAlreadyComparing) {
        return prev.filter(p => p.id !== product.id);
      } else if (prev.length < 3) {
        return [...prev, product];
      } else {
        alert('Máximo 3 produtos para comparação');
        return prev;
      }
    });
  };

  const isComparing = (productId: number) => compareProducts.some(p => p.id === productId);

  const clearComparison = () => {
    setCompareProducts([]);
    setShowComparison(false);
  };

  const addToCart = (product: MegaHairProduct) => {
    addToCartStore({
      productId: product.id.toString(),
      quantity: 1,
      product: {
        id: product.id.toString(),
        name: product.name,
        slug: `mega-hair-${product.id}`,
        price: product.price,
        images: [{ url: product.image, alt: product.name, isMain: true }],
        status: 'ACTIVE' as any,
        quantity: product.inStock ? 999 : 0,
      },
    });
    openCart();
  };

  const getCartItemCount = () => {
    return getItemCount();
  };

  const isInCart = (productId: number) => {
    return items.some(item => item.productId === productId.toString());
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
      {/* Premium Hero Section with Animation */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={gradientVariants}
        className="relative overflow-hidden bg-gradient-to-r from-rose-900 via-rose-600 to-pink-600 text-white"
        style={{ backgroundSize: '200% 200%' }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 py-20 px-4">
          <div className="max-w-[1440px] mx-auto">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="text-center"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/30">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                </span>
                <span className="text-sm font-semibold uppercase tracking-wider">Pronta Entrega • Envio Imediato</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-6xl md:text-8xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-white via-rose-100 to-white bg-clip-text text-transparent">
                  Mega Hair
                </span>
                <br />
                <span className="text-3xl md:text-4xl font-light opacity-95">
                  Premium Collection
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
              >
                Transforme seu visual com extensões capilares de alta qualidade.
                <br />
                <span className="text-lg opacity-80">100% cabelo humano brasileiro • Texturas autênticas • Cores vibrantes</span>
              </motion.p>

              {/* Trust Badges */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-6 mb-12"
              >
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur px-5 py-3 rounded-xl border border-white/20">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold">4.9/5</p>
                    <p className="text-xs opacity-80">2.847 avaliações</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/15 backdrop-blur px-5 py-3 rounded-xl border border-white/20">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-sm font-bold">Garantia Total</p>
                    <p className="text-xs opacity-80">Satisfação garantida</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/15 backdrop-blur px-5 py-3 rounded-xl border border-white/20">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <div>
                    <p className="text-sm font-bold">Envio Express</p>
                    <p className="text-xs opacity-80">24-48 horas</p>
                  </div>
                </div>
              </motion.div>

              {/* Premium Stats */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  { value: `${allProducts.length}+`, label: 'Produtos Premium' },
                  { value: '18', label: 'Estilos Únicos' },
                  { value: '4', label: 'Tipos de Cabelo' },
                  { value: '5', label: 'Coleções Exclusivas' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Smart Search & Quick Actions Bar */}
      <section className="bg-white/90 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Smart Search */}
            <div className="flex-1 relative">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por tipo, cor, comprimento... ex: 'liso ruivo 60cm'"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Quiz Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuiz(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quiz Cabelo
              </motion.button>

              {/* Comparison Toggle */}
              {compareProducts.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all relative"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Comparar ({compareProducts.length})
                </motion.button>
              )}

              {/* Wishlist Toggle */}
              {wishlist.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all relative"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Favoritos ({wishlist.length})
                </motion.button>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600">
              {filteredProducts.length > 0 ? (
                <span>✨ Encontrados <strong>{filteredProducts.length}</strong> produtos para "{searchQuery}"</span>
              ) : (
                <span>😔 Nenhum produto encontrado para "{searchQuery}". Tente termos como "liso", "cacheado", "ruivo"</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Filter Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:border-gray-400 transition-colors"
              >
                Filtros {showFilters ? '−' : '+'}
              </button>

              {/* Seletor de modo de visualização */}
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('categories')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'categories'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Por Tipo
                </button>
                <button
                  onClick={() => setViewMode('collections')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'collections'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Por Coleção
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grade
                </button>
              </div>

              {/* Controles de expansão */}
              {viewMode === 'categories' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAllSections}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Expandir Tudo
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={collapseAllSections}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Recolher Tudo
                  </button>
                </div>
              )}

              {viewMode === 'collections' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAllCollections}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Expandir Tudo
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={collapseAllCollections}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Recolher Tudo
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {filteredProducts.length} produtos
              </div>

              {(filters.type !== 'todos' || filters.color !== 'todos' || filters.length !== 'todos' || filters.priceRange !== 'todos' || filters.collection !== 'todos' || filters.badge !== 'todos' || filters.inStock) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-80 shrink-0"
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 sticky top-32 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-rose-600 bg-clip-text text-transparent">
                      Filtrar Produtos
                    </h3>
                    {(filters.type !== 'todos' || filters.color !== 'todos' || filters.length !== 'todos') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearAllFilters}
                        className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full hover:bg-rose-200 transition-colors"
                      >
                        Limpar
                      </motion.button>
                    )}
                  </div>

                  {/* Type Filter with Icons */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
                      Textura do Cabelo
                    </h4>
                    <div className="space-y-2">
                      {['todos', ...hairTypes].map(type => {
                        const typeIcons = {
                          todos: '✨',
                          liso: '━',
                          ondulado: '∼',
                          cacheado: '◯',
                          crespo: '※'
                        };
                        return (
                          <motion.button
                            key={type}
                            whileHover={{ x: 5 }}
                            onClick={() => handleFilterChange('type', type)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                              filters.type === type
                                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                            }`}
                          >
                            <span className="text-xl">{typeIcons[type as keyof typeof typeIcons]}</span>
                            <span className="text-sm font-medium">
                              {type === 'todos' ? 'Todos os Tipos' : typeNames[type] || type}
                            </span>
                            {filters.type === type && (
                              <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Cor</h4>
                    <div className="space-y-2">
                      {['todos', ...hairColors, 'grisalho'].map(color => (
                        <button
                          key={color}
                          onClick={() => handleFilterChange('color', color)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                            filters.color === color
                              ? 'bg-rose-600 text-white shadow-lg transform scale-105'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            color === 'todos' ? 'bg-gradient-to-r from-gray-400 via-yellow-500 to-red-500' :
                            color === 'preto' ? 'bg-gray-900 border-gray-700' :
                            color === 'castanho' ? 'bg-amber-700 border-amber-600' :
                            color === 'loiro' ? 'bg-yellow-400 border-yellow-300' :
                            color === 'ruivo' ? 'bg-red-600 border-red-500' :
                            color === 'grisalho' ? 'bg-gray-400 border-gray-300' :
                            'bg-gradient-to-r from-amber-600 to-yellow-400 border-orange-400'
                          }`}></div>
                          <span>
                            {color === 'todos' ? 'Todas as Cores' :
                             color === 'grisalho' ? 'Grisalho' :
                             color.charAt(0).toUpperCase() + color.slice(1)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Comprimento</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFilterChange('length', 'todos')}
                        className={`px-3 py-2 rounded-lg transition-all text-sm ${
                          filters.length === 'todos'
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        Todos
                      </button>
                      {lengths.map(length => (
                        <button
                          key={length}
                          onClick={() => handleFilterChange('length', length.toString())}
                          className={`px-3 py-2 rounded-lg transition-all text-sm ${
                            filters.length === length.toString()
                              ? 'bg-rose-600 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {length}cm
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Faixa de Preço</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'todos', label: 'Todos os Preços' },
                        { value: '60-100', label: '€60 - €100' },
                        { value: '100-200', label: '€100 - €200' },
                        { value: '200-300', label: '€200 - €300' },
                        { value: '300', label: 'Acima de €300' }
                      ].map(range => (
                        <button
                          key={range.value}
                          onClick={() => handleFilterChange('priceRange', range.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                            filters.priceRange === range.value
                              ? 'bg-rose-600 text-white shadow-lg'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Collection Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Coleção</h4>
                    <div className="space-y-2">
                      {['todos', 'CLASSIC', 'PREMIUM', 'GOLD', 'RAPUNZEL', 'PROFESSIONAL'].map(collection => (
                        <button
                          key={collection}
                          onClick={() => handleFilterChange('collection', collection)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                            filters.collection === collection
                              ? 'bg-rose-600 text-white shadow-lg transform scale-105'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className={`w-3 h-3 ${
                            collection === 'todos' ? 'bg-gradient-to-r from-gray-400 to-rose-400 rounded-full' :
                            collection === 'CLASSIC' ? 'bg-gray-400 rounded-full' :
                            collection === 'PREMIUM' ? 'bg-blue-500 rounded-full' :
                            collection === 'GOLD' ? 'bg-yellow-500 rounded-full' :
                            collection === 'RAPUNZEL' ? 'bg-purple-500 rounded-full' :
                            'bg-rose-500 rounded-full'
                          }`}></div>
                          <span className="text-sm">
                            {collection === 'todos' ? 'Todas as Coleções' :
                             collection === 'CLASSIC' ? 'Classic • AA' :
                             collection === 'PREMIUM' ? 'Premium • AAA' :
                             collection === 'GOLD' ? 'Gold • AAAA' :
                             collection === 'RAPUNZEL' ? 'Rapunzel • AAAA' :
                             'Professional • AAA'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Badge Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Características</h4>
                    <div className="space-y-2">
                      {['todos', 'EXCLUSIVO', 'PREMIUM', 'LUXO', 'BEST SELLER', 'NATURAL'].map(badge => (
                        <button
                          key={badge}
                          onClick={() => handleFilterChange('badge', badge)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                            filters.badge === badge
                              ? 'bg-rose-600 text-white shadow-lg'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {badge === 'todos' ? 'Todas' :
                           badge === 'BEST SELLER' ? 'Mais Vendido' :
                           badge === 'NATURAL' ? 'Natural' :
                           badge}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700">Apenas disponíveis</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Area */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-light text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500 mb-6">
                  Tente ajustar os filtros ou limpar todas as seleções
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : viewMode === 'categories' ? (
              /* Visualização por Categorias */
              <div className="space-y-6">
                {(['liso', 'ondulado', 'cacheado', 'crespo'] as const).map(type => (
                  <HairTypeSection
                    key={type}
                    type={type}
                    products={productsByType[type]}
                    isExpanded={expandedSections[type]}
                    onToggle={() => toggleSection(type)}
                    onAddToCart={addToCart}
                    onViewDetails={setSelectedProduct}
                    isInCart={isInCart}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            ) : viewMode === 'collections' ? (
              /* Visualização por Coleções */
              <div className="space-y-6">
                {(['CLASSIC', 'PREMIUM', 'GOLD', 'RAPUNZEL', 'PROFESSIONAL'] as const).map(collection => (
                  <CollectionSection
                    key={collection}
                    collection={collection}
                    products={productsByCollection[collection]}
                    isExpanded={expandedCollections[collection]}
                    onToggle={() => toggleCollection(collection)}
                    onAddToCart={addToCart}
                    onViewDetails={setSelectedProduct}
                    isInCart={isInCart}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            ) : (
              /* Visualização em Grade Tradicional */
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  >
                    {/* Product Image */}
                    <Link href={`/produto/${product.id}`} className="block relative">
                      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        {!product.inStock && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10"
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                              <span className="text-gray-600 text-sm font-medium">Temporariamente Esgotado</span>
                            </div>
                          </motion.div>
                        )}

                        {/* Premium Badges */}
                        <div className="absolute top-3 left-3 z-20 flex gap-2">
                          <span className="bg-black/80 backdrop-blur text-white px-3 py-1 text-xs font-medium rounded-full">
                            {product.length}cm
                          </span>
                          {product.badge && (
                            <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          {/* Wishlist Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product.id);
                            }}
                            className={`w-10 h-10 backdrop-blur rounded-full flex items-center justify-center shadow-lg transition-colors ${
                              isInWishlist(product.id)
                                ? 'bg-rose-500 text-white'
                                : 'bg-white/90 hover:bg-white text-gray-700'
                            }`}
                          >
                            <svg className="w-5 h-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </motion.button>

                          {/* Compare Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleCompare(product);
                            }}
                            className={`w-10 h-10 backdrop-blur rounded-full flex items-center justify-center shadow-lg transition-colors ${
                              isComparing(product.id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/90 hover:bg-white text-gray-700'
                            }`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </motion.button>

                          {/* Quick View Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedProduct(product);
                            }}
                            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </motion.button>
                        </div>

                        <OptimizedMegaHairImage
                          src={product.image}
                          alt={product.name}
                          productName={product.name}
                          productType={product.type}
                          priority={index < 6}
                          className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                          showSkeleton={true}
                          lazy={index >= 6}
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </Link>

                    {/* Premium Product Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                          {typeNames[product.type]}
                        </span>
                        {product.rating > 4.5 && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span className="text-xs text-gray-500">{product.rating}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Premium Specs */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500">Comprimento</div>
                          <div className="font-bold text-sm text-gray-900">{product.length}cm</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500">Peso</div>
                          <div className="font-bold text-sm text-gray-900">{product.weight}g</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500">Origem</div>
                          <div className="font-bold text-sm text-gray-900">{product.origin}</div>
                        </div>
                      </div>

                      {/* Price with discount indication */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">ou 3x de {formatPrice(product.price / 3)} sem juros</div>
                      </div>

                      {/* Premium Action Buttons */}
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className={`w-full py-3 text-sm font-bold rounded-xl transition-all ${
                            product.inStock
                              ? isInCart(product.id)
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                                : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-rose-700 hover:to-pink-700'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {!product.inStock ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Temporariamente Esgotado
                            </span>
                          ) : isInCart(product.id) ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              No Carrinho
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                              </svg>
                              Adicionar ao Carrinho
                            </span>
                          )}
                        </motion.button>

                        <Link
                          href={`/produto/${product.id}`}
                          className="block w-full py-2 text-center text-sm font-medium text-gray-600 hover:text-rose-600 border border-gray-200 hover:border-rose-300 rounded-xl transition-all"
                        >
                          Ver Detalhes Completos
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
          </div>
      </section>

      {/* Floating Cart Indicator */}
      <AnimatePresence>
        {getCartItemCount() > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openCart}
              className="bg-gradient-to-r from-rose-600 to-pink-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center relative"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {getCartItemCount()}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Visualização Rápida</span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h2>
                    <div className="text-sm text-rose-600 font-medium">
                      {typeNames[selectedProduct.type]} • {selectedProduct.origin}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl font-light"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <OptimizedMegaHairImage
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      productName={selectedProduct.name}
                      productType={selectedProduct.type}
                      priority={true}
                      className="w-full h-full rounded-lg"
                      showSkeleton={true}
                      lazy={false}
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Especificações</h3>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between py-2 border-b">
                          <span>Comprimento:</span>
                          <span className="font-medium">{selectedProduct.length} cm</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Peso:</span>
                          <span className="font-medium">{selectedProduct.weight} gramas</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Textura:</span>
                          <span className="font-medium">{typeNames[selectedProduct.type]}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Cor:</span>
                          <span className="font-medium">{selectedProduct.color.charAt(0).toUpperCase() + selectedProduct.color.slice(1)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Origem:</span>
                          <span className="font-medium">{selectedProduct.origin}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Disponibilidade:</span>
                          <span className={`font-medium ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedProduct.inStock ? 'Em estoque' : 'Indisponível'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Avaliações</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-lg">
                              {i < Math.floor(selectedProduct.rating) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-600">
                          {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviews} avaliações)
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="mb-6">
                        <div className="text-4xl font-light text-rose-600 mb-2">
                          {formatPrice(selectedProduct.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Por 100g + Frete para toda Europa
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        disabled={!selectedProduct.inStock}
                        className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                          selectedProduct.inStock
                            ? 'bg-rose-600 text-white hover:bg-rose-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {selectedProduct.inStock ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
                      </button>

                      <div className="text-xs text-gray-500 text-center space-y-1 mt-4">
                        <p>• Entrega em 5-10 dias úteis para toda Europa</p>
                        <p>• Frete grátis para pedidos acima de €500</p>
                        <p>• Garantia de qualidade de 30 dias</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hair Compatibility Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuiz(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Quiz de Compatibilidade</h2>
                    <p className="text-purple-100">Encontre seu mega hair ideal em 3 perguntas</p>
                  </div>
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-8">
                  {/* Question 1: Hair Type */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900">1. Qual é a textura do seu cabelo natural?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { type: 'liso', label: 'Liso (1A-2A)', icon: '━', desc: 'Cabelo escorrido ou com leve ondulação' },
                        { type: 'ondulado', label: 'Ondulado (2C-3A)', icon: '∼', desc: 'Ondas marcadas e movimento natural' },
                        { type: 'cacheado', label: 'Cacheado (3C)', icon: '◯', desc: 'Cachos pequenos e bem definidos' },
                        { type: 'crespo', label: 'Crespo (4A-4C)', icon: '※', desc: 'Cachos muito fechados ou textura afro' }
                      ].map((option) => (
                        <motion.button
                          key={option.type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleFilterChange('type', option.type)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            filters.type === option.type
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{option.icon}</span>
                            <span className="font-semibold text-gray-900">{option.label}</span>
                          </div>
                          <p className="text-sm text-gray-600">{option.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Question 2: Desired Color */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900">2. Que cor você deseja?</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { color: 'preto', label: 'Preto Natural', bg: 'bg-gray-900' },
                        { color: 'castanho', label: 'Castanho', bg: 'bg-amber-800' },
                        { color: 'loiro', label: 'Loiro', bg: 'bg-yellow-400' },
                        { color: 'ruivo', label: 'Ruivo', bg: 'bg-orange-600' },
                        { color: 'grisalho', label: 'Grisalho', bg: 'bg-gray-400' },
                        { color: 'ombre', label: 'Ombré Hair', bg: 'bg-gradient-to-r from-gray-800 to-yellow-400' }
                      ].map((option) => (
                        <motion.button
                          key={option.color}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleFilterChange('color', option.color)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            filters.color === option.color
                              ? 'border-purple-500 ring-2 ring-purple-200'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className={`w-8 h-8 ${option.bg} rounded-full mx-auto mb-2`}></div>
                          <span className="text-sm font-medium text-gray-900">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Question 3: Budget */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900">3. Qual seu orçamento ideal?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { range: [50, 100], label: '€50 - €100', desc: 'Coleção Classic - Ótimo custo-benefício' },
                        { range: [100, 150], label: '€100 - €150', desc: 'Coleção Premium - Qualidade superior' },
                        { range: [150, 200], label: '€150 - €200', desc: 'Coleção Gold - Luxo e exclusividade' },
                        { range: [200, 300], label: '€200 - €300', desc: 'Coleção Rapunzel - Máxima qualidade' }
                      ].map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPriceRange(option.range)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            priceRange[0] === option.range[0] && priceRange[1] === option.range[1]
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                          <p className="text-sm text-gray-600">{option.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">
                      ✨ Produtos recomendados para você: {filteredProducts.length}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Com base nas suas respostas, encontramos os produtos perfeitos para seu cabelo!
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowQuiz(false);
                          // Scroll to results
                          document.querySelector('.max-w-7xl')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        Ver Resultados
                      </motion.button>
                      <button
                        onClick={() => {
                          clearAllFilters();
                          setPriceRange([0, 300]);
                        }}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        Refazer Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Comparison Modal */}
      <AnimatePresence>
        {showComparison && compareProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Comparar Produtos</h2>
                    <p className="text-blue-100">Compare até 3 produtos lado a lado</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={clearComparison}
                      className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-sm hover:bg-white/30 transition-colors"
                    >
                      Limpar Tudo
                    </button>
                    <button
                      onClick={() => setShowComparison(false)}
                      className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                <div className={`grid grid-cols-${compareProducts.length} gap-6`}>
                  {compareProducts.map((product, index) => (
                    <div key={product.id} className="bg-gray-50 rounded-2xl p-4">
                      {/* Product Image */}
                      <div className="relative h-48 bg-white rounded-xl mb-4 overflow-hidden">
                        <OptimizedMegaHairImage
                          src={product.image}
                          alt={product.name}
                          productName={product.name}
                          productType={product.type}
                          className="w-full h-full"
                          showSkeleton={true}
                        />
                        <button
                          onClick={() => toggleCompare(product)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{product.name}</h3>

                        <div className="text-2xl font-bold text-rose-600">{formatPrice(product.price)}</div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-medium">{typeNames[product.type]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cor:</span>
                            <span className="font-medium">{product.color}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Comprimento:</span>
                            <span className="font-medium">{product.length}cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Peso:</span>
                            <span className="font-medium">{product.weight}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Origem:</span>
                            <span className="font-medium">{product.origin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Avaliação:</span>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{product.rating}</span>
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className={`w-full py-3 rounded-xl font-medium transition-all ${
                            product.inStock
                              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:shadow-lg'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {product.inStock ? 'Adicionar ao Carrinho' : 'Esgotado'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Testimonials & Trust Section */}
      <section className="bg-gradient-to-r from-gray-50 to-rose-50 py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-rose-600 bg-clip-text text-transparent">
              Milhares de Clientes Satisfeitas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descobra por que somos a escolha #1 em mega hair premium na Europa
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                name: "Maria Silva",
                location: "Lisboa, Portugal",
                rating: 5,
                text: "Qualidade excepcional! O mega hair liso 1A ruivo ficou perfeito no meu cabelo. Já são 8 meses e continua como novo. Recomendo para todas!",
                avatar: "MS"
              },
              {
                name: "Ana Rodriguez",
                location: "Madrid, Espanha",
                rating: 5,
                text: "Impressionante! O cabelo cacheado 3C transformou completamente meu visual. Textura autêntica e cor vibrante. Entrega rápida para Espanha.",
                avatar: "AR"
              },
              {
                name: "Isabella Rossi",
                location: "Roma, Itália",
                rating: 5,
                text: "Melhor investimento que fiz! O mega hair premium gold é realmente superior. Aplicação perfeita e resultado profissional. Vale cada euro!",
                avatar: "IR"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8 items-center"
          >
            {[
              { icon: "🏆", title: "Qualidade Premium", subtitle: "Certificação AAA/AAAA" },
              { icon: "🚀", title: "Entrega Express", subtitle: "24-48h toda Europa" },
              { icon: "🛡️", title: "Garantia Total", subtitle: "30 dias devolução" },
              { icon: "💎", title: "100% Original", subtitle: "Cabelo humano brasileiro" },
              { icon: "⭐", title: "4.9/5 Estrelas", subtitle: "2.847+ avaliações" },
              { icon: "🌍", title: "Envio Europa", subtitle: "Todos os países" }
            ].map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-3 bg-white/60 backdrop-blur px-4 py-3 rounded-xl border border-white/50"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-bold text-sm text-gray-900">{badge.title}</div>
                  <div className="text-xs text-gray-600">{badge.subtitle}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Smart Recommendations Section */}
      {filteredProducts.length > 0 && (
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-rose-600 bg-clip-text text-transparent">
                Recomendações Personalizadas
              </h2>
              <p className="text-xl text-gray-600">
                Baseado no seu interesse, você também pode gostar de:
              </p>
            </motion.div>

            {/* Smart Recommendations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts
                .filter(p => !filteredProducts.some(fp => fp.id === p.id))
                .slice(0, 4)
                .map((product, index) => (
                  <motion.div
                    key={`rec-${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all group"
                  >
                    <div className="relative h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                      <OptimizedMegaHairImage
                        src={product.image}
                        alt={product.name}
                        productName={product.name}
                        productType={product.type}
                        className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                        showSkeleton={true}
                        lazy={true}
                      />
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Recomendado
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-rose-600">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          product.inStock
                            ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? 'Adicionar' : 'Esgotado'}
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isInWishlist(product.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Chat Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-20 right-6 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative group"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>

          {/* Chat bubble */}
          <div className="absolute bottom-16 right-0 bg-white rounded-2xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none min-w-48">
            <div className="text-sm text-gray-900 font-medium mb-1">💬 Posso ajudar?</div>
            <div className="text-xs text-gray-600">Chat com especialista em mega hair</div>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200"></div>
          </div>

          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
        </motion.button>
      </motion.div>

      {/* Schema Markup for Category Rich Snippets */}
      <CategorySchema
        category="Mega Hair Brasileiro"
        products={filteredProducts.map(product => ({
          id: product.id.toString(),
          name: product.name,
          brand: "JC Hair Studio's 62",
          price: product.price,
          preco_eur: product.price,
          images: [product.image],
          category: 'mega-hair',
          inStock: product.inStock,
          rating: product.rating,
          reviews: product.reviews
        }))}
      />
    </div>
  );
}