import { Metadata } from 'next';
import Link from 'next/link';
import { Award, Users, Globe, Heart, Leaf, Shield } from 'lucide-react';
import { COMPANY_DATA } from '@/lib/data/company-data';

export const metadata: Metadata = {
  title: 'Sobre Nós - JC Hair Studio\'s 62',
  description: 'Conheça a história de mais de 40 anos de tradição familiar da JC Hair Studio\'s 62. De um modesto salão em Goiânia ao e-commerce que atende todo o Brasil.',
  keywords: [
    'sobre JC Hair Studio',
    'história empresa',
    'cabelo brasil',
    'empresa cabelo premium',
    '40 anos experiência',
    'missão visão valores',
    'tradição familiar'
  ],
  openGraph: {
    title: 'Sobre Nós - JC Hair Studio\'s 62',
    description: 'Mais de 40 anos de tradição familiar em cuidados capilares. Conheça nossa história, missão e compromisso com a qualidade.',
    type: 'article',
  },
};

const values = [
  {
    icon: Heart,
    title: "Tradição Familiar",
    description: COMPANY_DATA.values[0],
    color: "text-rose-600"
  },
  {
    icon: Award,
    title: "Qualidade Sem Compromisso",
    description: COMPANY_DATA.values[1],
    color: "text-amber-600"
  },
  {
    icon: Shield,
    title: "Transparência",
    description: COMPANY_DATA.values[2],
    color: "text-blue-600"
  },
  {
    icon: Globe,
    title: "Experiência Internacional",
    description: COMPANY_DATA.values[3],
    color: "text-indigo-600"
  },
  {
    icon: Users,
    title: "Atendimento Personalizado",
    description: COMPANY_DATA.values[4],
    color: "text-purple-600"
  },
  {
    icon: Leaf,
    title: "Responsabilidade",
    description: COMPANY_DATA.values[5],
    color: "text-green-600"
  }
];

const stats = [
  { number: "40+", label: "Anos de Tradição", description: "Décadas de conhecimento familiar" },
  { number: "10.000+", label: "Clientes Atendidos", description: "Em todo o Brasil" },
  { number: "27", label: "Estados Atendidos", description: "Entrega para todo o Brasil" },
  { number: "95%", label: "Taxa de Satisfação", description: "Clientes recomendam nossos produtos" },
  { number: "800+", label: "Produtos Selecionados", description: "Catálogo premium brasileiro" },
  { number: "24h", label: "Suporte Online", description: "Atendimento via WhatsApp" }
];

const certifications = [
  "Produtos Dermatologicamente Testados",
  "Registro ANVISA - Conformidade Regulatória",
  "Cruelty-Free - Livre de Testes em Animais",
  "LGPD Compliance - Proteção de Dados",
  "E-commerce Seguro - SSL Certificado",
  "Satisfação do Cliente Garantida"
];

const teamMembers = [
  {
    name: COMPANY_DATA.history.founder.name,
    role: COMPANY_DATA.history.founder.profession,
    description: `${COMPANY_DATA.history.founder.nationality} de ${COMPANY_DATA.history.founder.age} anos, com ${COMPANY_DATA.history.founder.education}. ${COMPANY_DATA.history.founder.experience}`,
    experience: COMPANY_DATA.history.founder.experience
  },
  {
    name: COMPANY_DATA.history.familyFounder.name,
    role: `${COMPANY_DATA.history.familyFounder.relation} & Matriarca`,
    description: `${COMPANY_DATA.history.familyFounder.experience}. ${COMPANY_DATA.history.familyFounder.legacy} e responsável por toda a base de conhecimento da empresa.`,
    experience: "40+ anos"
  },
  {
    name: "Equipe Técnica",
    role: "Especialistas em Produtos",
    description: "Time especializado na seleção e testes de produtos capilares brasileiros, garantindo qualidade e resultados comprovados.",
    experience: "15+ anos"
  },
  {
    name: "Atendimento Digital",
    role: "Consultores Capilares",
    description: "Equipe capacitada para atendimento via WhatsApp e suporte online, orientando clientes em todo o Brasil.",
    experience: "5+ anos"
  }
];

const milestones = [
  { year: "1980", achievement: `${COMPANY_DATA.history.familyFounder.name} inicia sua jornada como cabeleireira aos 13 anos` },
  { year: "2000", achievement: `Fundação do ${COMPANY_DATA.history.origins.firstSalon} em ${COMPANY_DATA.history.origins.location}` },
  { year: "2010-2020", achievement: COMPANY_DATA.history.evolution.internationalTraining },
  { year: "2024", achievement: `Lançamento da ${COMPANY_DATA.name} - E-commerce para todo o Brasil` }
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
              {COMPANY_DATA.tagline}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
              {COMPANY_DATA.mission}
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
                {COMPANY_DATA.mission}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Nossa Visão</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {COMPANY_DATA.vision}
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
            Descubra por que milhares de brasileiros confiam na JC Hair Studio's 62
            para cuidar de seus cabelos com qualidade e tradição familiar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/produtos" 
              className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Explorar Produtos
            </Link>
            <a 
              href={`https://wa.me/${COMPANY_DATA.contact.phones[0].number.replace(/[^0-9]/g, '')}`}
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