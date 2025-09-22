'use client';

import React from 'react';
import { Button } from '../../components/ui/Button';

export default function TratamentosCapilaresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 mt-16 lg:mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              Tratamentos Capilares
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Em breve, nossa linha completa de tratamentos capilares profissionais estará disponível.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-8">💆‍♀️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Página em Construção
          </h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Estamos preparando uma experiência completa com os melhores tratamentos capilares.
            Em breve você encontrará aqui máscaras, ampolas, hidratação e muito mais.
          </p>
          <div className="space-y-4">
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
              onClick={() => window.history.back()}
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Seja notificado quando lançarmos
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Cadastre-se para receber em primeira mão quando nossos tratamentos capilares estiverem disponíveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium">
              Notificar-me
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}