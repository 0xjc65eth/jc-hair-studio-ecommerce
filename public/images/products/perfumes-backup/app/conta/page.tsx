'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, Heart, ShoppingBag, Settings, LogOut, Package, CreditCard, MapPin, Star } from 'lucide-react';

export default function ContaPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Minha Conta</h1>
              <p className="text-gray-600">Entre para acessar sua conta ou crie uma nova</p>
            </div>

            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors text-center block font-medium"
              >
                Entrar na Conta
              </Link>

              <Link
                href="/auth/signup"
                className="w-full border border-gray-300 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors text-center block font-medium"
              >
                Criar Nova Conta
              </Link>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                Com sua conta você pode:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Acompanhar seus pedidos
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Salvar produtos favoritos
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Finalizar compras mais rápido
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Salvar endereços de entrega
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Minha Conta</h1>
          <p className="text-gray-600">Gerencie suas informações e pedidos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user?.name || 'Avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{session.user?.name || 'Usuário'}</h3>
                  <p className="text-sm text-gray-600">{session.user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link href="/conta" className="flex items-center gap-3 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg">
                  <User className="w-4 h-4" />
                  Perfil
                </Link>
                <Link href="/conta/pedidos" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Package className="w-4 h-4" />
                  Meus Pedidos
                </Link>
                <Link href="/favoritos" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Heart className="w-4 h-4" />
                  Favoritos
                </Link>
                <Link href="/conta/enderecos" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  Endereços
                </Link>
                <Link href="/conta/pagamento" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <CreditCard className="w-4 h-4" />
                  Formas de Pagamento
                </Link>
                <Link href="/conta/pontos" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Star className="w-4 h-4" />
                  Programa de Pontos
                </Link>
                <Link href="/conta/configuracoes" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Settings className="w-4 h-4" />
                  Configurações
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Informações Pessoais</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      defaultValue={session.user?.name?.split(' ')[0] || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      defaultValue={session.user?.name?.split(' ').slice(1).join(' ') || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={session.user?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+32 123 456 789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    defaultValue="1990-01-01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <ShoppingBag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-light text-gray-900 mb-1">12</div>
                <div className="text-sm text-gray-600">Pedidos Realizados</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Heart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-light text-gray-900 mb-1">8</div>
                <div className="text-sm text-gray-600">Produtos Favoritos</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-light text-gray-900 mb-1">Premium</div>
                <div className="text-sm text-gray-600">Cliente VIP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}