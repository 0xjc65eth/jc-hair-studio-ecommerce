/**
 * HTML SITEMAP PAGE - COMPREHENSIVE LINK INDEX
 * Human and crawler-readable sitemap with all site links
 * Purpose: Provide crawlers with complete site structure
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { allEuropeanProducts } from '@/lib/data/europeanPricingProducts';

export const metadata: Metadata = {
  title: 'Mapa do Site - JC Hair Studio | Todas as Páginas e Produtos',
  description: 'Mapa completo do site com links para todas as páginas, categorias e produtos brasileiros disponíveis em Portugal.',
  alternates: {
    canonical: 'https://jchairstudios62.xyz/sitemap-html'
  },
  robots: {
    index: true,
    follow: true
  }
};

export const revalidate = 86400; // Revalidate daily

// Group products by category
function getProductsByCategory() {
  const categoryMap = new Map<string, typeof allEuropeanProducts>();

  allEuropeanProducts.forEach(product => {
    const category = product.category || 'Outros';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)?.push(product);
  });

  return Array.from(categoryMap.entries()).map(([name, products]) => ({
    name,
    count: products.length,
    products
  }));
}

export default function HtmlSitemapPage() {
  const productsByCategory = getProductsByCategory();
  const updateDate = new Date().toLocaleDateString('pt-PT');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mapa do Site - JC Hair Studio
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Navegação completa de todas as páginas e produtos brasileiros disponíveis
          </p>
          <p className="text-sm text-gray-500">
            Atualizado em: {updateDate} | Total de produtos: {allEuropeanProducts.length}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Pages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-pink-500 pb-2">
              Páginas Principais
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Notícias e Novidades
                </Link>
              </li>
              <li>
                <Link href="/updates" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Atualizações em Tempo Real
                </Link>
              </li>
              <li>
                <Link href="/latest-products" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Últimos Produtos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Índice de Categorias
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-pink-500 pb-2">
              Categorias de Produtos
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/mega-hair" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Mega Hair Natural
                </Link>
              </li>
              <li>
                <Link href="/progressivas-btx" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Progressivas e BTX
                </Link>
              </li>
              <li>
                <Link href="/tratamentos-capilares" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Tratamentos Capilares
                </Link>
              </li>
              <li>
                <Link href="/shampoos-condicionadores" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Shampoos e Condicionadores
                </Link>
              </li>
              <li>
                <Link href="/maquiagens" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Maquiagem Brasileira
                </Link>
              </li>
              <li>
                <Link href="/perfumes" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Perfumes Brasileiros
                </Link>
              </li>
              <li>
                <Link href="/esmaltes" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Esmaltes IMPALA
                </Link>
              </li>
              <li>
                <Link href="/ferramentas-equipamentos" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Ferramentas e Equipamentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Pages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-pink-500 pb-2">
              Área do Cliente
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/conta" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/conta/pedidos" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link href="/conta/enderecos" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Endereços
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/carrinho" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Carrinho de Compras
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Finalizar Compra
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-pink-500 pb-2">
              Ajuda e Informações
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/como-comprar" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Como Comprar
                </Link>
              </li>
              <li>
                <Link href="/envio-entrega" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Envio e Entrega
                </Link>
              </li>
              <li>
                <Link href="/trocas-devolucoes" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/formas-pagamento" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Formas de Pagamento
                </Link>
              </li>
              <li>
                <Link href="/legal/politica-privacidade" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/legal/termos-uso" className="text-pink-600 hover:text-pink-700 hover:underline">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Products by Category */}
        <div className="mt-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Todos os Produtos por Categoria
          </h2>

          {productsByCategory.map((category) => (
            <div key={category.name} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-pink-500 pb-2">
                {category.name}
                <span className="ml-3 text-base font-normal text-gray-500">
                  ({category.count} produtos)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produto/${product.id}`}
                    className="text-pink-600 hover:text-pink-700 hover:underline text-sm"
                  >
                    {product.name} - {product.brand}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEO Footer */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sobre o Nosso Catálogo
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O JC Hair Studio oferece o maior catálogo de produtos brasileiros em Portugal.
            Navegue facilmente por todas as nossas categorias usando este mapa do site
            completo e atualizado diariamente.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nosso catálogo inclui progressivas brasileiras, mega hair natural, tratamentos
            capilares, maquiagem brasileira, perfumes, esmaltes IMPALA e muito mais. Todos
            os produtos são importados diretamente do Brasil com garantia de autenticidade.
          </p>
        </div>
      </div>
    </div>
  );
}
