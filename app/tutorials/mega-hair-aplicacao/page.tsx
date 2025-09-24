import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { TutorialSnippets, BreadcrumbSnippets, type Tutorial, type Product } from '../../../components/seo/RichSnippets';

const tutorial: Tutorial = {
  name: 'Como Aplicar Mega Hair Brasileiro: Guia Completo Passo a Passo',
  description: 'Tutorial profissional completo de aplicação de mega hair brasileiro com técnicas utilizadas em salões premium. Aprenda desde a preparação até os cuidados pós-aplicação.',
  author: 'Júlio César - JC Hair Studio\'s 62',
  duration: 'PT45M',
  difficulty: 'Intermediate',
  category: 'Mega Hair e Extensões',
  datePublished: '2024-09-24',
  supplies: [
    'Mega Hair Brasileiro Premium',
    'Presilhas Profissionais',
    'Pente Separador',
    'Microesferas de Queratina',
    'Alicate de Aplicação',
    'Protetor Térmico',
    'Shampoo Preparatório'
  ],
  steps: [
    {
      name: 'Preparação dos Cabelos',
      text: 'Lave os cabelos com shampoo preparatório específico para mega hair. Seque completamente e aplique protetor térmico para proteger os fios naturais durante o processo.'
    },
    {
      name: 'Separação das Mechas',
      text: 'Divida o cabelo em seções horizontais de 1cm de largura, começando pela nuca. Use presilhas para manter as seções organizadas e facilitar a aplicação.'
    },
    {
      name: 'Preparação das Extensões',
      text: 'Selecione mechas de mega hair brasileiro compatíveis com a cor e textura natural. Certifique-se de que as microesferas estejam bem fixadas nas extensões.'
    },
    {
      name: 'Aplicação das Microesferas',
      text: 'Posicione a extensão próxima à raiz (2-3mm de distância) e passe uma pequena mecha natural pela microesfera junto com a extensão. Use o alicate para apertar firmemente.'
    },
    {
      name: 'Distribuição Uniforme',
      text: 'Continue aplicando as extensões de forma uniforme, mantendo distância regular entre cada aplicação. Evite aplicar muito próximo às orelhas e testa.'
    },
    {
      name: 'Corte e Finalização',
      text: 'Após aplicar todas as extensões, faça o corte para uniformizar com o cabelo natural. Finalize com escova e modelador para um resultado profissional.'
    }
  ]
};

const relatedProducts: Product[] = [
  {
    name: 'Mega Hair Brasileiro Liso 60cm',
    brand: 'JC Hair Studio\'s 62',
    category: 'Mega Hair',
    description: 'Cabelo humano brasileiro 100% natural, liso, 60cm de comprimento',
    image: '/images/products/mega-hair-liso-60cm.jpg',
    price: 299.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'MH-BR-L60-001'
  },
  {
    name: 'Kit Aplicação Profissional',
    brand: 'JC Hair Studio\'s 62',
    category: 'Ferramentas',
    description: 'Kit completo com alicate, microesferas e acessórios para aplicação de mega hair',
    image: '/images/products/kit-aplicacao.jpg',
    price: 89.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'KIT-APL-001'
  }
];

const breadcrumbs = [
  { name: 'Início', url: 'https://jc-hair-studio.vercel.app/' },
  { name: 'Tutoriais', url: 'https://jc-hair-studio.vercel.app/tutorials' },
  { name: 'Mega Hair', url: 'https://jc-hair-studio.vercel.app/tutorials/mega-hair' },
  { name: 'Aplicação Mega Hair', url: 'https://jc-hair-studio.vercel.app/tutorials/mega-hair-aplicacao' }
];

