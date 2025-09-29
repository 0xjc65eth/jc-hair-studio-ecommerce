'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import VideoHeroCarousel from './VideoHeroCarousel';
import {
  BrazilianHeader,
  BrazilianProductCard,
  SecurityBadges,
  BrazilianTestimonials,
  ProfessionalContact,
  BrazilianStats
} from '../ui/BrazilianComponents';
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  Award,
  CheckCircle,
  Heart,
  Sparkles,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  trending?: boolean;
  bestseller?: boolean;
}

export default function BrazilianHomepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Simulated featured products
  useEffect(() => {
    const products: Product[] = [
      {
        id: 'progressiva-vogue-1l',
        name: 'Progressiva Vogue Original 1L',
        price: 89.99,
        originalPrice: 119.90,
        image: '/images/products/progressiva-vogue/progressiva-vogue-1l.jpg',
        brand: 'Vogue',
        rating: 4.9,
        reviews: 324,
        inStock: true,
        bestseller: true
      },
      {
        id: 'mega-hair-60cm',
        name: 'Mega Hair Brasileiro 60cm - Castanho',
        price: 185.00,
        originalPrice: 235.00,
        image: '/images/products/mega-hair/mega-hair-60cm-castanho.jpg',
        brand: 'JC Hair',
        rating: 4.8,
        reviews: 189,
        inStock: true,
        trending: true
      },
      {
        id: 'base-mari-maria',
        name: 'Base Mari Maria Makeup - Natural',
        price: 45.90,
        image: '/images/products/mari-maria/base-mari-maria-natural.jpg',
        brand: 'Mari Maria',
        rating: 4.7,
        reviews: 156,
        inStock: true
      },
      {
        id: 'btx-portier',
        name: 'BTX Capilar Portier Matizador 1kg',
        price: 125.00,
        originalPrice: 165.00,
        image: '/images/products/btx-portier/btx-matizador-1kg.jpg',
        brand: 'Portier',
        rating: 4.9,
        reviews: 267,
        inStock: true,
        trending: true
      }
    ];
    setFeaturedProducts(products);
  }, []);

  const testimonials = [
    {
      text: "Produtos autênticos brasileiros! A progressiva Vogue deixou meu cabelo incrível, lisinho e brilhante por meses.",
      author: "Maria Silva",
      location: "Lisboa, Portugal",
      rating: 5,
      product: "Progressiva Vogue"
    },
    {
      text: "Mega hair brasileiro de qualidade excepcional. Parece meu próprio cabelo! Entrega super rápida para o Porto.",
      author: "Ana Costa",
      location: "Porto, Portugal",
      rating: 5,
      product: "Mega Hair 60cm"
    },
    {
      text: "Finalmente produtos brasileiros autênticos na Europa! Atendimento profissional, produtos originais.",
      author: "Carla Ferreira",
      location: "Bruxelas, Bélgica",
      rating: 5,
      product: "Maquiagem Mari Maria"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen">
      {/* Video Hero Carousel */}
      <VideoHeroCarousel
        videos={[
          {
            src: '/videos/hero-video-1.mp4',
            title: 'Beleza Premium Brasileira',
            subtitle: 'Os melhores produtos capilares e cosméticos do Brasil para toda a Europa',
            cta: 'Explorar Produtos',
            ctaLink: '/produtos'
          },
          {
            src: '/videos/hero-video-2.mp4',
            title: 'Transforme seu Visual',
            subtitle: 'Cosméticos profissionais e produtos de mega hair de alta qualidade',
            cta: 'Ver Catálogo',
            ctaLink: '/catalogo-brasileiro'
          }
        ]}
      />

      {/* Hero Section Brasileiro */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Brazilian Colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-800"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 left-16 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
        </div>

        <div className="relative z-10 container-custom text-center text-white py-20">
          {/* Brazilian Badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-6 py-3 mb-8">
            <span className="text-3xl">🇧🇷</span>
            <div className="text-left">
              <div className="font-bold text-yellow-300">Autêntico do Brasil</div>
              <div className="text-green-100 text-sm">Tradição familiar desde 1980</div>
            </div>
          </div>

          {/* Main Headlines */}
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
            Produtos Capilares
            <span className="block text-yellow-300">Brasileiros Premium</span>
          </h1>

          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Mega Hair 100% natural, progressivas profissionais e maquiagem brasileira autêntica.
            <strong className="text-yellow-300"> Entregamos em toda a Europa</strong> com a mesma qualidade de 40+ anos de tradição.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span><strong>4.9/5</strong> • +2.847 clientes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
              <Truck className="w-4 h-4 text-green-300" />
              <span>Frete <strong>GRÁTIS</strong> +€50</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-blue-300" />
              <span><strong>Pagamento</strong> 100% seguro</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span><strong>Garantia</strong> 30 dias</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/produtos">
              <Button className="btn-brasil text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                Ver Produtos Brasileiros
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/mega-hair">
              <Button
                variant="outline"
                className="btn-professional text-lg px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Mega Hair Brasileiro
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-white/5 backdrop-blur rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">40+</div>
              <div className="text-green-100 text-sm">Anos de Experiência</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">15+</div>
              <div className="text-green-100 text-sm">Países na Europa</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">2.847</div>
              <div className="text-green-100 text-sm">Clientes Satisfeitos</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">98%</div>
              <div className="text-green-100 text-sm">Recomendariam</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <SecurityBadges />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-2 mb-4">
              <span>🏆</span>
              <span className="font-semibold">Mais Vendidos</span>
            </div>
            <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
              Produtos <span className="text-brasil">Brasileiros</span> em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seleção especial dos produtos mais amados pelos nossos clientes europeus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <BrazilianProductCard
                key={product.id}
                {...product}
                authentic={true}
                onClick={() => {
                  // Track product click
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'select_item', {
                      item_id: product.id,
                      item_name: product.name,
                      item_category: 'Featured Products',
                      item_brand: product.brand,
                      value: product.price
                    });
                  }
                  // Navigate to product page
                  window.location.href = `/produto/${product.id}`;
                }}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/produtos">
              <Button className="btn-professional text-lg px-8 py-4">
                Ver Todos os Produtos Brasileiros
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
              Categorias <span className="text-brasil">Profissionais</span>
            </h2>
            <p className="text-xl text-gray-600">
              Especializados em produtos capilares e maquiagem brasileira
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mega Hair Category */}
            <Link href="/mega-hair" className="group">
              <div className="professional-card h-80 relative overflow-hidden">
                <Image
                  src="/images/categories/mega-hair-category.jpg"
                  alt="Mega Hair Brasileiro"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="brasil-badge mb-3">Premium</div>
                  <h3 className="text-2xl font-playfair font-bold mb-2">Mega Hair</h3>
                  <p className="text-gray-200 mb-4">100% cabelo humano brasileiro</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span>A partir de</span>
                    <span className="text-yellow-400 font-bold text-lg">€85</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Progressivas Category */}
            <Link href="/categoria/progressivas-alisamentos" className="group">
              <div className="professional-card h-80 relative overflow-hidden">
                <Image
                  src="/images/categories/progressivas-category.jpg"
                  alt="Progressivas Brasileiras"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
                    Profissional
                  </div>
                  <h3 className="text-2xl font-playfair font-bold mb-2">Progressivas</h3>
                  <p className="text-gray-200 mb-4">Vogue, Portier, BTX Capilar</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span>A partir de</span>
                    <span className="text-yellow-400 font-bold text-lg">€45</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Maquiagem Category */}
            <Link href="/maquiagens" className="group">
              <div className="professional-card h-80 relative overflow-hidden">
                <Image
                  src="/images/categories/maquiagem-category.jpg"
                  alt="Maquiagem Brasileira"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
                    Trending
                  </div>
                  <h3 className="text-2xl font-playfair font-bold mb-2">Maquiagem</h3>
                  <p className="text-gray-200 mb-4">Mari Maria, Ruby Rose, QDB</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span>A partir de</span>
                    <span className="text-yellow-400 font-bold text-lg">€25</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              O que dizem nossos <span className="text-yellow-300">clientes</span>
            </h2>
            <p className="text-green-100 text-lg">
              Milhares de europeus já experimentaram a qualidade brasileira
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl font-light mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-xl">👩</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg">{testimonials[currentTestimonial].author}</div>
                  <div className="text-green-200 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {testimonials[currentTestimonial].location}
                  </div>
                </div>
                <div className="bg-green-800/50 rounded-lg px-3 py-2 ml-4">
                  <div className="text-xs text-green-200">Produto</div>
                  <div className="font-semibold text-yellow-300 text-sm">
                    {testimonials[currentTestimonial].product}
                  </div>
                </div>
              </div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-yellow-400'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brazilian Stats */}
      <BrazilianStats />

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-600 rounded-full px-4 py-2 mb-6">
                <span>🇧🇷</span>
                <span className="font-semibold">Atendimento Brasileiro</span>
              </div>

              <h2 className="text-4xl font-playfair font-bold mb-6">
                Dúvidas? Fale conosco em <span className="text-green-400">português</span>
              </h2>

              <p className="text-xl text-gray-300 mb-8">
                Nossa equipe brasileira está pronta para ajudar você a escolher os melhores produtos
                para o seu tipo de cabelo e estilo.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">WhatsApp / Telefone</div>
                    <div className="text-green-400 font-bold">+351 928 375 226</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Atendemos toda Europa</div>
                    <div className="text-blue-400">Portugal • Espanha • França • Bélgica • +11 países</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Localização</div>
                    <div className="text-purple-400">Seixal, Portugal</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/contato">
                  <Button className="btn-professional">
                    Falar Conosco
                  </Button>
                </Link>
                <a
                  href="https://wa.me/351928375226"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white">
                    <span className="mr-2">💬</span>
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16"></div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <span className="text-6xl">🇧🇷</span>
                  <h3 className="text-2xl font-playfair font-bold mt-4 mb-2">
                    Horário de Atendimento
                  </h3>
                  <p className="text-green-100">Horário de Portugal (GMT)</p>
                </div>

                <div className="space-y-3 text-center">
                  <div className="bg-green-700/50 rounded-lg p-3">
                    <div className="font-semibold">Segunda a Sexta</div>
                    <div className="text-yellow-300">09:00 - 18:00</div>
                  </div>
                  <div className="bg-green-700/50 rounded-lg p-3">
                    <div className="font-semibold">Sábado</div>
                    <div className="text-yellow-300">10:00 - 14:00</div>
                  </div>
                  <div className="bg-green-700/50 rounded-lg p-3">
                    <div className="font-semibold">WhatsApp 24h</div>
                    <div className="text-green-300">Resposta em até 2h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}