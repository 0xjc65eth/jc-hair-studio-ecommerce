import { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText, Image, Video, Mail, Phone, Calendar, Award, TrendingUp, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Imprensa - JC Hair Studio\'s 62',
  description: 'Kit de imprensa completo da JC Hair Studio\'s 62: press releases, logos, fotos oficiais, biografias e materiais para download para jornalistas e mídia.',
  keywords: [
    'imprensa JC Hair Studio',
    'press kit cabelo',
    'materiais imprensa',
    'releases empresa',
    'mídia beleza',
    'assessoria imprensa',
    'logos empresa',
    'fotos oficiais'
  ],
  openGraph: {
    title: 'Kit de Imprensa - JC Hair Studio\'s 62',
    description: 'Materiais oficiais para imprensa: logos, fotos, releases e informações da líder europeia em extensões premium.',
    type: 'website',
  },
};

const pressReleases = [
  {
    date: "15 de Janeiro, 2024",
    title: "JC Hair Studio's 62 Anuncia Crescimento de 40% em 2023 e Expansão para Novos Mercados",
    excerpt: "A empresa líder em extensões de cabelo premium na Europa registra seu melhor ano de vendas e prepara entrada nos mercados norte-americano e asiático.",
    category: "Resultados",
    downloadUrl: "/press/release-crescimento-2024.pdf"
  },
  {
    date: "3 de Dezembro, 2023",
    title: "Lançamento da Linha Sustentável: JC Hair Studio's 62 Pioneira em Extensões 100% Eco-Friendly",
    excerpt: "Nova linha de produtos utiliza exclusivamente cabelos naturais certificados e embalagens biodegradáveis, reforçando compromisso ambiental da empresa.",
    category: "Produto",
    downloadUrl: "/press/release-sustentavel-2023.pdf"
  },
  {
    date: "20 de Setembro, 2023", 
    title: "JC Hair Studio's 62 Conquista Prêmio 'Excelência Europeia em Beleza 2023'",
    excerpt: "Reconhecimento internacional destaca inovação, qualidade e atendimento premium que posicionam a empresa como referência no setor.",
    category: "Premiação",
    downloadUrl: "/press/release-premio-2023.pdf"
  },
  {
    date: "5 de Junho, 2023",
    title: "Abertura de Nova Base Logística em Madrid Fortalece Presença Ibérica",
    excerpt: "Investimento de €2 milhões em centro de distribuição reduz tempo de entrega em 50% para clientes espanholas e do sul da França.",
    category: "Expansão", 
    downloadUrl: "/press/release-madrid-2023.pdf"
  },
  {
    date: "12 de Março, 2023",
    title: "JC Hair Studio's 62 Lança Programa de Formação para Profissionais de Beleza",
    excerpt: "Iniciativa oferece certificações gratuitas em aplicação de extensões premium para cabeleireiros europeus, fortalecendo rede de parceiros.",
    category: "Educação",
    downloadUrl: "/press/release-formacao-2023.pdf"
  }
];

const logoAssets = [
  {
    name: "Logo Principal - Horizontal",
    formats: ["PNG", "SVG", "EPS"],
    variations: ["Colorido", "Preto", "Branco"],
    preview: "/logos/logo-horizontal-preview.png",
    downloadUrl: "/press/logos/logo-horizontal-pack.zip"
  },
  {
    name: "Logo Principal - Vertical", 
    formats: ["PNG", "SVG", "EPS"],
    variations: ["Colorido", "Preto", "Branco"],
    preview: "/logos/logo-vertical-preview.png",
    downloadUrl: "/press/logos/logo-vertical-pack.zip"
  },
  {
    name: "Símbolo da Marca",
    formats: ["PNG", "SVG", "EPS"], 
    variations: ["Colorido", "Preto", "Branco", "Transparente"],
    preview: "/logos/symbol-preview.png",
    downloadUrl: "/press/logos/symbol-pack.zip"
  },
  {
    name: "Logotipo Completo",
    formats: ["PNG", "SVG", "EPS"],
    variations: ["Colorido", "Preto", "Branco"],
    preview: "/logos/complete-logo-preview.png", 
    downloadUrl: "/press/logos/complete-pack.zip"
  }
];

