'use client';

import { useState } from 'react';
import { 
  Check, 
  Shield, 
  FileText, 
  Globe, 
  Headphones, 
  Star, 
  Truck,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  MapPin
} from 'lucide-react';

interface PorQueComprarProps {
  className?: string;
  variant?: 'default' | 'floating' | 'sidebar';
}

const BENEFITS = [
  {
    id: 'originais',
    icon: Shield,
    title: 'Produtos 100% Originais do Brasil',
    description: 'Garantimos a autenticidade de todos os produtos. Importação direta das melhores marcas brasileiras.',
    details: [
      'Certificados de autenticidade',
      'Lacres de segurança originais',
      'Registro ANVISA quando aplicável',
      'Parceria direta com fabricantes'
    ],
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'nota-fiscal',
    icon: FileText,
    title: 'Nota Fiscal Brasileira Incluída',
    description: 'Todas as compras incluem nota fiscal brasileira para total transparência e garantia.',
    details: [
      'Documento fiscal completo',
      'Rastreabilidade total',
      'Garantia de procedência',
      'Facilita importação'
    ],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'conformidade',
    icon: Globe,
    title: 'Conformidade Regulamentações EU',
    description: 'Todos os produtos atendem às exigências da União Europeia para cosméticos.',
    details: [
      'Testes de segurança EU',
      'Ingredientes aprovados',
      'Rotulagem em português/inglês',
      'Registro CPNP quando necessário'
    ],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'suporte',
    icon: Headphones,
    title: 'Suporte em Português',
    description: 'Atendimento personalizado em português por brasileiros na Europa.',
    details: [
      'WhatsApp direto: +32472384027',
      'E-mail em português',
      'Horário comercial europeu',
      'Conhecimento técnico brasileiro'
    ],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'garantia',
    icon: Star,
    title: 'Garantia de Satisfação',
    description: '30 dias para devolução se não ficar completamente satisfeita.',
    details: [
      'Devolução sem custo adicional',
      'Reembolso integral',
      'Produtos em perfeito estado',
      'Atendimento dedicado'
    ],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  {
    id: 'entrega',
    icon: Truck,
    title: 'Entrega Rastreada',
    description: 'Acompanhe seu pedido do Brasil até sua casa na Europa.',
    details: [
      'Tracking completo',
      'Seguro incluído',
      'Entrega em 10-15 dias',
      'Atualizações por WhatsApp'
    ],
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  }
];

const ADDITIONAL_FEATURES = [
  {
    icon: Award,
    title: '+5.000 Clientes Satisfeitas',
    description: 'Brasileiras na Europa confiam em nós'
  },
  {
    icon: Clock,
    title: '3 Anos de Mercado',
    description: 'Experiência consolidada na Europa'
  },
  {
    icon: MapPin,
    title: 'Base na Bélgica',
    description: 'Empresa estabelecida no coração da Europa'
  }
];

export default function PorQueComprar({ 
  className = '',
  variant = 'default'
}: PorQueComprarProps) {
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);

  const toggleBenefit = (benefitId: string) => {
    setExpandedBenefit(expandedBenefit === benefitId ? null : benefitId);
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">100% Seguro</h3>
              <p className="text-xs text-gray-600">Produtos originais do Brasil</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            +5.000 brasileiras confiam em nós
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Por que Comprar Conosco?
        </h3>
        
        <div className="space-y-4">
          {BENEFITS.slice(0, 3).map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 ${benefit.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${benefit.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{benefit.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            {ADDITIONAL_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#8B4513]" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">{feature.title}</div>
                    <div className="text-xs text-gray-600">{feature.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Default variant - full section
  return (
    <section className={`bg-gradient-to-br from-green-50 via-white to-blue-50 ${className}`}>
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-playfair font-light mb-4 text-gray-900">
            Por que Comprar Conosco?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos a ponte entre você e os melhores produtos de beleza brasileiros, 
            com total segurança e confiança na Europa.
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            const isExpanded = expandedBenefit === benefit.id;
            
            return (
              <div
                key={benefit.id}
                className={`bg-white rounded-xl border ${benefit.borderColor} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className={`w-12 h-12 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {benefit.description}
                  </p>

                  {/* Expand Button */}
                  <button
                    onClick={() => toggleBenefit(benefit.id)}
                    className="flex items-center gap-2 text-sm font-medium text-[#8B4513] hover:text-[#6B3410] transition-colors"
                  >
                    <span>Ver detalhes</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`px-6 pb-6 ${benefit.bgColor} border-t ${benefit.borderColor}`}>
                    <ul className="space-y-2 mt-4">
                      {benefit.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {ADDITIONAL_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#8B4513]/10 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-[#8B4513]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-semibold mb-4">
              Pronta para Experimentar?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Junte-se às milhares de brasileiras que já confiam na gente para trazer 
              o melhor da beleza brasileira para a Europa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/320494989860"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#8B4513] font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Fale Conosco no WhatsApp
              </a>
              <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-[#8B4513] transition-colors">
                Ver Produtos
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}