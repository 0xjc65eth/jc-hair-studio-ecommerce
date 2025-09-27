import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { RichSnippets, Product, FAQ } from '@/components/seo/RichSnippets';

export const metadata: Metadata = {
  title: 'Esmaltes Impala Portugal | 58+ Cores Originais | JC Hair Studio\'s 62',
  description: 'Esmaltes Impala originais em Portugal: 58+ cores vibrantes, longa duração, secagem rápida. Entrega em todo Portugal. Qualidade brasileira premium.',
  keywords: 'esmaltes impala portugal, verniz unhas brasil, esmaltes brasileiros portugal, impala cosmeticos, verniz unhas colorido, esmaltes longa duracao',
  openGraph: {
    title: 'Esmaltes Impala Portugal - 58+ Cores Originais',
    description: 'Maior seleção de esmaltes Impala em Portugal. 58+ cores vibrantes, qualidade brasileira premium.',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'JC Hair Studio\'s 62',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Esmaltes Impala Portugal - 58+ Cores',
    description: '58+ cores de esmaltes Impala originais em Portugal',
  },
  alternates: {
    canonical: 'https://jchairstudios62.xyz/esmaltes-impala-portugal'
  }
};

const impalaProducts: Product[] = [
  {
    name: 'Esmalte Impala Vermelho Paixão',
    brand: 'Impala',
    category: 'Esmaltes',
    description: 'Esmalte Impala cor Vermelho Paixão - Secagem rápida, brilho intenso, longa duração',
    image: '/images/products/esmaltes/impala-vermelho-paixao.jpg',
    price: 4.99,
    currency: 'EUR',
    availability: 'InStock',
  },
  {
    name: 'Esmalte Impala Rosa Millennial',
    brand: 'Impala',
    category: 'Esmaltes',
    description: 'Esmalte Impala cor Rosa Millennial - Tendência 2024, cobertura uniforme',
    image: '/images/products/esmaltes/impala-rosa-millennial.jpg',
    price: 4.99,
    currency: 'EUR',
    availability: 'InStock',
  },
  {
    name: 'Esmalte Impala Azul Oceano',
    brand: 'Impala',
    category: 'Esmaltes',
    description: 'Esmalte Impala cor Azul Oceano - Cor vibrante, secagem em 3 minutos',
    image: '/images/products/esmaltes/impala-azul-oceano.jpg',
    price: 4.99,
    currency: 'EUR',
    availability: 'InStock',
  },
  {
    name: 'Esmalte Impala Nude Elegante',
    brand: 'Impala',
    category: 'Esmaltes',
    description: 'Esmalte Impala cor Nude Elegante - Perfeito para uso profissional e casual',
    image: '/images/products/esmaltes/impala-nude-elegante.jpg',
    price: 4.99,
    currency: 'EUR',
    availability: 'InStock',
  },
  {
    name: 'Esmalte Impala Preto Clássico',
    brand: 'Impala',
    category: 'Esmaltes',
    description: 'Esmalte Impala cor Preto Clássico - Cobertura perfeita, acabamento profissional',
    image: '/images/products/esmaltes/impala-preto-classico.jpg',
    price: 4.99,
    currency: 'EUR',
    availability: 'InStock',
  }
];

const faqs: FAQ[] = [
  {
    question: "Os esmaltes Impala são originais?",
    answer: "Sim, todos os nossos esmaltes Impala são 100% originais, importados diretamente do Brasil com certificado de autenticidade."
  },
  {
    question: "Quanto tempo dura o esmalte Impala?",
    answer: "Os esmaltes Impala têm durabilidade de 7-10 dias sem descascar, dependendo dos cuidados e atividades diárias."
  },
  {
    question: "Qual o tempo de secagem dos esmaltes Impala?",
    answer: "Os esmaltes Impala secam em aproximadamente 3-5 minutos, permitindo aplicação rápida e prática."
  },
  {
    question: "Fazem entrega em todo Portugal?",
    answer: "Sim, entregamos esmaltes Impala em todo Portugal continental e ilhas, com envio rápido e seguro."
  },
  {
    question: "Posso comprar esmaltes Impala em quantidade?",
    answer: "Sim, oferecemos descontos progressivos para compras de 5+ esmaltes Impala. Entre em contato para condições especiais."
  }
];

const colorCategories = [
  {
    name: 'Vermelhos Clássicos',
    colors: ['Vermelho Paixão', 'Cereja Intensa', 'Bordô Elegante', 'Coral Vibrante'],
    description: 'Tons clássicos de vermelho para todas as ocasiões'
  },
  {
    name: 'Rosas Modernos',
    colors: ['Rosa Millennial', 'Rosa Bebê', 'Pink Neon', 'Fúcsia Power'],
    description: 'Rosas contemporâneos e femininos'
  },
  {
    name: 'Azuis Únicos',
    colors: ['Azul Oceano', 'Azul Royal', 'Turquesa', 'Azul Petróleo'],
    description: 'Azuis especiais e diferenciados'
  },
  {
    name: 'Nudes Sofisticados',
    colors: ['Nude Elegante', 'Bege Rosado', 'Marrom Suave', 'Champagne'],
    description: 'Tons neutros para o dia a dia'
  },
  {
    name: 'Cores Ousadas',
    colors: ['Preto Clássico', 'Verde Esmeralda', 'Laranja Sunset', 'Roxo Místico'],
    description: 'Para quem gosta de ousar e se destacar'
  }
];

export default function EsmaltesImpalaPortugal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <RichSnippets
        type="product-collection"
        products={impalaProducts}
        faqs={faqs}
        breadcrumbs={[
          { name: 'Início', url: 'https://jchairstudios62.xyz' },
          { name: 'Cosméticos', url: 'https://jchairstudios62.xyz/cosmeticos' },
          { name: 'Esmaltes Impala Portugal', url: 'https://jchairstudios62.xyz/esmaltes-impala-portugal' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Esmaltes Impala Portugal
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            58+ Cores Vibrantes | Qualidade Brasileira Premium | Entrega em Todo Portugal
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/produtos?categoria=esmaltes"
                  className="bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 transition-colors">
              Ver Todos os Esmaltes
            </Link>
            <Link href="#colecoes"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors">
              Explorar Coleções
            </Link>
          </div>
        </div>
      </section>

      {/* Produtos Destaque */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Esmaltes Impala Mais Vendidos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impalaProducts.map((product, index) => (
              <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-600">€{product.price}</span>
                  <Link href={`/produto/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors">
                    Comprar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coleções de Cores */}
      <section id="colecoes" className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Coleções de Cores Impala
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colorCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"></div>
                      <span className="text-sm text-gray-700">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Porquê Escolher Impala */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Porquê Escolher Esmaltes Impala?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secagem Rápida</h3>
              <p className="text-gray-600">Seca em apenas 3-5 minutos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Brilho Intenso</h3>
              <p className="text-gray-600">Acabamento profissional garantido</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Longa Duração</h3>
              <p className="text-gray-600">Até 10 dias sem descascar</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇧🇷</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Original</h3>
              <p className="text-gray-600">Importado diretamente do Brasil</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Perguntas Frequentes - Esmaltes Impala
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Descubra a Coleção Completa Impala
          </h2>
          <p className="text-xl mb-8">
            58+ cores únicas para expressar sua personalidade. Entrega rápida em todo Portugal.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/produtos?categoria=esmaltes&marca=impala"
                  className="bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Ver Todos os 58 Esmaltes
            </Link>
            <Link href="/contato"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors">
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}