const officialPhotos = [
  {
    title: "Sede Lisboa - Fachada Principal",
    description: "Vista externa da sede principal em Lisboa, Portugal",
    category: "Instalações",
    resolution: "4K (3840x2160)",
    downloadUrl: "/press/photos/sede-lisboa-fachada.jpg"
  },
  {
    title: "Showroom Premium - Interior",
    description: "Ambiente interno do showroom com produtos em exposição",
    category: "Instalações", 
    resolution: "4K (3840x2160)",
    downloadUrl: "/press/photos/showroom-interior.jpg"
  },
  {
    title: "Júlio César - Fundador e CEO",
    description: "Retrato oficial do fundador e CEO da empresa",
    category: "Equipe",
    resolution: "4K (3840x2160)",
    downloadUrl: "/press/photos/julio-cesar-ceo.jpg"
  },
  {
    title: "Produtos Premium - Linha Completa",
    description: "Foto oficial da linha completa de extensões premium",
    category: "Produtos",
    resolution: "4K (3840x2160)",
    downloadUrl: "/press/photos/produtos-linha-completa.jpg"
  },
  {
    title: "Processo de Aplicação Profissional",
    description: "Demonstração técnica de aplicação por especialista",
    category: "Processo",
    resolution: "4K (3840x2160)",
    downloadUrl: "/press/photos/aplicacao-profissional.jpg"
  },
  {
    title: "Equipe Internacional",
    description: "Foto oficial da equipe nas duas sedes principais",
    category: "Equipe",
    resolution: "4K (3840x2160)",
    downloadUrl: "/press/photos/equipe-internacional.jpg"
  }
];

const companyFacts = [
  { label: "Ano de Fundação", value: "1990" },
  { label: "Sede Principal", value: "Lisboa, Portugal" },
  { label: "Escritório Europeu", value: "Bruxelas, Bélgica" },
  { label: "Países Atendidos", value: "15" },
  { label: "Colaboradores", value: "50+" },
  { label: "Clientes Ativas", value: "50.000+" },
  { label: "Produtos no Catálogo", value: "500+" },
  { label: "Crescimento Anual", value: "40%" }
];

const founderBio = {
  name: "Júlio César",
  role: "Fundador e CEO",
  experience: "30+ anos",
  biography: "Júlio César é o visionário fundador da JC Hair Studio's 62, empresa que nasceu de sua paixão pela beleza capilar e evolução das técnicas de extensões. Com mais de três décadas de experiência no setor, transformou um pequeno salão local numa das principais referências europeias em extensões premium. Sua filosofia de 'nunca comprometer a qualidade' guiou a empresa através de todas as fases de crescimento, desde os primeiros anos em Portugal até a expansão internacional atual. Reconhecido como pioneiro em técnicas inovadoras de aplicação e especialista em cabelos naturais, Júlio César continua liderando a empresa com visão estratégica voltada para sustentabilidade e excelência no atendimento."
};

const mediaAppearances = [
  {
    outlet: "Vogue Portugal",
    date: "Janeiro 2024",
    title: "A Revolução das Extensões Sustentáveis",
    type: "Artigo",
    link: "#"
  },
  {
    outlet: "RTP1 - Economia",
    date: "Dezembro 2023", 
    title: "Entrevista: O Sucesso Internacional de uma Empresa Portuguesa",
    type: "TV",
    link: "#"
  },
  {
    outlet: "Marie Claire Europa",
    date: "Novembro 2023",
    title: "Beauty Entrepreneurs: Leading the European Market",
    type: "Revista",
    link: "#"
  },
  {
    outlet: "Público - Economia",
    date: "Setembro 2023",
    title: "JC Hair Studio's 62 Conquista Prémio Europeu",
    type: "Jornal",
    link: "#"
  }
];

const caseStudies = [
  {
    title: "Transformação Digital Durante a Pandemia",
    description: "Como a empresa adaptou-se rapidamente ao e-commerce e manteve crescimento durante COVID-19",
    downloadUrl: "/press/cases/transformacao-digital-covid.pdf",
    pages: "12 páginas"
  },
  {
    title: "Estratégia de Expansão Europeia", 
    description: "Estudo detalhado da penetração em mercados europeus e desenvolvimento de rede de parceiros",
    downloadUrl: "/press/cases/expansao-europeia.pdf",
    pages: "18 páginas"
  },
  {
    title: "Inovação em Sustentabilidade",
    description: "Implementação de práticas eco-friendly e desenvolvimento da linha sustentável",
    downloadUrl: "/press/cases/inovacao-sustentabilidade.pdf", 
    pages: "15 páginas"
  }
];

