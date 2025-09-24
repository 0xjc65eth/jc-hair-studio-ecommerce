import { Metadata } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { ProductSnippets, BreadcrumbSnippets, type Product } from '../../components/seo/RichSnippets';

const availableProducts: Product[] = [
  {
    name: 'Mega Hair Brasileiro Liso 60cm',
    brand: 'JC Hair Studio\'s 62',
    category: 'Mega Hair',
    description: 'Cabelo humano brasileiro 100% natural, liso, 60cm',
    image: '/images/products/mega-hair-liso-60cm.jpg',
    price: 299.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'MH-BR-L60'
  },
  {
    name: 'Mega Hair Brasileiro Ondulado 50cm',
    brand: 'JC Hair Studio\'s 62',
    category: 'Mega Hair',
    description: 'Cabelo humano brasileiro ondulado natural, 50cm',
    image: '/images/products/mega-hair-ondulado-50cm.jpg',
    price: 279.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'MH-BR-O50'
  },
  {
    name: 'Perfume Lily O Boticário',
    brand: 'O Boticário',
    category: 'Perfumes Femininos',
    description: 'Fragrância floral sofisticada com notas de lírio e jasmim',
    image: '/images/products/perfume-lily.jpg',
    price: 45.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'PERF-LILY-50ML'
  },
  {
    name: 'Perfume Malbec O Boticário',
    brand: 'O Boticário',
    category: 'Perfumes Masculinos',
    description: 'Amadeirado sofisticado inspirado no vinho argentino',
    image: '/images/products/perfume-malbec.jpg',
    price: 52.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'PERF-MALBEC-100ML'
  },
  {
    name: 'Sabonete Granado Glicerina',
    brand: 'Granado',
    category: 'Cuidados Corporais',
    description: 'Sabonete tradicional de glicerina desde 1870',
    image: '/images/products/sabonete-granado.jpg',
    price: 8.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'SAB-GRAN-GLIC'
  },
  {
    name: 'Progressiva Brasileira Premium',
    brand: 'JC Hair Studio\'s 62',
    category: 'Tratamentos Capilares',
    description: 'Tratamento alisante profissional com queratina brasileira',
    image: '/images/products/progressiva-brasileira.jpg',
    price: 89.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'PROG-BR-PREM'
  }
];

const productFeatures = {
  'Mega Hair': ['Comprimento', 'Textura', 'Origem', 'Durabilidade', 'Cor', 'Manutenção'],
  'Perfumes Femininos': ['Fragrância', 'Duração', 'Volume', 'Concentração', 'Fixação', 'Ocasião'],
  'Perfumes Masculinos': ['Fragrância', 'Duração', 'Volume', 'Concentração', 'Fixação', 'Ocasião'],
  'Cuidados Corporais': ['Tipo', 'Ingredientes', 'Pele', 'Fragrância', 'Tradição', 'pH'],
  'Tratamentos Capilares': ['Tipo', 'Duração', 'Ingredientes', 'Cabelos', 'Resultado', 'Aplicação']
};

const productDetails = {
  'MH-BR-L60': {
    'Comprimento': '60cm',
    'Textura': 'Liso Natural',
    'Origem': '100% Brasileiro',
    'Durabilidade': '12-18 meses',
    'Cor': 'Variadas',
    'Manutenção': 'Baixa'
  },
  'MH-BR-O50': {
    'Comprimento': '50cm',
    'Textura': 'Ondulado Natural',
    'Origem': '100% Brasileiro',
    'Durabilidade': '10-15 meses',
    'Cor': 'Variadas',
    'Manutenção': 'Média'
  },
  'PERF-LILY-50ML': {
    'Fragrância': 'Floral Sofisticada',
    'Duração': '6-8 horas',
    'Volume': '50ml',
    'Concentração': 'Eau de Parfum',
    'Fixação': 'Longa',
    'Ocasião': 'Dia/Noite'
  },
  'PERF-MALBEC-100ML': {
    'Fragrância': 'Amadeirada',
    'Duração': '8-10 horas',
    'Volume': '100ml',
    'Concentração': 'Eau de Parfum',
    'Fixação': 'Muito Longa',
    'Ocasião': 'Noite/Especial'
  },
  'SAB-GRAN-GLIC': {
    'Tipo': 'Glicerina',
    'Ingredientes': '100% Naturais',
    'Pele': 'Todos os tipos',
    'Fragrância': 'Clássica',
    'Tradição': '154 anos',
    'pH': 'Neutro'
  },
  'PROG-BR-PREM': {
    'Tipo': 'Alisamento',
    'Duração': '4-6 meses',
    'Ingredientes': 'Queratina Brasileira',
    'Cabelos': 'Cacheados/Crespos',
    'Resultado': 'Liso Natural',
    'Aplicação': 'Profissional'
  }
};

const breadcrumbs = [
  { name: 'Início', url: 'https://jc-hair-studio.vercel.app/' },
  { name: 'Produtos', url: 'https://jc-hair-studio.vercel.app/produtos' },
  { name: 'Comparar Produtos', url: 'https://jc-hair-studio.vercel.app/comparar-produtos' }
];

