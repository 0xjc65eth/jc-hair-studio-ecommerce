import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import FeaturedProducts from '../components/products/FeaturedProducts';
import VideoHeroCarousel from '../components/home/VideoHeroCarousel';

export const metadata: Metadata = {
  title: '62 Beauty - Produtos Premium do Brasil para Europa',
  description: 'Produtos premium de beleza brasileiros importados diretamente para Europa. Progressivas, tratamentos capilares, maquiagem profissional e ferramentas de qualidade.',
};

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  shortDesc: string;
  images: {
    url: string;
    alt: string;
    isMain: boolean;
  }[];
}

// Removed API fetch - using local data

function ProductCard({ product }: { product: Product }) {
  const mainImage = product.images.find(img => img.isMain) || product.images[0];

  return (
    <Link href={`/produto/${product.slug}`} className="group">
      <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-4">
        {mainImage && (
          <img
            src={mainImage.url}
            alt={mainImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDesc}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-900">
            €{Number(product.price).toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              €{Number(product.comparePrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Removed old function - using new component

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Video Hero Carousel */}
      <VideoHeroCarousel />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                Mais de 30 anos de experiência
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Especializados em extensões de cabelo premium, oferecemos produtos 
                cuidadosamente selecionados para profissionais e clientes exigentes 
                em toda a Europa.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Nossa paixão pela beleza autêntica nos guia na escolha de cada produto, 
                garantindo qualidade e resultados excepcionais.
              </p>
              <Link 
                href="/sobre" 
                className="text-gray-900 underline hover:no-underline font-medium"
              >
                Conheça nossa história
              </Link>
            </div>
            <div className="aspect-[4/3] bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full transform -translate-x-24 translate-y-24"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-black mb-4">
                Semana da Beleza Brasileira
              </h2>
              <p className="text-xl text-black mb-6 opacity-90">
                Até 30% de desconto + Frete grátis acima de €75
              </p>
              <div className="inline-block bg-black text-amber-400 px-6 py-3 rounded-lg font-bold text-xl tracking-wider mb-4">
                BRASIL30
              </div>
              <p className="text-sm text-black opacity-75">
                Válido até 31/12/2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
              ESPECIALIDADES BRASILEIRAS
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore nossas categorias de produtos premium
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/produtos" className="group relative h-96 bg-black rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop')] bg-cover bg-center opacity-70 group-hover:opacity-50 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
                  Produtos
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Progressivas, tratamentos e produtos capilares
                </p>
              </div>
            </Link>

            <Link href="/cuidados-beleza" className="group relative h-96 bg-black rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop')] bg-cover bg-center opacity-70 group-hover:opacity-50 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
                  Cuidados & Beleza
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Maquiagem brasileira e produtos de beleza
                </p>
              </div>
            </Link>

            <Link href="/mega-hair-ferramentas" className="group relative h-96 bg-black rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=400&fit=crop')] bg-cover bg-center opacity-70 group-hover:opacity-50 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
                  Mega Hair & Ferramentas
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Extensões e equipamentos profissionais
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
              MARCAS BRASILEIRAS AUTÊNTICAS
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Parcerias diretas com os melhores laboratórios do Brasil
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {['Natura', 'O Boticário', 'Cadiveu', 'Inoar', 'Honma Tokyo', 'Forever Liss'].map((brand) => (
              <div key={brand} className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-amber-100 transition-colors">
                  <span className="text-gray-600 font-semibold text-sm">{brand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
              AMADO EM TODA EUROPA
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              O que nossos clientes dizem sobre nós
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Rodrigues",
                location: "Lisboa, Portugal",
                text: "Finalmente encontrei produtos brasileiros autênticos aqui na Europa! A progressiva Cadiveu é exatamente igual à que uso no Brasil. Qualidade excepcional!"
              },
              {
                name: "Carmen Silva", 
                location: "Madrid, España",
                text: "Sou cabeleireira e os produtos da 62 Beauty são os mesmos que usava no meu salão em São Paulo. Entrega rápida e preços justos. Recomendo!"
              },
              {
                name: "Ana França",
                location: "Paris, France", 
                text: "A maquiagem Mari Maria chegou perfeita! Cores vibrantes e duração incrível. Agora posso ter o look brasileiro que tanto amo aqui em Paris."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-amber-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-light mb-6 relative inline-block">
            DESBLOQUEIE OS SEGREDOS DA BELEZA BRASILEIRA
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Receba dicas exclusivas, lançamentos e ofertas especiais
          </p>
          <div className="mb-8">
            <span className="bg-amber-500 bg-opacity-20 text-amber-400 px-6 py-2 rounded-full text-sm font-medium">
              🎁 15% de desconto na primeira compra
            </span>
          </div>
          <div className="max-w-md mx-auto flex gap-4 mb-6">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 rounded-full border-2 border-amber-500 border-opacity-30 bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-8 py-4 rounded-full hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 font-semibold tracking-wide transform hover:-translate-y-1">
              Inscrever-se
            </button>
          </div>
          <p className="text-sm text-gray-400">
            ✨ 25.000+ inscritos • Proteção de dados garantida
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
            PRECISA DE AJUDA?
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Nossa equipe está sempre pronta para ajudá-la a encontrar 
            o produto perfeito para suas necessidades.
          </p>
          <a 
            href="https://wa.me/32470032758"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-full hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 font-semibold text-lg tracking-wide transform hover:-translate-y-1"
          >
            📱 Falar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}