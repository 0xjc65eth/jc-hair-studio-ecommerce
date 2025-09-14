'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Users, TrendingUp, Globe, Gift, GraduationCap, MapPin, Clock, Euro, Send, FileText, Mail, Phone } from 'lucide-react';

// Metadata would need to be moved to a separate file for client components
// For now, keeping the component structure

const companyValues = [
  {
    icon: Heart,
    title: "Paixão pela Beleza",
    description: "Trabalhamos com amor pelo que fazemos, sempre buscando realizar os sonhos de beleza das nossas clientes.",
    color: "text-rose-600 bg-rose-50"
  },
  {
    icon: Users,
    title: "Trabalho em Equipe",
    description: "Acreditamos na força da colaboração e no crescimento conjunto de toda a equipe.",
    color: "text-blue-600 bg-blue-50"
  },
  {
    icon: TrendingUp,
    title: "Crescimento Contínuo",
    description: "Incentivamos o desenvolvimento pessoal e profissional através de formações e desafios.",
    color: "text-green-600 bg-green-50"
  },
  {
    icon: Globe,
    title: "Visão Internacional",
    description: "Operamos em múltiplos países, oferecendo oportunidades de carreira internacional.",
    color: "text-purple-600 bg-purple-50"
  }
];

const benefits = [
  {
    icon: Euro,
    title: "Remuneração Competitiva",
    description: "Salários acima da média do mercado com revisões periódicas baseadas em performance.",
    items: ["Salário base competitivo", "Comissões atrativas", "13º e 14º salários", "Revisões anuais"]
  },
  {
    icon: Gift,
    title: "Benefícios Premium",
    description: "Pacote completo de benefícios para você e sua família.",
    items: ["Plano de saúde completo", "Seguro de vida", "Vale-alimentação", "Produtos com desconto"]
  },
  {
    icon: GraduationCap,
    title: "Desenvolvimento Profissional",
    description: "Investimento contínuo no seu crescimento e especialização.",
    items: ["Cursos de especialização", "Certificações internacionais", "Mentoria personalizada", "Congressos e eventos"]
  },
  {
    icon: Clock,
    title: "Flexibilidade",
    description: "Equilíbrio entre vida pessoal e profissional.",
    items: ["Horários flexíveis", "Home office híbrido", "Férias estendidas", "Licenças especiais"]
  }
];

