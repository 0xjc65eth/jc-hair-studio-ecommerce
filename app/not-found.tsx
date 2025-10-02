import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h2>
          <p className="text-gray-600 mb-6">
            Desculpe, não conseguimos encontrar a página que você está procurando.
            Ela pode ter sido movida ou não existe mais.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Voltar para Início
            </Button>
          </Link>

          <Link href="/produtos" className="block">
            <Button variant="outline" className="w-full">
              Ver Produtos
            </Button>
          </Link>

          <Link href="/suporte" className="block">
            <Button variant="ghost" className="w-full text-sm">
              Precisa de Ajuda?
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Algumas sugestões:
          </p>
          <div className="mt-3 space-y-2">
            <Link href="/produtos/cabelo" className="block text-sm text-purple-600 hover:underline">
              Produtos Capilares
            </Link>
            <Link href="/produtos/maquiagem" className="block text-sm text-purple-600 hover:underline">
              Maquiagem
            </Link>
            <Link href="/produtos/cosmeticos" className="block text-sm text-purple-600 hover:underline">
              Cosméticos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
