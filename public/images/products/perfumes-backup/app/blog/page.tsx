import { Metadata } from 'next';
import Link from 'next/link';
import { ProductImage } from '@/components/seo/OptimizedImage';

export const metadata: Metadata = {
  title: 'Blog Beleza Brasileira | Dicas, Tutoriais e Tendências | JC Hair Studio\'s 62',
  description: 'Blog sobre beleza brasileira com dicas exclusivas, tutoriais de aplicação, tendências e segredos dos produtos capilares e cosméticos brasileiros. Conteúdo expert para Europa.',
  keywords: [
    'blog beleza brasileira',
    'dicas skincare brasileiro',
    'tutorial mega hair',
    'como usar progressiva',
    'rotina beleza brasileira',
    'tendências brasil europa',
    'cuidados cabelo brasileiro',
    'maquiagem brasileira dicas',
    'perfumes brasileiros guia',
    'autocuidado brasileiro'
  ],
  openGraph: {
    title: 'Blog Beleza Brasileira | Dicas e Tutoriais Exclusivos',
    description: 'Conteúdo exclusivo sobre beleza brasileira: tutoriais, dicas e segredos dos produtos que conquistaram a Europa.',
    type: 'website'
  }
};

// Artigos destacados do blog
const featuredPosts = [
  {
    id: 'mega-hair-brasileiro-guia-completo',
    title: 'Mega Hair Brasileiro: Guia Completo 2024',
    excerpt: 'Tudo que você precisa saber sobre mega hair brasileiro: tipos, aplicação, cuidados e onde comprar na Europa.',
    image: '/images/blog/mega-hair-guia-completo.jpg',
    category: 'Cabelos',
    readTime: '12 min',
    author: 'Julio César',
    date: '2024-01-15',
    tags: ['mega hair', 'cabelo brasileiro', 'tutorial'],
    featured: true
  },
  {
    id: 'progressiva-vogue-ou-btx',
    title: 'Progressiva Vogue ou BTX Capilar: Qual Escolher?',
    excerpt: 'Comparação completa entre progressiva e BTX capilar brasileiro. Descubra qual é melhor para seu tipo de cabelo.',
    image: '/images/blog/progressiva-vs-btx.jpg',
    category: 'Tratamentos',
    readTime: '8 min',
    author: 'Julio César',
    date: '2024-01-12',
    tags: ['progressiva', 'btx capilar', 'comparação']
  },
  {
    id: 'skincare-brasileiro-rotina',
    title: 'Rotina Skincare Brasileira para Pele Europeia',
    excerpt: 'Como adaptar a rotina skincare brasileira para o clima europeu. Produtos e dicas exclusivas.',
    image: '/images/blog/skincare-rotina-europea.jpg',
    category: 'Skincare',
    readTime: '10 min',
    author: 'Especialista Sallve',
    date: '2024-01-10',
    tags: ['skincare', 'rotina', 'clima europeu']
  },
  {
    id: 'perfumes-brasileiros-europa',
    title: 'Os 10 Perfumes Brasileiros Mais Procurados na Europa',
    excerpt: 'Ranking dos perfumes brasileiros que estão conquistando Portugal, Espanha, França e outros países europeus.',
    image: '/images/blog/perfumes-ranking-europa.jpg',
    category: 'Perfumaria',
    readTime: '6 min',
    author: 'Consultora Natura',
    date: '2024-01-08',
    tags: ['perfumes', 'ranking', 'europa']
  },
  {
    id: 'maquiagem-brasileira-tendencias',
    title: 'Tendências Maquiagem Brasileira 2024',
    excerpt: 'As maiores tendências da maquiagem brasileira que estão dominando a Europa em 2024.',
    image: '/images/blog/maquiagem-tendencias-2024.jpg',
    category: 'Maquiagem',
    readTime: '7 min',
    author: 'Makeup Artist Ruby Rose',
    date: '2024-01-05',
    tags: ['maquiagem', 'tendências', '2024']
  },
  {
    id: 'ingredientes-amazonicos-beleza',
    title: 'Ingredientes Amazônicos que Revolucionaram a Beleza',
    excerpt: 'Conheça os ingredientes da Amazônia que estão transformando a indústria da beleza mundial.',
    image: '/images/blog/ingredientes-amazonicos.jpg',
    category: 'Ingredientes',
    readTime: '9 min',
    author: 'Pesquisador Natura',
    date: '2024-01-03',
    tags: ['amazônia', 'ingredientes', 'sustentabilidade']
  }
];