const jobOpenings = [
  {
    title: "Consultor de Beleza Senior",
    location: "Lisboa, Portugal",
    type: "Tempo Integral",
    department: "Vendas",
    salary: "€2.500 - €4.000",
    description: "Profissional experiente para atendimento premium de clientes internacionais, com foco em consultoria especializada em extensões de cabelo.",
    requirements: [
      "Mínimo 5 anos de experiência em beleza/cosmética",
      "Conhecimento avançado em extensões capilares", 
      "Fluência em português, inglês e francês",
      "Experiência em vendas consultivas",
      "Certificações em beleza (diferencial)"
    ],
    responsibilities: [
      "Consultoria especializada para clientes premium",
      "Desenvolvimento de relacionamento duradouro",
      "Atingimento de metas comerciais",
      "Formação de equipe júnior",
      "Participação em eventos e feiras"
    ]
  },
  {
    title: "Especialista em Atendimento",
    location: "Bruxelas, Bélgica", 
    type: "Tempo Integral",
    department: "Customer Success",
    salary: "€2.200 - €3.500",
    description: "Especialista para garantir excelência no atendimento ao cliente europeu, com foco em satisfação e retenção.",
    requirements: [
      "Experiência em atendimento ao cliente premium",
      "Fluência em holandês, francês e inglês",
      "Conhecimento em produtos de beleza",
      "Habilidades em CRM e ferramentas digitais",
      "Orientação para resultados"
    ],
    responsibilities: [
      "Atendimento multicanal (telefone, chat, email)",
      "Resolução de questões complexas",
      "Acompanhamento pós-venda",
      "Análise de satisfação do cliente",
      "Melhoria contínua de processos"
    ]
  },
  {
    title: "Analista de Marketing Digital",
    location: "Lisboa, Portugal (Híbrido)",
    type: "Tempo Integral", 
    department: "Marketing",
    salary: "€1.800 - €3.000",
    description: "Profissional criativo para desenvolver estratégias digitais inovadoras e impulsionar nosso crescimento online.",
    requirements: [
      "Formação em Marketing, Comunicação ou similar",
      "Experiência com Google Ads, Facebook Ads, SEO",
      "Conhecimento em Analytics e ferramentas de BI",
      "Criatividade e visão estratégica",
      "Portfolio comprovado em e-commerce"
    ],
    responsibilities: [
      "Gestão de campanhas digitais",
      "Otimização SEO/SEM",
      "Criação de conteúdo para redes sociais",
      "Análise de métricas e ROI",
      "Desenvolvimento de estratégias de conversão"
    ]
  },
  {
    title: "Coordenador de Logística",
    location: "Lisboa, Portugal",
    type: "Tempo Integral",
    department: "Operações",
    salary: "€2.000 - €3.200",
    description: "Líder operacional para coordenar entregas internacionais e garantir excelência na logística premium.",
    requirements: [
      "Experiência em logística internacional",
      "Conhecimento em sistemas WMS/ERP",
      "Gestão de fornecedores e transportadoras",
      "Inglês fluente",
      "Liderança e organização"
    ],
    responsibilities: [
      "Coordenação de entregas para 15 países",
      "Gestão de estoque e armazenagem",
      "Relacionamento com transportadoras",
      "Otimização de custos logísticos",
      "Implementação de melhorias"
    ]
  },
  {
    title: "Representante Comercial Europa",
    location: "Múltiplas Localizações",
    type: "Tempo Integral",
    department: "Vendas",
    salary: "€2.800 - €5.000",
    description: "Representante experiente para expansão comercial em novos mercados europeus.",
    requirements: [
      "Experiência em vendas B2B internacional",
      "Rede de contatos no setor beleza",
      "Disponibilidade para viagens",
      "Fluência em múltiplos idiomas europeus",
      "Histórico comprovado de resultados"
    ],
    responsibilities: [
      "Prospecção de novos mercados",
      "Desenvolvimento de parcerias estratégicas",
      "Participação em feiras internacionais",
      "Treinamento de equipes locais",
      "Atingimento de metas regionais"
    ]
  }
];

const selectionProcess = [
  {
    step: "1",
    title: "Candidatura Online",
    description: "Envie seu currículo através do formulário ou email com carta de motivação personalizada."
  },
  {
    step: "2", 
    title: "Triagem de Perfil",
    description: "Nossa equipe de RH analisa cuidadosamente cada candidatura, focando em fit cultural e técnico."
  },
  {
    step: "3",
    title: "Entrevista Inicial",
    description: "Conversa por videochamada para conhecimento mútuo e alinhamento de expectativas."
  },
  {
    step: "4",
    title: "Avaliação Técnica",
    description: "Testes práticos e/ou apresentações específicas da função para avaliar competências."
  },
  {
    step: "5",
    title: "Entrevista Final",
    description: "Encontro com gestores diretos para definição final e discussão de proposta."
  },
  {
    step: "6",
    title: "Proposta e Integração",
    description: "Formalização da proposta e início do programa de integração personalizado."
  }
];

const testimonials = [
  {
    name: "Ana Silva",
    role: "Consultora Senior há 3 anos",
    text: "A JC Hair Studio me proporcionou crescimento profissional que eu nunca imaginei. Trabalhar com produtos premium e clientes exigentes me tornou uma profissional muito mais capacitada.",
    location: "Lisboa"
  },
  {
    name: "Marie Dubois",
    role: "Especialista em Atendimento há 2 anos", 
    text: "O ambiente multicultural e o foco na excelência fazem desta empresa um lugar único para trabalhar. Sinto-me valorizada e motivada todos os dias.",
    location: "Bruxelas"
  },
  {
    name: "Carlos Martinez", 
    role: "Analista de Marketing há 1 ano",
    text: "A liberdade criativa e o investimento em tecnologia me permitem desenvolver campanhas inovadoras. É gratificante ver o impacto direto do meu trabalho nos resultados.",
    location: "Lisboa"
  }
];

