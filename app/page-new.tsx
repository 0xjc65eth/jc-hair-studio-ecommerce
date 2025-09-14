'use client';

import React, { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  Star, 
  Truck, 
  Shield, 
  Users, 
  ArrowRight,
  Play,
  Award,
  Heart,
  Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi, API_KEYS } from '@/lib/api';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { useInView } from 'react-intersection-observer';

// Dynamic imports for performance
const HeroBanner = dynamic(() => import('@/components/sections/HeroBanner'), {
  loading: () => <HeroBannerSkeleton />,
});
const CategoryGrid = dynamic(() => import('@/components/sections/CategoryGrid'));
const TestimonialSlider = dynamic(() => import('@/components/sections/TestimonialSlider'));
const Newsletter = dynamic(() => import('@/components/sections/Newsletter'));

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search Section */}
      <SearchSection />
      
      {/* Categories */}
      <CategoriesSection />
      
      {/* Featured Products */}
      <FeaturedProductsSection />
      
      {/* Best Sellers */}
      <BestSellersSection />
      
      {/* Promotions Banner */}
      <PromotionsBanner />
      
      {/* New Arrivals */}
      <NewArrivalsSection />
      
      {/* Features */}
      <FeaturesSection />
      
      {/* Testimonials */}
      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <TestimonialSlider />
      </Suspense>
      
      {/* Professional Section */}
      <ProfessionalSection />
      
      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-64 -right-64 w-128 h-128 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container-custom text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center px-4 py-2 bg-black/5 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Mais de 30 anos de experiência
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Extensões que
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            transformam
          </span>
          <br />
          sua beleza
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Descubra extensões de cabelo premium com qualidade profissional. 
          Resultado natural, durabilidade garantida e entrega em toda a Europa.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group">
            <span>Explorar Coleção</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Ver Como Aplicar</span>
          </button>
        </motion.div>
        
        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">50k+</div>
            <div className="text-sm text-gray-600">Clientes Satisfeitas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">98%</div>
            <div className="text-sm text-gray-600">Taxa de Satisfação</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">30+</div>
            <div className="text-sm text-gray-600">Anos de Experiência</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Search Section
function SearchSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={fadeInUp}
      className="py-16 bg-white"
    >
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Encontre o produto perfeito
          </h2>
          <p className="text-gray-600">
            Busque por cor, comprimento, tipo ou qualquer característica
          </p>
        </div>
        
        <div className="max-w-lg mx-auto">
          <SearchBar
            placeholder="Busque por mega hair, extensões, cores..."
            variant="default"
          />
        </div>
        
        {/* Popular Searches */}
        <div className="max-w-2xl mx-auto mt-6">
          <p className="text-sm text-gray-500 mb-3 text-center">Buscas populares:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Mega Hair Loiro', 'Extensões Clip', 'Cabelo Castanho', 'Franja', 'Ombré Hair'].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// Categories Section
function CategoriesSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  const categories = [
    {
      id: 'mega-hair',
      name: 'Mega Hair',
      description: 'Extensões premium para volume e comprimento',
      image: '/images/categories/mega-hair.jpg',
      href: '/categoria/mega-hair',
      featured: true,
    },
    {
      id: 'extensoes-clip',
      name: 'Extensões Clip',
      description: 'Fáceis de aplicar, ideais para o dia a dia',
      image: '/images/categories/extensoes-clip.jpg',
      href: '/categoria/extensoes-clip',
    },
    {
      id: 'franjas',
      name: 'Franjas',
      description: 'Mude o visual instantaneamente',
      image: '/images/categories/franjas.jpg',
      href: '/categoria/franjas',
    },
    {
      id: 'acessorios',
      name: 'Acessórios',
      description: 'Ferramentas e produtos de cuidado',
      image: '/images/categories/acessorios.jpg',
      href: '/categoria/acessorios',
    },
  ];
  
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={staggerChildren}
      className="py-20 bg-gray-50"
    >
      <div className="container-custom">
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossas Categorias
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore nossa ampla seleção de produtos para todos os tipos e estilos de cabelo
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={fadeInUp}
              className={`group cursor-pointer ${
                category.featured ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-200 aspect-square">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20 text-white">
                  <h3 className={`font-bold mb-2 ${
                    category.featured ? 'text-2xl' : 'text-xl'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`opacity-90 ${
                    category.featured ? 'text-base' : 'text-sm'
                  }`}>
                    {category.description}
                  </p>
                </div>
                
                <div className="absolute inset-0 bg-gray-300 group-hover:scale-110 transition-transform duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// Featured Products Section
function FeaturedProductsSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  const { data: products, isLoading } = useQuery({
    queryKey: API_KEYS.productList({ featured: true, limit: 8 }),
    queryFn: () => productApi.getProducts({ featured: true, limit: 8 }),
    enabled: inView,
  });
  
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={staggerChildren}
      className="py-20 bg-white"
    >
      <div className="container-custom">
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Seleção especial dos nossos produtos mais procurados e bem avaliados
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            products?.products?.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>
        
        <motion.div variants={fadeInUp} className="text-center mt-12">
          <button className="btn-secondary px-8 py-3">
            Ver Todos os Produtos
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Best Sellers Section
function BestSellersSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={fadeInUp}
      className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mais Vendidos
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Os produtos que nossas clientes mais amam e recomendam
          </p>
        </div>
        
        {/* Best Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Seller */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 mr-2" />
              <span className="font-semibold">Mais Vendido</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Mega Hair Premium Loiro</h3>
            <p className="opacity-90 mb-4">
              Extensões de cabelo humano 100% natural, 50cm, cor loiro médio
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">€149,99</span>
                <span className="text-sm opacity-70 line-through ml-2">€199,99</span>
              </div>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Ver Produto
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">1.2k+</div>
              <div className="text-sm opacity-90">Vendidos este mês</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 fill-current mr-1" />
                <span className="text-2xl font-bold">4.9</span>
              </div>
              <div className="text-sm opacity-90">Avaliação média</div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// Promotions Banner
function PromotionsBanner() {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Promoções Especiais
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Até 40% de desconto em produtos selecionados. 
              Oferta por tempo limitado!
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Ver Promoções
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold mb-1">-40%</div>
              <div className="text-sm opacity-90">Extensões Clip</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold mb-1">-25%</div>
              <div className="text-sm opacity-90">Mega Hair</div>
            </div>
            <div className="bg-gradient-to-br from-pink-600 to-red-600 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold mb-1">-30%</div>
              <div className="text-sm opacity-90">Franjas</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold mb-1">Frete</div>
              <div className="text-sm opacity-90">Grátis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// New Arrivals Section
function NewArrivalsSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={fadeInUp}
      className="py-20 bg-gray-50"
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Novos Lançamentos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra as últimas tendências em extensões de cabelo e produtos de cuidado
          </p>
        </div>
        
        {/* New arrivals would be loaded here */}
      </div>
    </motion.section>
  );
}

// Features Section
function FeaturesSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Entrega Rápida',
      description: 'Entrega expressa em 24-48h para toda a Europa',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Qualidade Garantida',
      description: '100% cabelo humano natural com certificado de qualidade',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Suporte Especializado',
      description: 'Equipe de especialistas para orientação personalizada',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Satisfação Garantida',
      description: '30 dias para troca ou devolução sem complicações',
    },
  ];
  
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={staggerChildren}
      className="py-20 bg-white"
    >
      <div className="container-custom">
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por Que Escolher JC Hair Studio?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mais de 30 anos de experiência garantem qualidade e confiança em cada produto
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// Professional Section
function ProfessionalSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={fadeInUp}
      className="py-20 bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-purple-600 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Programa Profissional
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Descontos Especiais para Profissionais
            </h2>
            
            <p className="text-lg opacity-90 mb-8">
              Cadastre-se em nosso programa profissional e tenha acesso a descontos exclusivos, 
              condições especiais de pagamento e suporte técnico especializado.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Até 25% de desconto em todos os produtos</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Condições especiais de pagamento</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Suporte técnico especializado</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Acesso antecipado a novos produtos</span>
              </div>
            </div>
            
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Cadastrar-se como Profissional
            </button>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-800 rounded-2xl">
              {/* Professional showcase image would go here */}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// Skeleton Components
function HeroBannerSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-16 bg-gray-300 rounded w-96 mx-auto"></div>
        <div className="h-6 bg-gray-300 rounded w-64 mx-auto"></div>
        <div className="h-12 bg-gray-300 rounded w-32 mx-auto"></div>
      </div>
    </div>
  );
}