export const metadata: Metadata = {
  title: 'Como Aplicar Mega Hair Brasileiro: Tutorial Profissional Completo',
  description: 'Tutorial passo a passo de aplicação de mega hair brasileiro. Técnicas profissionais, dicas de especialista e cuidados essenciais. Guia completo 45min.',
  keywords: 'como aplicar mega hair, tutorial mega hair brasileiro, aplicação mega hair profissional, extensões brasileiras, JC Hair Studio, mega hair passo a passo',
  openGraph: {
    title: 'Tutorial: Como Aplicar Mega Hair Brasileiro Profissional',
    description: 'Guia completo de aplicação de mega hair brasileiro com técnicas profissionais. 6 passos detalhados + dicas de especialista.',
    type: 'article',
    url: 'https://jc-hair-studio.vercel.app/tutorials/mega-hair-aplicacao',
    images: [
      {
        url: '/images/tutorials/mega-hair-aplicacao-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Tutorial Aplicação Mega Hair Brasileiro Profissional'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tutorial: Aplicação Mega Hair Brasileiro Profissional',
    description: 'Guia passo a passo completo com técnicas profissionais de aplicação.',
    images: ['/images/tutorials/mega-hair-aplicacao-hero.jpg']
  },
  alternates: {
    canonical: 'https://jc-hair-studio.vercel.app/tutorials/mega-hair-aplicacao'
  }
};

export default function MegaHairTutorialPage() {
  return (
    <>
      <TutorialSnippets tutorial={tutorial} relatedProducts={relatedProducts} />
      <BreadcrumbSnippets breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center gap-2 mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Tutorial Profissional
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  45 minutos
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Nível Intermediário
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
                Como Aplicar Mega Hair Brasileiro
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Tutorial profissional completo com técnicas utilizadas em salões premium.
                Aprenda desde a preparação até os cuidados pós-aplicação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">6</div>
                  <div className="text-sm text-gray-600">Etapas Detalhadas</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600">45min</div>
                  <div className="text-sm text-gray-600">Duração Total</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">7</div>
                  <div className="text-sm text-gray-600">Materiais Necessários</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Materials Section */}
        <section className="py-12 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Materiais Necessários
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tutorial.supplies?.map((supply, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-lg flex items-center">
                  <span className="text-2xl mr-4">
                    {supply.includes('Mega Hair') ? '💇‍♀️' :
                     supply.includes('Presilhas') ? '📎' :
                     supply.includes('Pente') ? '✂️' :
                     supply.includes('Microesferas') ? '⚪' :
                     supply.includes('Alicate') ? '🔧' :
                     supply.includes('Protetor') ? '🛡️' : '🧴'}
                  </span>
                  <span className="font-medium text-gray-800">{supply}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Passo a Passo Detalhado
            </h2>
            <div className="space-y-12">
              {tutorial.steps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-8">
                      <div className="text-center text-white">
                        <div className="text-4xl font-bold mb-2">Etapa {index + 1}</div>
                        <div className="text-xl font-medium">{step.name}</div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.name}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{step.text}</p>
                      <div className="mt-6">
                        <div className="flex items-center text-sm text-purple-600 font-medium">
                          <span className="mr-2">💡</span>
                          Dica profissional para esta etapa
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Produtos Recomendados
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <div className="text-6xl">
                      {product.category === 'Mega Hair' ? '💇‍♀️' : '🔧'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">€{product.price}</span>
                      <Link
                        href="/produtos"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                      >
                        Ver Produto
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Dicas Profissionais Extras
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-800 mb-3">Faça Sempre</h3>
                <ul className="text-green-700 space-y-2">
                  <li>• Teste a cor em luz natural antes da aplicação</li>
                  <li>• Mantenha distância de 2-3mm da raiz</li>
                  <li>• Aplique protetor térmico antes de qualquer processo</li>
                  <li>• Use produtos específicos para mega hair</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-6">
                <div className="text-3xl mb-4">❌</div>
                <h3 className="text-xl font-bold text-red-800 mb-3">Evite Sempre</h3>
                <ul className="text-red-700 space-y-2">
                  <li>• Aplicar em cabelos molhados ou úmidos</li>
                  <li>• Apertar demais as microesferas</li>
                  <li>• Aplicar muito próximo às orelhas</li>
                  <li>• Usar calor excessivo durante a finalização</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Precisa de Mais Ajuda?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Nossa equipe está pronta para orientar você em qualquer etapa do processo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/produtos"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center"
              >
                Ver Produtos Mega Hair
                <span className="ml-2">💇‍♀️</span>
              </Link>
              <Link
                href="/contato"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transition-all inline-flex items-center justify-center"
              >
                Falar com Especialista
                <span className="ml-2">💬</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}