const categories = [
  { name: 'Todos', slug: 'todos', count: featuredPosts.length },
  { name: 'Cabelos', slug: 'cabelos', count: 1 },
  { name: 'Tratamentos', slug: 'tratamentos', count: 1 },
  { name: 'Skincare', slug: 'skincare', count: 1 },
  { name: 'Perfumaria', slug: 'perfumaria', count: 1 },
  { name: 'Maquiagem', slug: 'maquiagem', count: 1 },
  { name: 'Ingredientes', slug: 'ingredientes', count: 1 }
];

export default function BlogPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Blog Beleza Brasileira | JC Hair Studio\'s 62',
            description: 'Blog especializado em beleza brasileira com dicas, tutoriais e tendências para Europa',
            url: 'https://jchairstudios62.xyz/blog',
            publisher: {
              '@type': 'Organization',
              name: "JC Hair Studio's 62",
              logo: {
                '@type': 'ImageObject',
                url: 'https://jchairstudios62.xyz/logo-brasil.png'
              }
            },
            mainEntity: featuredPosts.map(post => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              url: `https://jchairstudios62.xyz/blog/${post.id}`,
              datePublished: post.date,
              author: {
                '@type': 'Person',
                name: post.author
              },
              image: `https://jchairstudios62.xyz${post.image}`,
              category: post.category,
              keywords: post.tags.join(', ')
            }))
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🇧🇷 Conteúdo Exclusivo Brasileiro
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">Beleza</span><br />
                Brasileira
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Dicas exclusivas, tutoriais detalhados e segredos dos produtos brasileiros
                que estão conquistando a Europa. <strong>Conteúdo expert com +40 anos de experiência</strong>.
              </p>
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    category.slug === 'todos'
                      ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-amber-100 hover:text-amber-800'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Artigo em Destaque</h2>
            </div>

            {featuredPosts.filter(post => post.featured).map((post) => (
              <div key={post.id} className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-[4/3] lg:aspect-square">
                    <ProductImage
                      src={post.image}
                      productName={post.title}
                      category="Blog Post"
                      brand="JC Hair Studio's 62"
                      className="absolute inset-0"
                      fill
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-gradient-to-r from-amber-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        ⭐ Destaque
                      </span>
                    </div>
                  </div>

                  <div className="p-8 lg:p-12">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm">{post.readTime} de leitura</span>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{post.author}</div>
                          <div className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString('pt-PT')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-block bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-red-700 transition-all duration-300 shadow-lg"
                    >
                      Ler Artigo Completo →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Posts Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Últimos Artigos
              </h2>
              <p className="text-xl text-gray-600">
                Conteúdo sempre atualizado com as novidades da beleza brasileira
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.filter(post => !post.featured).map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative aspect-[4/3]">
                    <ProductImage
                      src={post.image}
                      productName={post.title}
                      category="Blog Post"
                      brand="JC Hair Studio's 62"
                      className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                      fill
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.author} • {new Date(post.date).toLocaleDateString('pt-PT')}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-block bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-all duration-300"
                    >
                      Ler Mais →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-white border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-600 hover:text-white transition-all duration-300">
                Carregar Mais Artigos
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600 to-red-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                📧 Newsletter Beleza Brasileira
              </h2>
              <p className="text-xl text-amber-100 mb-8 leading-relaxed">
                Receba dicas exclusivas, lançamentos e promoções especiais
                diretamente no seu email. <strong>Conteúdo VIP só para assinantes!</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
                <button className="bg-white text-amber-600 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition-colors">
                  Inscrever
                </button>
              </div>

              <div className="mt-6 text-amber-200 text-sm">
                ✨ Mais de 10.000 brasileiras na Europa já recebem nossas dicas
              </div>
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Tópicos em Alta
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  topic: 'Mega Hair Brasileiro',
                  description: 'Guias completos sobre aplicação, cuidados e escolha do mega hair ideal',
                  articles: 15,
                  icon: '💇‍♀️',
                  color: 'from-pink-500 to-purple-500'
                },
                {
                  topic: 'Progressivas & BTX',
                  description: 'Tudo sobre alisamentos e tratamentos capilares brasileiros premium',
                  articles: 12,
                  icon: '✨',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  topic: 'Skincare Natural',
                  description: 'Rotinas e produtos com ingredientes únicos da flora brasileira',
                  articles: 18,
                  icon: '🌿',
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  topic: 'Perfumes Exclusivos',
                  description: 'Fragrâncias brasileiras e essências amazônicas que conquistam a Europa',
                  articles: 10,
                  icon: '🌸',
                  color: 'from-amber-500 to-orange-500'
                }
              ].map((topic, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className={`w-16 h-16 bg-gradient-to-r ${topic.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {topic.icon}
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {topic.topic}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {topic.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {topic.articles} artigos
                    </span>
                    <span className="text-amber-600 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                      Ver mais →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}