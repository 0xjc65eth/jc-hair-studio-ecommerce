import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { RichSnippets, Product, FAQ } from '@/components/seo/RichSnippets';

export const metadata: Metadata = {
  title: 'Mari Maria Makeup Portugal | Maquiagem Brasileira Premium | JC Hair Studio\'s 62',
  description: 'Mari Maria Makeup original em Portugal: batons, bases, sombras. Maquiagem brasileira premium com entrega em todo Portugal. Qualidade profissional.',
  keywords: 'mari maria makeup portugal, maquiagem brasileira portugal, batom mari maria, base mari maria portugal, cosmeticos brasileiros',
  openGraph: {
    title: 'Mari Maria Makeup Portugal - Maquiagem Brasileira Premium',
    description: 'Maquiagem Mari Maria original em Portugal. Batons, bases, sombras de qualidade profissional brasileira.',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'JC Hair Studio\'s 62',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mari Maria Makeup Portugal',
    description: 'Maquiagem brasileira premium Mari Maria em Portugal',
  },
  alternates: {
    canonical: 'https://jchairstudios62.xyz/mari-maria-makeup-portugal'
  }
};

const mariMariaProducts: Product[] = [
  {
    name: 'Batom Mari Maria Vermelho Clássico',
    brand: 'Mari Maria Makeup',
    category: 'Batons',
    description: 'Batom Mari Maria cor Vermelho Clássico - Longa duração, hidratante, cobertura uniforme',
    image: '/images/products/maquiagem/mari-maria-batom-vermelho.jpg',
    price: 19.99,
    currency: 'EUR',
    availability: 'InStock',
  },
  {
    name: 'Base Mari Maria Cobertura Total',
    brand: 'Mari Maria Makeup',
    category: 'Bases',
    description: 'Base Mari Maria Cobertura Total - 12h de duração, acabamento natural, múltiplos tons',
    image: '/images/products/maquiagem/mari-maria-base.jpg',
    price: 29.99,
    currency: 'EUR',
    availability: 'InStock',
  },
  {
    name: 'Paleta de Sombras Mari Maria Sunset',
    brand: 'Mari Maria Makeup',
    category: 'Sombras',
    description: 'Paleta Mari Maria Sunset - 12 cores vibrantes, alta pigmentação, longa duração',
    image: '/images/products/maquiagem/mari-maria-paleta-sunset.jpg',
    price: 34.99,
    currency: 'EUR',
    availability: 'InStock',
  },
  {
    name: 'Blush Mari Maria Pêssego Natural',
    brand: 'Mari Maria Makeup',
    category: 'Blush',
    description: 'Blush Mari Maria cor Pêssego Natural - Efeito natural, fácil aplicação, longa fixação',
    image: '/images/products/maquiagem/mari-maria-blush.jpg',
    price: 16.99,
    currency: 'EUR',
    availability: 'InStock',
  },
  {
    name: 'Máscara de Cílios Mari Maria Volume Extremo',
    brand: 'Mari Maria Makeup',
    category: 'Máscaras',
    description: 'Máscara Mari Maria Volume Extremo - 24h sem borrar, volume intenso, cílios definidos',
    image: '/images/products/maquiagem/mari-maria-mascara.jpg',
    price: 22.99,
    currency: 'EUR',
    availability: 'InStock',
  }
];

const faqs: FAQ[] = [
  {
    question: "A Mari Maria Makeup é uma marca brasileira original?",
    answer: "Sim, Mari Maria Makeup é uma marca 100% brasileira criada pela influencer Mari Maria. Todos os nossos produtos são originais e importados diretamente do Brasil."
  },
  {
    question: "Os produtos Mari Maria são adequados para pele portuguesa/europeia?",
    answer: "Absolutamente! A Mari Maria desenvolve produtos para todos os tipos e tons de pele, incluindo tons específicos para pele europeia."
  },
  {
    question: "Quanto tempo duram os produtos de maquiagem Mari Maria?",
    answer: "Os produtos Mari Maria são conhecidos pela longa duração: batons até 8h, bases até 12h, e máscaras de cílios até 24h sem retoques."
  },
  {
    question: "Fazem entrega de maquiagem em todo Portugal?",
    answer: "Sim, entregamos produtos Mari Maria em todo Portugal continental e ilhas, com embalagem segura para proteger os cosméticos."
  },
  {
    question: "Os produtos Mari Maria são testados em animais?",
    answer: "Não, a Mari Maria Makeup é uma marca cruelty-free, não testando seus produtos em animais e seguindo padrões éticos de produção."
  }
];