export default function TrabalheConoscoPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    cv: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, cv: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Candidatura enviada com sucesso! Entraremos em contato em breve.');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-light mb-6 leading-tight">
              Construa sua carreira na
              <span className="italic"> beleza premium</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Junte-se à equipe líder em extensões de cabelo na Europa. Oferecemos 
              oportunidades únicas de crescimento em um ambiente internacional, 
              inovador e apaixonado pela excelência.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#vagas" 
                className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-center font-medium"
              >
                Ver Vagas Abertas
              </a>
              <a 
                href="#candidatar" 
                className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors text-center font-medium"
              >
                Candidatar-se Já
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Nossa Cultura
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acreditamos que pessoas apaixonadas e motivadas são a base do nosso sucesso. 
              Conheça os valores que nos guiam diariamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${value.color}`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Benefícios Exclusivos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos um pacote completo de benefícios que valoriza seu bem-estar, 
              crescimento e qualidade de vida.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 mb-4">{benefit.description}</p>
                      <ul className="space-y-2">
                        {benefit.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="vagas" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Vagas Abertas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oportunidades únicas para profissionais que desejam fazer parte da nossa jornada de crescimento internacional.
            </p>
          </div>

          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedJob(selectedJob === index ? null : index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-medium text-gray-900">{job.title}</h3>
                        <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Euro size={16} />
                          {job.salary}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{job.description}</p>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      {selectedJob === index ? '−' : '+'}
                    </button>
                  </div>
                </div>

                {selectedJob === index && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="pt-6 grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Requisitos</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Responsabilidades</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="flex items-start gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6">
                      <a 
                        href="#candidatar"
                        className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Candidatar-se para esta Vaga
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Processo Seletivo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Um processo transparente e respeitoso, desenhado para conhecermos 
              você melhor e vice-versa.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200 hidden lg:block"></div>
            
            <div className="space-y-12">
              {selectionProcess.map((step, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-medium text-lg lg:relative lg:left-0 lg:transform-none">
                    {step.step}
                  </div>
                  
                  <div className="hidden lg:block lg:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Employee Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Depoimentos da Equipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça as experiências de quem já faz parte da nossa família profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="candidatar" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Candidate-se Agora
            </h2>
            <p className="text-xl text-gray-600">
              Envie sua candidatura e dê o primeiro passo para fazer parte da nossa equipe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="seu.email@exemplo.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="+351 XXX XXX XXX"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Vaga de Interesse
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Selecione uma vaga</option>
                  {jobOpenings.map((job, index) => (
                    <option key={index} value={job.title}>
                      {job.title} - {job.location}
                    </option>
                  ))}
                  <option value="geral">Candidatura Geral</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-2">
                Currículo (PDF) *
              </label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Carta de Motivação *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Conte-nos por que deseja trabalhar conosco e como pode contribuir para nosso sucesso..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Enviar Candidatura
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Ao enviar sua candidatura, você concorda com o processamento dos seus dados pessoais conforme nossa política de privacidade.
            </p>
          </form>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            Dúvidas sobre as Vagas?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Nossa equipe de Recursos Humanos está disponível para esclarecer qualquer questão sobre oportunidades de carreira.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-medium mb-2">Email RH</h3>
              <a href="mailto:rh@jchairstudios62.xyz" className="text-gray-300 hover:text-white">
                rh@jchairstudios62.xyz
              </a>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-medium mb-2">WhatsApp</h3>
              <a href="https://wa.me/32470032758" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                +32 470 032 758
              </a>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} />
              </div>
              <h3 className="font-medium mb-2">LinkedIn</h3>
              <a href="#" className="text-gray-300 hover:text-white">
                JC Hair Studio's 62
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}