export const metadata: Metadata = {
  title: 'Comparar Produtos Brasileiros | Mega Hair, Perfumes, Cosméticos',
  description: 'Compare produtos brasileiros premium: mega hair, perfumes O Boticário, produtos Granado e tratamentos capilares. Encontre o produto ideal para você.',
  keywords: 'comparar produtos brasileiros, mega hair comparação, perfumes O Boticário, produtos Granado, cosméticos brasileiros, JC Hair Studio',
  openGraph: {
    title: 'Comparador de Produtos Brasileiros Premium',
    description: 'Ferramenta completa para comparar produtos brasileiros de beleza e cuidados pessoais.',
    type: 'website',
    url: 'https://jc-hair-studio.vercel.app/comparar-produtos',
    images: [
      {
        url: '/images/comparison-tool.jpg',
        width: 1200,
        height: 630,
        alt: 'Comparador de Produtos Brasileiros'
      }
    ]
  },
  alternates: {
    canonical: 'https://jc-hair-studio.vercel.app/comparar-produtos'
  }
};

export default function CompareProductsPage() {
  return (
    <>
      <BreadcrumbSnippets breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Comparar Produtos Brasileiros
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Ferramenta completa para comparar produtos brasileiros premium.
                Encontre o produto ideal comparando características, preços e benefícios.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  💇‍♀️ Mega Hair
                </span>
                <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">
                  🌸 Perfumes
                </span>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                  🧼 Cosméticos
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  🇧🇷 100% Brasileiros
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Escolha a Categoria para Comparar
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Object.keys(productFeatures).map((category) => (
                <div key={category} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-center cursor-pointer group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {category.includes('Mega Hair') ? '💇‍♀️' :
                     category.includes('Femininos') ? '🌸' :
                     category.includes('Masculinos') ? '🍷' :
                     category.includes('Corporais') ? '🧼' : '💆‍♀️'}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{category}</h3>
                  <p className="text-sm text-gray-600">
                    {availableProducts.filter(p => p.category === category).length} produtos
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Comparisons */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Comparações Populares
            </h2>

            {/* Mega Hair Comparison */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6">
                <h3 className="text-2xl font-bold text-center">Mega Hair Brasileiro</h3>
                <p className="text-center opacity-90 mt-2">Liso vs Ondulado - Qual escolher?</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">Característica</th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700">Mega Hair Liso 60cm</th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700">Mega Hair Ondulado 50cm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productFeatures['Mega Hair'].map((feature, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{feature}</td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {productDetails['MH-BR-L60'][feature]}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {productDetails['MH-BR-O50'][feature]}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 font-bold text-blue-800">Preço</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600">€299.99</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600">€279.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 text-center">
                <Link
                  href="/mega-hair"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-pink-700 hover:to-purple-700 transition-all font-semibold"
                >
                  Ver Todos os Mega Hair
                </Link>
              </div>
            </div>

            {/* Perfumes Comparison */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <h3 className="text-2xl font-bold text-center">Perfumes O Boticário</h3>
                <p className="text-center opacity-90 mt-2">Lily vs Malbec - Feminino e Masculino</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">Característica</th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700">Lily (Feminino)</th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700">Malbec (Masculino)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productFeatures['Perfumes Femininos'].map((feature, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{feature}</td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {productDetails['PERF-LILY-50ML'][feature]}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {productDetails['PERF-MALBEC-100ML'][feature]}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-purple-50">
                      <td className="px-6 py-4 font-bold text-purple-800">Preço</td>
                      <td className="px-6 py-4 text-center font-bold text-purple-600">€45.99</td>
                      <td className="px-6 py-4 text-center font-bold text-purple-600">€52.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 text-center">
                <Link
                  href="/boticario-portugal"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                >
                  Ver Todos os Perfumes O Boticário
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Guide */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Como Escolher o Produto Ideal
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Define seu Objetivo</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Para alongamento: Mega Hair 60cm</li>
                  <li>• Para volume: Mega Hair Ondulado</li>
                  <li>• Para uso diário: Perfumes suaves</li>
                  <li>• Para ocasiões especiais: Fragrâncias intensas</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Considere o Orçamento</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Produtos Granado: €8-30 (entrada)</li>
                  <li>• Perfumes O Boticário: €45-55 (médio)</li>
                  <li>• Mega Hair: €280-300 (premium)</li>
                  <li>• Tratamentos: €90+ (profissional)</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-4">⏱️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Durabilidade</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Mega Hair: 10-18 meses</li>
                  <li>• Perfumes: 6-10 horas por aplicação</li>
                  <li>• Tratamentos: 4-6 meses</li>
                  <li>• Cosméticos: Uso contínuo</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🌿</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Naturalidade</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Granado: 100% natural (154 anos)</li>
                  <li>• O Boticário: 70% ingredientes naturais</li>
                  <li>• Mega Hair: 100% cabelo humano</li>
                  <li>• Todos produtos: Origem brasileira</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ainda com Dúvidas na Escolha?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Nossa equipe de especialistas em produtos brasileiros está pronta para ajudar
              você a encontrar exatamente o que precisa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contato"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center"
              >
                Consultoria Personalizada
                <span className="ml-2">💬</span>
              </Link>
              <Link
                href="/produtos"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center"
              >
                Ver Todos os Produtos
                <span className="ml-2">🛍️</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}