const productCategories = [
  {
    name: 'Batons',
    description: 'Cores vibrantes e hidratação intensa',
    products: ['Vermelho Clássico', 'Nude Rosado', 'Rosa Millennial', 'Coral Vibrante'],
    icon: '💋'
  },
  {
    name: 'Bases',
    description: 'Cobertura perfeita para todos os tons',
    products: ['Cobertura Total', 'Natural Matte', 'Hidratante', 'Anti-idade'],
    icon: '🎨'
  },
  {
    name: 'Sombras',
    description: 'Paletas exclusivas e cores únicas',
    products: ['Sunset', 'Oceano', 'Terra', 'Dourada'],
    icon: '✨'
  },
  {
    name: 'Blush & Contorno',
    description: 'Definição e cor natural',
    products: ['Pêssego Natural', 'Rosa Suave', 'Contorno Café', 'Iluminador'],
    icon: '🌸'
  }
];

export default function MariMariaMakeupPortugal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <RichSnippets
        type="product-collection"
        products={mariMariaProducts}
        faqs={faqs}
        breadcrumbs={[
          { name: 'Início', url: 'https://jchairstudios62.xyz' },
          { name: 'Maquiagem', url: 'https://jchairstudios62.xyz/maquiagem' },
          { name: 'Mari Maria Makeup Portugal', url: 'https://jchairstudios62.xyz/mari-maria-makeup-portugal' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Mari Maria Makeup Portugal
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Maquiagem Brasileira Premium | Qualidade Profissional | Entrega em Todo Portugal
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/produtos?categoria=maquiagem&marca=mari-maria"
                  className="bg-white text-rose-700 px-8 py-4 rounded-full font-semibold hover:bg-rose-50 transition-colors">
              Ver Toda Coleção
            </Link>
            <Link href="#produtos"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors">
              Produtos Destaque
            </Link>
          </div>
        </div>
      </section>

      {/* Produtos Destaque */}
      <section id="produtos" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Mari Maria Makeup - Mais Vendidos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mariMariaProducts.map((product, index) => (
              <div key={index} className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg shadow-lg flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">MM</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-rose-600">€{product.price}</span>
                  <Link href={`/produto/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-rose-700 transition-colors">
                    Comprar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias de Produtos */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Categorias Mari Maria Makeup
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-rose-700">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="space-y-1">
                  {category.products.map((product, productIndex) => (
                    <div key={productIndex} className="text-sm text-gray-700 bg-rose-50 rounded-full px-3 py-1 mb-2">
                      {product}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre a Marca */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Sobre Mari Maria Makeup
              </h2>
              <p className="text-gray-600 mb-4">
                Mari Maria Makeup nasceu da paixão da influencer brasileira Mari Maria pela maquiagem.
                Criada para mulheres que buscam qualidade, durabilidade e cores vibrantes.
              </p>
              <p className="text-gray-600 mb-6">
                Cada produto é desenvolvido com tecnologia brasileira de ponta, testado por
                profissionais e aprovado por milhares de mulheres em todo o Brasil.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-rose-50 rounded-lg">
                  <div className="text-2xl font-bold text-rose-600">100%</div>
                  <div className="text-sm text-gray-600">Cruelty Free</div>
                </div>
                <div className="text-center p-4 bg-rose-50 rounded-lg">
                  <div className="text-2xl font-bold text-rose-600">12h</div>
                  <div className="text-sm text-gray-600">Duração</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">MM</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Qualidade Brasileira</h3>
              <p className="text-gray-600">
                Produtos desenvolvidos especificamente para o clima tropical e
                adaptados para todos os tipos de pele.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Porquê Escolher Mari Maria Makeup?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Alta Pigmentação</h3>
              <p className="text-gray-600">Cores vibrantes com aplicação única</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Longa Duração</h3>
              <p className="text-gray-600">Até 12 horas sem retoques</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cruelty Free</h3>
              <p className="text-gray-600">Não testado em animais</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇧🇷</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Original</h3>
              <p className="text-gray-600">Importado diretamente do Brasil</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Perguntas Frequentes - Mari Maria Makeup
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-rose-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-rose-700">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Descubra a Maquiagem Brasileira Mais Amada
          </h2>
          <p className="text-xl mb-8">
            Mari Maria Makeup: qualidade profissional, cores únicas e durabilidade excepcional.
            Entrega rápida em todo Portugal.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/produtos?categoria=maquiagem&marca=mari-maria"
                  className="bg-white text-rose-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Ver Toda Coleção
            </Link>
            <Link href="/contato"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors">
              Consultoria Personalizada
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}