export default function ImprensaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
              Kit de Imprensa
              <span className="italic"> Oficial</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Materiais oficiais para jornalistas, blogueiros e profissionais de mídia. 
              Encontre press releases, logos em alta resolução, fotos oficiais, 
              biografias e dados atualizados sobre a JC Hair Studio's 62.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/press/kit-completo-jc-hair-studio.zip" 
                download
                className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-center font-medium flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Kit Completo (ZIP - 45MB)
              </a>
              <a 
                href="#contato-imprensa" 
                className="border border-gray-200 text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
              >
                Contacto para Imprensa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Press Releases Recentes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comunicados oficiais com as últimas novidades, resultados e marcos da empresa.
            </p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-500">{release.date}</span>
                      <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {release.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3 leading-tight">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{release.excerpt}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <a 
                      href={release.downloadUrl}
                      download
                      className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                    >
                      <FileText size={16} />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Logos Oficiais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Logotipos em alta resolução em diversos formatos e variações para uso editorial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {logoAssets.map((logo, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="aspect-[3/2] bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <Image size={48} className="mx-auto mb-2" />
                    <p className="text-sm">{logo.name}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">{logo.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Formatos:</span>
                    <div className="flex gap-1">
                      {logo.formats.map((format, fIndex) => (
                        <span key={fIndex} className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Variações:</span>
                    <div className="flex gap-1 flex-wrap">
                      {logo.variations.map((variation, vIndex) => (
                        <span key={vIndex} className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {variation}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a 
                  href={logo.downloadUrl}
                  download
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Pack
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Photos */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Fotos Oficiais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Biblioteca de imagens oficiais em alta resolução para uso editorial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officialPhotos.map((photo, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <Image size={32} className="mx-auto mb-2" />
                    <p className="text-xs">{photo.resolution}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                      {photo.category}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{photo.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{photo.description}</p>
                  <a 
                    href={photo.downloadUrl}
                    download
                    className="w-full bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Data */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Company Facts */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
                Dados da Empresa
              </h2>
              <div className="space-y-4">
                {companyFacts.map((fact, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">{fact.label}</span>
                    <span className="font-medium text-gray-900">{fact.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <a 
                  href="/press/dados-empresa-jc-hair-studio.pdf"
                  download
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <FileText size={16} />
                  Relatório Completo
                </a>
              </div>
            </div>

            {/* Founder Biography */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
                Biografia do Fundador
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{founderBio.name}</h3>
                    <p className="text-gray-600">{founderBio.role}</p>
                    <p className="text-sm text-gray-500">{founderBio.experience}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{founderBio.biography}</p>
                
                <div className="mt-6">
                  <a 
                    href="/press/biografia-julio-cesar.pdf"
                    download
                    className="text-gray-900 underline hover:no-underline font-medium"
                  >
                    Download biografia completa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Appearances */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Aparições na Mídia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Principais reportagens, entrevistas e menções em veículos de comunicação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaAppearances.map((appearance, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{appearance.outlet}</h3>
                    <p className="text-sm text-gray-500">{appearance.date}</p>
                  </div>
                  <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                    {appearance.type}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{appearance.title}</p>
                <a 
                  href={appearance.link}
                  className="text-gray-900 underline hover:no-underline text-sm font-medium"
                >
                  Ver conteúdo
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Estudos de Caso
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Análises aprofundadas de estratégias, resultados e inovações da empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                  <FileText size={24} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{study.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{study.description}</p>
                <p className="text-sm text-gray-500 mb-6">{study.pages}</p>
                <a 
                  href={study.downloadUrl}
                  download
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Estudo
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section id="contato-imprensa" className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light mb-6">
              Contacto para Imprensa
            </h2>
            <p className="text-xl text-gray-300">
              Nossa equipe de comunicação está disponível para entrevistas, 
              esclarecimentos e fornecimento de materiais adicionais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-medium mb-6">Assessoria de Imprensa</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:imprensa@jchairstudios62.xyz" className="text-gray-300 hover:text-white">
                      imprensa@jchairstudios62.xyz
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Telefone</p>
                    <a href="tel:+351000000000" className="text-gray-300 hover:text-white">
                      +351 XXX XXX XXX
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Disponibilidade</p>
                    <p className="text-gray-300">Segunda a Sexta, 9h-18h CET</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-6">Solicitações Especiais</h3>
              <div className="bg-white/5 p-6 rounded-lg">
                <p className="text-gray-300 mb-4">
                  Para entrevistas exclusivas, visitas às instalações, sessões fotográficas 
                  ou materiais personalizados, contacte nossa equipe com antecedência mínima de 48h.
                </p>
                <p className="text-gray-300 text-sm">
                  Respondemos a todas as solicitações de imprensa em até 24 horas úteis.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 text-gray-300">
              <Award size={20} />
              <span>Material oficial autorizado para uso editorial</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}