'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { getLegacyCompatibleProducts } from '@/lib/data/megaHairProducts';
import {
  Star,
  Shield,
  Truck,
  Phone,
  ArrowRight,
  Award
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
}

export default function CleanHomepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const products = getLegacyCompatibleProducts();
    const featured = products.slice(0, 6);
    setFeaturedProducts(featured);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean & Simple */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-5xl font-light text-gray-900 mb-4">
              JC Hair Studio's 62
            </h1>
            <p className="text-xl text-gray-600 font-light">
              Mega Hair Premium • 100% Cabelo Humano
            </p>
          </div>

          {/* Main CTA */}
          <div className="mb-16">
            <Link href="/mega-hair">
              <Button
                size="lg"
                className="bg-black text-white px-12 py-4 text-lg font-normal hover:bg-gray-800"
              >
                Ver Produtos
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Minimal */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>100% Humano</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>40+ Anos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Envio Europa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Clean Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-gray-600">
              Nossa seleção premium de mega hair
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                {/* Product Image */}
                <div className="aspect-[4/5] bg-white rounded-lg overflow-hidden mb-4 border border-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-normal text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-gray-400 fill-current' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-normal text-gray-900">
                      €{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        €{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All */}
          <div className="text-center mt-12">
            <Link href="/mega-hair">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-gray-400"
              >
                Ver Todos os Produtos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Clean */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-8">
            Tradição e Qualidade
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Com mais de 40 anos de experiência, oferecemos mega hair premium
            100% cabelo humano para toda a Europa. Cada peça é cuidadosamente
            selecionada para garantir qualidade superior e resultado natural.
          </p>

          {/* Stats - Clean */}
          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">2,847+</div>
              <div className="text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">40+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">15+</div>
              <div className="text-gray-600">Países Atendidos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Minimal */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-8">
            Entre em Contato
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nossa equipe está pronta para ajudar você a encontrar
            o produto perfeito para suas necessidades.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

          <div className="mt-8 text-gray-500">
            <p>+351 928 375 226</p>
            <p>Atendimento: Segunda a Sexta, 09:00 - 18:00</p>
          </div>
        </div>
      </section>
    </div>
  );
}