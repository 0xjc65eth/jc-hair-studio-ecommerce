import { Metadata } from 'next';
import { Calendar, Award, Users, Globe, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Nossa História | JC Hair Studio',
  description: 'Conheça a história do JC Hair Studio, nossa jornada de crescimento e os valores que nos guiam desde o início.',
};

export default function HistoriaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/sobre" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Sobre Nós
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nossa História</h1>
          <p className="text-xl text-gray-600">
            Uma jornada de paixão, dedicação e transformação na indústria da beleza
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center mb-4">
            <Sparkles className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">JC Hair Studio - Desde 2015</h2>
          </div>
          <p className="text-lg">
            O que começou como um sonho de democratizar o acesso à beleza profissional
            se tornou uma das principais referências em produtos capilares no Brasil.
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-blue-600" />
            Nossa Trajetória
          </h2>

          <div className="space-y-8">
            {/* 2015 */}
            <div className="flex items-start space-x-6">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">2015</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">O Início</h3>
                <p className="text-gray-600 text-sm">
                  Júlio César funda o JC Hair Studio com uma pequena loja física em São Paulo.
                  O foco inicial era oferecer mega hair de qualidade a preços acessíveis,
                  atendendo principalmente salões de beleza da região.
                </p>
              </div>
            </div>

            {/* 2017 */}
            <div className="flex items-start space-x-6">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">2017</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Expansão Digital</h3>
                <p className="text-gray-600 text-sm">
                  Lançamento da primeira loja online, marcando nossa entrada no e-commerce.
                  Início das parcerias com fornecedores internacionais, expandindo nosso
                  catálogo com marcas europeias e produtos premium.
                </p>
              </div>
            </div>

            {/* 2019 */}
            <div className="flex items-start space-x-6">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">2019</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Diversificação</h3>
                <p className="text-gray-600 text-sm">
                  Ampliação do portfólio com cosméticos, maquiagens e produtos para tratamentos
                  capilares. Criação do programa de fidelidade e início do atendimento
                  personalizado via WhatsApp.
                </p>
              </div>
            </div>

            {/* 2021 */}
            <div className="flex items-start space-x-6">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">2021</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Reconhecimento</h3>
                <p className="text-gray-600 text-sm">
                  Recebemos o prêmio "Loja Online do Ano" no setor de beleza.
                  Alcançamos a marca de 50.000 clientes atendidos e expandimos
                  para outras regiões do Brasil.
                </p>
              </div>
            </div>

            {/* 2023 */}
            <div className="flex items-start space-x-6">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">2023</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Expansão Internacional</h3>
                <p className="text-gray-600 text-sm">
                  Início das operações em Portugal e outros países europeus.
                  Lançamento da nova plataforma de e-commerce com tecnologia
                  de ponta e experiência de compra otimizada.
                </p>
              </div>
            </div>

            {/* 2024 */}
            <div className="flex items-start space-x-6">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">2024</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Inovação Contínua</h3>
                <p className="text-gray-600 text-sm">
                  Implementação de inteligência artificial para recomendações personalizadas.
                  Lançamento do programa de sustentabilidade e parcerias com marcas
                  que compartilham nossos valores ambientais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <Award className="w-6 h-6 mr-3 text-yellow-600" />
            Conquistas e Marcos
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🏆 Prêmios Recebidos</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Loja Online do Ano - Beleza (2021)</li>
                  <li>• Melhor Atendimento ao Cliente (2022)</li>
                  <li>• Empresa Destaque em E-commerce (2023)</li>
                  <li>• Prêmio Sustentabilidade (2024)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📈 Crescimento</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Mais de 100.000 clientes atendidos</li>
                  <li>• Presença em 3 países</li>
                  <li>• Mais de 5.000 produtos no catálogo</li>
                  <li>• Taxa de satisfação de 98%</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">🌱 Sustentabilidade</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Embalagens 100% recicláveis</li>
                  <li>• Parceria com marcas eco-friendly</li>
                  <li>• Programa de devolução de embalagens</li>
                  <li>• Neutralização de carbono nas entregas</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">👥 Comunidade</h3>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Mais de 50 mil seguidores nas redes</li>
                  <li>• Programa de afiliados ativo</li>
                  <li>• Workshops e tutoriais gratuitos</li>
                  <li>• Suporte a influenciadores emergentes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <Users className="w-6 h-6 mr-3 text-indigo-600" />
            Nossos Valores
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Paixão</h3>
              <p className="text-gray-600 text-sm">
                Fazemos o que amamos e isso se reflete na qualidade
                de nossos produtos e atendimento.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Qualidade</h3>
              <p className="text-gray-600 text-sm">
                Selecionamos cuidadosamente cada produto para garantir
                a melhor experiência para nossos clientes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Sustentabilidade</h3>
              <p className="text-gray-600 text-sm">
                Comprometidos com práticas responsáveis que preservam
                o meio ambiente para as futuras gerações.
              </p>
            </div>
          </div>
        </div>

        {/* Future Vision */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white">
          <div className="flex items-center mb-4">
            <Globe className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Visão de Futuro</h2>
          </div>
          <p className="text-lg mb-4">
            Nossa meta é nos tornar a principal referência em produtos de beleza
            na América Latina e Europa, sempre mantendo nossos valores de qualidade,
            sustentabilidade e atendimento excepcional.
          </p>
          <p className="text-indigo-100">
            Continuamos investindo em tecnologia, parcerias estratégicas e
            inovação para oferecer sempre a melhor experiência aos nossos clientes.
          </p>
        </div>
      </div>
    </div>
  );
}