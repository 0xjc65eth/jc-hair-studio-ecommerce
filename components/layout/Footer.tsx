'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Truck,
  Shield,
  Clock
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    produtos: [
      { name: 'Mega Hair', href: '/categoria/mega-hair' },
      { name: 'Progressiva Vogue', href: '/categoria/progressiva' },
      { name: 'Extensões Naturais', href: '/categoria/extensoes' },
      { name: 'Acessórios', href: '/categoria/acessorios' },
      { name: 'Kits Completos', href: '/categoria/kits' },
    ],
    atendimento: [
      { name: 'Como Comprar', href: '/ajuda/como-comprar' },
      { name: 'Formas de Pagamento', href: '/ajuda/pagamento' },
      { name: 'Envio e Entrega', href: '/ajuda/envio' },
      { name: 'Trocas e Devoluções', href: '/ajuda/devolucoes' },
      { name: 'FAQ', href: '/ajuda/faq' },
    ],
    empresa: [
      { name: 'Sobre Nós', href: '/sobre' },
      { name: 'Nossa História', href: '/sobre/historia' },
      { name: 'Trabalhe Conosco', href: '/carreiras' },
      { name: 'Imprensa', href: '/imprensa' },
      { name: 'Contato', href: '/contato' },
    ],
    legal: [
      { name: 'Política de Privacidade', href: '/privacidade' },
      { name: 'Termos de Uso', href: '/termos' },
      { name: 'Política de Cookies', href: '/cookies' },
      { name: 'LGPD', href: '/lgpd' },
    ],
  };

  const paymentMethods = [
    { name: 'Visa', icon: '/icons/visa.svg' },
    { name: 'Mastercard', icon: '/icons/mastercard.svg' },
    { name: 'American Express', icon: '/icons/amex.svg' },
    { name: 'PayPal', icon: '/icons/paypal.svg' },
    { name: 'SEPA', icon: '/icons/sepa.svg' },
    { name: 'Bitcoin', icon: '/icons/bitcoin.svg' },
  ];

  const shippingPartners = [
    { name: 'DHL', icon: '/icons/dhl.svg' },
    { name: 'FedEx', icon: '/icons/fedex.svg' },
    { name: 'UPS', icon: '/icons/ups.svg' },
    { name: 'CTT', icon: '/icons/ctt.svg' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/logo-white.svg"
                    alt="JC Hair Studio's 62"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-playfair text-xl font-medium">
                    JC Hair Studio's <span className="italic">62</span>
                  </h3>
                </div>
              </div>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Especialistas em extensões de cabelo premium. 
              Transformamos sonhos em realidade com qualidade 
              e elegância há mais de uma década.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                <span>Lisboa, Portugal • Bruxelas, Bélgica</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                <span>+351 928 375 226 • +32 049 748 4720</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <span>noreply@jchairstudios62.xyz</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <Link 
                href="https://instagram.com/jchairstudios62" 
                target="_blank"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link 
                href="https://facebook.com/jchairstudios62" 
                target="_blank"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href="https://youtube.com/jchairstudios62" 
                target="_blank"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-medium mb-6">Produtos</h4>
            <ul className="space-y-3">
              {footerLinks.produtos.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-medium mb-6">Atendimento</h4>
            <ul className="space-y-3">
              {footerLinks.atendimento.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-medium mb-6">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-medium mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-gray-800 bg-gray-800/50">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-full">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">Frete Grátis</p>
                <p className="text-xs text-gray-400">Acima de €75</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-full">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">Compra Segura</p>
                <p className="text-xs text-gray-400">SSL 256-bits</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-full">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">Entrega Rápida</p>
                <p className="text-xs text-gray-400">24h-72h</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-full">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">Parcelamento</p>
                <p className="text-xs text-gray-400">Sem juros</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Shipping */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Payment Methods */}
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-sm text-gray-400 mb-3">Formas de pagamento:</p>
              <div className="flex items-center space-x-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.name}
                    className="relative w-10 h-6 bg-white rounded opacity-80 hover:opacity-100 transition-opacity"
                    title={method.name}
                  >
                    <Image
                      src={method.icon}
                      alt={method.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Partners */}
            <div className="flex flex-col items-center lg:items-end">
              <p className="text-sm text-gray-400 mb-3">Parceiros de entrega:</p>
              <div className="flex items-center space-x-4">
                {shippingPartners.map((partner) => (
                  <div 
                    key={partner.name}
                    className="relative w-12 h-6 bg-white rounded opacity-80 hover:opacity-100 transition-opacity"
                    title={partner.name}
                  >
                    <Image
                      src={partner.icon}
                      alt={partner.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
              <p className="text-sm text-gray-400">
                © {currentYear} JC Hair Studio's 62. Todos os direitos reservados.
              </p>
              <p className="text-xs text-gray-500">
                NIF: 293147175
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <span>Desenvolvido com ❤️ em Portugal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}