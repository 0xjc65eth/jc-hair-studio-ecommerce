'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Globe, MessageCircle, Send, FileImage, HelpCircle, ShoppingCart, Truck, CreditCard } from 'lucide-react';

// Metadata would need to be moved to a separate file for client components
// For now, keeping the component structure

const offices = [
  {
    name: "Sede Principal Lisboa",
    address: "Rua das Extensões Premium, 62",
    city: "1200-123 Lisboa, Portugal",
    phone: "+351 XXX XXX XXX",
    email: "lisboa@jchairstudios62.xyz",
    hours: "Segunda a Sexta: 9h-18h | Sábado: 9h-13h",
    services: ["Showroom", "Atendimento Presencial", "Consultoria Especializada", "Retirada de Pedidos"],
    languages: ["Português", "Inglês", "Espanhol", "Francês"],
    mapUrl: "https://maps.google.com/?q=Lisboa+Portugal",
    isHeadquarters: true
  },
  {
    name: "Escritório Bruxelas", 
    address: "Avenue de la Beauté Premium, 62",
    city: "1050 Bruxelas, Bélgica", 
    phone: "+32 470 032 758",
    email: "bruxelas@jchairstudios62.xyz",
    hours: "Segunda a Sexta: 9h-17h",
    services: ["Escritório Comercial", "Atendimento Regional", "Parcerias B2B", "Suporte Logístico"],
    languages: ["Francês", "Holandês", "Inglês", "Alemão"],
    mapUrl: "https://maps.google.com/?q=Brussels+Belgium",
    isHeadquarters: false
  }
];

const contactChannels = [
  {
    icon: MessageCircle,
    name: "WhatsApp Premium",
    description: "Atendimento instantâneo com consultoria personalizada",
    contact: "+32 470 032 758",
    hours: "9h-20h (CET)",
    link: "https://wa.me/32470032758",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: Mail,
    name: "Email Geral",
    description: "Para dúvidas gerais, pedidos e informações",
    contact: "contato@jchairstudios62.xyz",
    hours: "Resposta em até 24h",
    link: "mailto:contato@jchairstudios62.xyz",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: ShoppingCart,
    name: "Suporte Vendas",
    description: "Consultoria especializada para escolha de produtos",
    contact: "vendas@jchairstudios62.xyz",
    hours: "Segunda a Sábado",
    link: "mailto:vendas@jchairstudios62.xyz", 
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: Truck,
    name: "Logística & Entregas",
    description: "Rastreamento, prazos e questões de entrega",
    contact: "logistica@jchairstudios62.xyz", 
    hours: "Segunda a Sexta",
    link: "mailto:logistica@jchairstudios62.xyz",
    color: "bg-orange-50 text-orange-600"
  }
];

const socialMedia = [
  { name: "Instagram", handle: "@jchairstudios62", link: "https://instagram.com/jchairstudios62" },
  { name: "Facebook", handle: "62 Beautys 62", link: "https://facebook.com/jchairstudios62" },
  { name: "TikTok", handle: "@jchairstudios62", link: "https://tiktok.com/@jchairstudios62" },
  { name: "YouTube", handle: "62 Beautys 62", link: "https://youtube.com/@jchairstudios62" }
];

