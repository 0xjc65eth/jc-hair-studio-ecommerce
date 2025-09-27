'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { getLegacyCompatibleProducts } from '@/lib/data/megaHairProducts';
import {
  Star,
  Shield,
  Award,
  Truck,
  CheckCircle,
  ArrowRight,
  Phone,
  WhatsApp,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  Heart
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  type: string;
  color: string;
  description: string;
  isNew?: boolean;
}

export default function ProfessionalHomepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar produtos reais
    const products = getLegacyCompatibleProducts();
    const featured = products.slice(0, 8); // Pegar os 8 primeiros produtos
    setFeaturedProducts(featured);
    setIsLoading(false);
  }, []);

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Cabelo Humano",
      description: "Garantia de qualidade premium"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "40+ Anos de Experiência",
      description: "Tradição familiar desde 1980"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Envio Rápido Europa",
      description: "Entrega em 3-5 dias úteis"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Aplicação Profissional",
      description: "Suporte técnico incluído"
    }
  ];

  const testimonials = [
    {
      name: "Sofia Costa",
      location: "Lisboa, Portugal",
      rating: 5,
      comment: "Qualidade excepcional! O mega hair ficou perfeito e parece meu próprio cabelo. Atendimento note 10!",
      image: "/images/testimonials/sofia.jpg"
    },
    {
      name: "Maria Ferreira",
      location: "Bruxelas, Bélgica",
      rating: 5,
      comment: "Finalmente encontrei produtos brasileiros autênticos na Europa. Entrega rápida e produto exatamente como esperado.",
      image: "/images/testimonials/maria.jpg"
    },
    {
      name: "Ana Silva",
      location: "Paris, França",
      rating: 5,
      comment: "Mega hair de qualidade superior. Durabilidade incrível e o resultado é simplesmente lindo. Recomendo!",
      image: "/images/testimonials/ana.jpg"
    }
  ];

  const stats = [
    { value: "2,847", label: "Clientes Satisfeitos", icon: <Users className="w-5 h-5" /> },
    { value: "40+", label: "Anos de Tradição", icon: <Award className="w-5 h-5" /> },
    { value: "15+", label: "Países Atendidos", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "4.9", label: "Avaliação Média", icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                <span className="text-sm font-medium">2.847+ clientes satisfeitos</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Mega Hair Premium
                  <span className="block text-yellow-400">100% Humano</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Transforme seu visual com extensões de cabelo de qualidade superior.
                  <strong className="text-white"> Tradição familiar de 40+ anos</strong>
                  levando beleza brasileira para toda Europa.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Cabelo 100% humano</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Frete grátis +€50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Garantia 30 dias</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Aplicação profissional</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/mega-hair">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-8 py-4 text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Ver Mega Hair
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/351928375226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-lg rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-700">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center text-yellow-400 mb-1">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/images/mega-hair-real/Cabelo 1A_ Liso escorrido, sem volume. Loiro platinado_.jpg"
                  alt="Mega Hair Premium - Loiro Platinado"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Floating Price Tag */}
                <div className="absolute bottom-4 left-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg">
                  <div className="text-sm text-gray-600">A partir de</div>
                  <div className="text-2xl font-bold">€85</div>
                </div>
              </div>

              {/* Floating Trust Badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="absolute top-1/2 -left-4 bg-yellow-500 text-black p-3 rounded-full shadow-lg">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="font-semibold">Mais Vendidos</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Nossos Produtos <span className="text-yellow-600">Premium</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra nossa seleção de mega hair de alta qualidade, escolhida por milhares de clientes europeus
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          NOVO
                        </span>
                      )}
                      {product.originalPrice > product.price && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Quick View */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-4">
                      <Button
                        variant="secondary"
                        className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                      >
                        Ver Produto
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                    </div>

                    <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      {product.originalPrice > product.price && (
                        <span className="text-gray-400 line-through text-sm">
                          €{product.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-gray-900">
                        €{product.price}
                      </span>
                    </div>

                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      <Heart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/mega-hair">
              <Button variant="outline" className="px-8 py-3 text-lg">
                Ver Todos os Produtos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que dizem nossos <span className="text-yellow-600">clientes</span>
            </h2>
            <p className="text-xl text-gray-600">
              Milhares de europeus já transformaram seus visuais conosco
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.comment}"
                </blockquote>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl">👩</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Precisa de <span className="text-yellow-400">ajuda?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Nossa equipe está pronta para ajudar você a escolher o produto perfeito.
                Atendimento em português, com especialistas em cabelo brasileiro.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">WhatsApp / Telefone</div>
                    <div className="text-green-400 font-bold">+351 928 375 226</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Horário de Atendimento</div>
                    <div className="text-gray-300">Segunda a Sexta: 09:00 - 18:00</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <a
                  href="https://wa.me/351928375226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors inline-flex items-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Falar no WhatsApp
                </a>
                <Link href="/contato">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                    Outras Formas de Contato
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📞</div>
                <h3 className="text-2xl font-bold mb-4">
                  Consultoria Gratuita
                </h3>
                <p className="text-yellow-100 mb-6">
                  Fale com nossos especialistas e descubra qual mega hair é perfeito para você
                </p>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="font-bold text-lg">Resposta em até</div>
                  <div className="text-3xl font-bold">15 minutos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}