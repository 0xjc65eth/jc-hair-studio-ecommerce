'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import VideoHeroCarousel from './VideoHeroCarousel';
import { getLegacyCompatibleProducts } from '@/lib/data/megaHairProducts';
import {
  Star,
  ShoppingBag,
  ArrowRight,
  Phone,
  Truck,
  Shield,
  Award,
  Heart,
  Eye,
  Sparkles
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
  isNew?: boolean;
  inStock: boolean;
}

export default function BrazilianElegantHomepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const products = getLegacyCompatibleProducts();
    const featured = products.slice(0, 8); // 8 produtos em destaque
    setFeaturedProducts(featured);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Video Hero - Indispensável */}
      <VideoHeroCarousel
        videos={[
          {
            src: '/videos/hero-video-1.mp4',
            title: 'JC Hair Studio\'s 62',
            subtitle: 'Mega Hair Premium 100% Humano • Tradição de 40+ Anos',
            cta: 'Comprar Agora',
            ctaLink: '/mega-hair'
          },
          {
            src: '/videos/hero-video-2.mp4',
            title: 'Transforme seu Visual',
            subtitle: 'Extensões de Cabelo de Alta Qualidade para toda a Europa',
            cta: 'Ver Catálogo',
            ctaLink: '/produtos'
          }
        ]}
        autoplayInterval={6000}
      />

      {/* Produtos em Destaque - E-commerce Focus */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa seleção premium de mega hair mais vendidos
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
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

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 mb-2 block">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 block">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Stock Status */}
                  <div className="absolute bottom-3 left-3">
                    {product.inStock ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Em Stock
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                        Esgotado
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      €{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        €{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Link href={`/produto/${product.id}`}>
                    <Button
                      className="w-full bg-black text-white hover:bg-gray-800 py-2 font-medium"
                      disabled={!product.inStock}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {product.inStock ? 'Ver Produto' : 'Esgotado'}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/mega-hair">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 px-10 py-3 text-lg font-medium">
                Ver Todo o Catálogo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* E-commerce Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Envio Rápido</h3>
                <p className="text-sm text-gray-600">Entrega em toda Europa</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">100% Seguro</h3>
                <p className="text-sm text-gray-600">Pagamento protegido</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Qualidade Premium</h3>
                <p className="text-sm text-gray-600">100% cabelo humano</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">40+ Anos</h3>
                <p className="text-sm text-gray-600">Tradição e experiência</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Fale Conosco
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nossa equipe está pronta para ajudar você a encontrar o produto perfeito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://wa.me/351928375226"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
            <Link href="/contato">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-gray-400 px-8 py-3"
              >
                Outros Contatos
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-900 mb-2">🇵🇹 Portugal</div>
              <p className="text-gray-700 font-medium">+351 928 375 226</p>
              <p className="text-gray-600">Segunda a Sexta, 09:00 - 18:00</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-900 mb-2">🇧🇪 Bélgica</div>
              <p className="text-gray-700 font-medium">+32 472 384 027</p>
              <p className="text-gray-600">Atendimento personalizado</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}