const faqItems = [
  {
    question: "Qual o prazo de entrega para Portugal?",
    answer: "Para Portugal continental, o prazo é de 2-3 dias úteis. Ilhas: 3-5 dias úteis. Oferecemos também entrega expressa em 24h para Lisboa e Porto."
  },
  {
    question: "Fazem entregas em toda a Europa?",
    answer: "Sim! Atendemos 15 países europeus com prazos de 3-7 dias úteis. Consulte os prazos específicos para seu país no checkout."
  },
  {
    question: "Como agendar uma consultoria presencial?",
    answer: "Entre em contato via WhatsApp ou email para agendar sua visita ao nosso showroom em Lisboa. Atendimento personalizado com hora marcada."
  },
  {
    question: "Posso trocar ou devolver produtos?",
    answer: "Sim, oferecemos 30 dias para troca/devolução de produtos em perfeito estado. Consulte nossa política completa de trocas."
  },
  {
    question: "Quais formas de pagamento aceitas?",
    answer: "Cartões de crédito/débito, PayPal, transferência bancária e Klarna (parcelamento). Todas as transações são 100% seguras."
  },
  {
    question: "Como escolher a cor ideal?",
    answer: "Nossa equipe oferece consultoria gratuita via WhatsApp. Você pode enviar fotos do seu cabelo para recomendação personalizada."
  }
];

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    attachment: null as File | null,
    consent: false
  });

  const [selectedOffice, setSelectedOffice] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Por favor, aceite os termos de privacidade para continuar.');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      attachment: null,
      consent: false
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-light mb-6 leading-tight">
              Fale connosco
              <span className="italic"> estamos aqui para si</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Nossa equipe especializada está pronta para ajudá-la em todas as suas necessidades. 
              Seja para consultoria personalizada, dúvidas sobre produtos ou suporte pós-venda, 
              oferecemos atendimento premium em múltiplos idiomas e canais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/32470032758"
                target="_blank"
                rel="noopener noreferrer" 
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-center font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                WhatsApp Imediato
              </a>
              <a 
                href="#formulario" 
                className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors text-center font-medium"
              >
                Formulário de Contato
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Nossos Escritórios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Presença estratégica na Europa para melhor atendê-la. Escolha o escritório 
              mais próximo ou conveniente para seu contato.
            </p>
          </div>

          {/* Office Selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              {offices.map((office, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOffice(index)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedOffice === index
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {office.name}
                </button>
              ))}
            </div>
          </div>

          {/* Office Details */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {offices[selectedOffice].name}
                    {offices[selectedOffice].isHeadquarters && (
                      <span className="ml-2 bg-gray-900 text-white px-2 py-1 rounded text-xs">
                        SEDE
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Morada</p>
                    <p className="text-gray-600">{offices[selectedOffice].address}</p>
                    <p className="text-gray-600">{offices[selectedOffice].city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Telefone</p>
                    <a 
                      href={`tel:${offices[selectedOffice].phone}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {offices[selectedOffice].phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a 
                      href={`mailto:${offices[selectedOffice].email}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {offices[selectedOffice].email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Horário</p>
                    <p className="text-gray-600">{offices[selectedOffice].hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Idiomas</p>
                    <p className="text-gray-600">{offices[selectedOffice].languages.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Serviços Disponíveis</h4>
                <ul className="space-y-2">
                  {offices[selectedOffice].services.map((service, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <a 
                  href={offices[selectedOffice].mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <MapPin size={16} />
                  Ver no Mapa
                </a>
              </div>
            </div>

            {/* Interactive Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-4" />
                <p className="text-lg font-medium">Mapa Interativo</p>
                <p className="text-sm">{offices[selectedOffice].city}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Canais de Atendimento
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Múltiplas formas de entrar em contato, cada uma especializada para 
              diferentes tipos de necessidades e urgências.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${channel.color}`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{channel.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{channel.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="font-medium text-gray-900 text-sm">{channel.contact}</p>
                    <p className="text-xs text-gray-500">{channel.hours}</p>
                  </div>
                  <a 
                    href={channel.link}
                    target={channel.name === 'WhatsApp Premium' ? '_blank' : undefined}
                    rel={channel.name === 'WhatsApp Premium' ? 'noopener noreferrer' : undefined}
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium inline-block"
                  >
                    Contactar
                  </a>
                </div>
              );
            })}
          </div>

          {/* Social Media */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-8">Siga-nos nas Redes Sociais</h3>
            <div className="flex justify-center gap-6">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Globe size={24} />
                  </div>
                  <span className="text-sm font-medium">{social.name}</span>
                  <span className="text-xs text-gray-500">{social.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="formulario" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Formulário de Contato
            </h2>
            <p className="text-xl text-gray-600">
              Envie sua mensagem e nossa equipe entrará em contato em até 24 horas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                  placeholder="+351 XXX XXX XXX"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="produto">Dúvidas sobre Produtos</option>
                  <option value="consultoria">Consultoria Personalizada</option>
                  <option value="pedido">Status do Pedido</option>
                  <option value="entrega">Questões de Entrega</option>
                  <option value="troca">Trocas e Devoluções</option>
                  <option value="parceria">Parcerias Comerciais</option>
                  <option value="imprensa">Imprensa</option>
                  <option value="outros">Outros Assuntos</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
                Anexar Fotos (Opcional)
              </label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Para consultoria de cor, envie fotos do seu cabelo (máx. 5MB cada)
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                placeholder="Descreva detalhadamente sua necessidade ou dúvida..."
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600">
                  Concordo com o processamento dos meus dados pessoais conforme a{' '}
                  <Link href="/politica-privacidade" className="text-gray-900 underline hover:no-underline">
                    Política de Privacidade
                  </Link>{' '}
                  e{' '}
                  <Link href="/termos-uso" className="text-gray-900 underline hover:no-underline">
                    Termos de Uso
                  </Link>
                  . Autorizo o contato via email, telefone ou WhatsApp para resposta à minha solicitação. *
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Enviar Mensagem
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                💡 <strong>Dica:</strong> Para atendimento mais rápido, use nosso WhatsApp para dúvidas urgentes
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Respostas rápidas para as dúvidas mais comuns dos nossos clientes.
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle size={18} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Não encontrou a resposta que procura?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/32470032758"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Perguntar via WhatsApp
              </a>
              <a 
                href="mailto:contato@jchairstudios62.xyz"
                className="border border-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            Pronta para Transformar seu Visual?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Nossa equipe está aqui para ajudá-la a escolher as extensões perfeitas. 
            Entre em contato e descubra como podemos realizar seu sonho capilar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/produtos" 
              className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Ver Catálogo
            </Link>
            <a 
              href="https://wa.me/32470032758"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium"
            >
              Consultoria Grátis
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}