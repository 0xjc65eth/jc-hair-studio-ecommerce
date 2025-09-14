import { Metadata } from 'next';
import Link from 'next/link';
import { Award, Users, Globe, Heart, Leaf, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nós - JC Hair Studio\'s 62',
  description: 'Conheça a história de mais de 30 anos da JC Hair Studio\'s 62, líder em extensões de cabelo premium na Europa. Missão, valores e compromisso com a excelência.',
  keywords: [
    'sobre JC Hair Studio',
    'história empresa',
    'extensões cabelo europa',
    'empresa cabelo premium',
    '30 anos experiência',
    'missão visão valores',
    'certificações qualidade'
  ],
  openGraph: {
    title: 'Sobre Nós - JC Hair Studio\'s 62',
    description: 'Mais de 30 anos de experiência em extensões de cabelo premium. Conheça nossa história, missão e compromisso com a excelência.',
    type: 'article',
  },
};

const values = [
  {
    icon: Award,
    title: "Qualidade",
    description: "Nunca comprometemos a excelência. Cada produto passa por rigorosa seleção para garantir os melhores resultados.",
    color: "text-amber-600"
  },
  {
    icon: Heart,
    title: "Inovação",
    description: "Sempre à frente das tendências, investimos constantemente em pesquisa e desenvolvimento de novos produtos.",
    color: "text-rose-600"
  },
  {
    icon: Shield,
    title: "Confiança",
    description: "Construída ao longo de décadas através da transparência, honestidade e relacionamentos duradouros.",
    color: "text-blue-600"
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Responsabilidade com o futuro através de práticas sustentáveis e produtos eco-friendly.",
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "Inclusão",
    description: "Beleza para todas as mulheres. Oferecemos soluções diversas que celebram a individualidade.",
    color: "text-purple-600"
  },
  {
    icon: Globe,
    title: "Excelência",
    description: "Padrão internacional de qualidade com atendimento personalizado e especializado.",
    color: "text-indigo-600"
  }
];

const stats = [
  { number: "30+", label: "Anos de Experiência", description: "Décadas dedicadas à beleza capilar" },
  { number: "50.000+", label: "Clientes Satisfeitas", description: "Em toda a Europa e além" },
  { number: "15", label: "Países Atendidos", description: "Entrega internacional premium" },
  { number: "98%", label: "Taxa de Satisfação", description: "Avaliações positivas comprovadas" },
  { number: "500+", label: "Produtos Premium", description: "Catálogo cuidadosamente selecionado" },
  { number: "24h", label: "Tempo Médio Resposta", description: "Atendimento ágil e eficiente" }
];

const certifications = [
  "ISO 9001 - Sistema de Gestão da Qualidade",
  "GDPR Compliance - Proteção de Dados",
  "Certificação Orgânica - Produtos Naturais",
  "Cruelty-Free - Livre de Testes em Animais",
  "Responsabilidade Social Corporativa",
  "Certificado de Excelência em Atendimento"
];

const teamMembers = [
  {
    name: "Júlio César",
    role: "Fundador & CEO",
    description: "Visionário por trás da JC Hair Studio, com mais de 30 anos dedicados à beleza capilar premium.",
    experience: "30+ anos"
  },
  {
    name: "Equipe Técnica",
    role: "Especialistas em Produto",
    description: "Time qualificado em seleção, testes e desenvolvimento de produtos capilares de alta performance.",
    experience: "15+ anos"
  },
  {
    name: "Atendimento Especializado",
    role: "Consultores de Beleza",
    description: "Profissionais capacitados para orientar e personalizar a escolha perfeita para cada cliente.",
    experience: "10+ anos"
  },
  {
    name: "Logística Europa",
    role: "Equipe Internacional",
    description: "Especialistas em entrega internacional com foco na experiência premium do cliente.",
    experience: "8+ anos"
  }
];

const milestones = [
  { year: "1990", achievement: "Fundação da empresa como pequeno salão especializado" },
  { year: "2000", achievement: "Expansão para produtos premium e extensões naturais" },
  { year: "2010", achievement: "Entrada no mercado europeu com base em Lisboa" },
  { year: "2015", achievement: "Abertura do escritório comercial em Bruxelas" },
  { year: "2020", achievement: "Lançamento do e-commerce com entrega internacional" },
  { year: "2024", achievement: "Líder reconhecida em extensões premium na Europa" }
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
              Mais de 30 anos transformando
              <span className="italic"> sonhos em realidade</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
              Somos a JC Hair Studio's 62, pioneiros em extensões de cabelo premium na Europa. 
              Nossa jornada começou com uma paixão: realizar o sonho de cabelos perfeitos para 
              mulheres exigentes em todo o continente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/nossa-historia" 
                className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
              >
                Nossa História Completa
              </Link>
              <Link 
                href="/contato" 
                className="border border-gray-200 text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
              >
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Nossos Princípios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Valores que nos guiam na busca constante pela excelência e satisfação dos nossos clientes.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Nossa Missão</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Proporcionar às mulheres europeias acesso a extensões de cabelo de altíssima qualidade, 
                oferecendo produtos premium que valorizam sua beleza natural e elevam sua autoestima, 
                sempre com atendimento personalizado e expertise profissional.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Nossa Visão</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ser reconhecida como a referência absoluta em extensões de cabelo premium na Europa, 
                expandindo nossa presença internacional e mantendo o compromisso inabalável com a 
                excelência, inovação e satisfação das nossas clientes.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4 ${value.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Numbers That Impress */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Números que Impressionam
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Décadas de dedicação refletidas em conquistas mensuráveis e reconhecimento internacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2">{stat.number}</div>
                <div className="text-xl font-medium text-gray-900 mb-2">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Marcos da Nossa Jornada
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma trajetória de crescimento, inovação e conquistas que nos trouxeram até aqui.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="text-2xl font-light text-gray-900 mb-2">{milestone.year}</div>
                      <p className="text-gray-600">{milestone.achievement}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Nossa Equipe Especializada
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais apaixonados e altamente qualificados, dedicados a oferecer a melhor experiência em beleza capilar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-gray-600 font-medium">{member.role}</p>
                  </div>
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
                    {member.experience}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Certificações e Qualidade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nosso compromisso com a excelência é validado por certificações internacionais reconhecidas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((certification, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={24} className="text-green-600" />
                </div>
                <p className="font-medium text-gray-900">{certification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Premiações e Reconhecimentos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa excelência reconhecida por clientes, parceiros e instituições especializadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Excelência 2024</h3>
              <p className="text-gray-600 text-sm">Prêmio Europeu de Beleza Premium</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Melhor Atendimento</h3>
              <p className="text-gray-600 text-sm">Certificação Cliente Ouro 2024</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sustentabilidade</h3>
              <p className="text-gray-600 text-sm">Selo Verde Empresarial 2024</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Expansão Internacional</h3>
              <p className="text-gray-600 text-sm">Top E-commerce Europa 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Descubra por que milhares de mulheres em toda a Europa confiam na JC Hair Studio's 62 
            para realizar seus sonhos capilares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/produtos" 
              className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Explorar Produtos
            </Link>
            <a 
              href="https://wa.me/32470032758"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}