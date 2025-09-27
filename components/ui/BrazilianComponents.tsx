'use client';

import { ReactNode } from 'react';
import { Shield, Award, Truck, Phone, Mail, MapPin, Star, CheckCircle, Lock, CreditCard } from 'lucide-react';

// ===== BRAZILIAN HEADER COMPONENT =====
interface BrazilianHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function BrazilianHeader({ title, subtitle, children, className = '' }: BrazilianHeaderProps) {
  return (
    <div className={`brazilian-header ${className}`}>
      <div className="container-custom py-12 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🇧🇷</span>
            <span className="text-sm font-semibold text-green-100 tracking-wider uppercase">
              Autêntico do Brasil
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg lg:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

// ===== PROFESSIONAL PRODUCT CARD =====
interface BrazilianProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  trending?: boolean;
  bestseller?: boolean;
  authentic?: boolean;
  onClick?: () => void;
}

export function BrazilianProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  brand,
  rating = 4.8,
  reviews = 0,
  inStock = true,
  trending = false,
  bestseller = false,
  authentic = true,
  onClick
}: BrazilianProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="product-card-brasil group cursor-pointer" onClick={onClick} data-product-id={id} data-product-name={name}>
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {authentic && (
            <div className="brasil-badge text-xs">
              Autêntico
            </div>
          )}
          {bestseller && (
            <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              🔥 BEST SELLER
            </div>
          )}
          {trending && (
            <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              📈 TRENDING
            </div>
          )}
          {discount > 0 && (
            <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-3 right-3">
          {inStock ? (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              ✅ Em Stock
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              ❌ Esgotado
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">{brand}</span>
          <span className="text-xs">🇧🇷</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-brasil">
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating} ({reviews} avaliações)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {originalPrice && (
            <span className="text-gray-500 line-through text-sm">
              €{originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-2xl font-bold text-brasil">
            €{price.toFixed(2)}
          </span>
        </div>

        {/* Action Button */}
        <button className="btn-brasil w-full">
          <span>Adicionar ao Carrinho</span>
          <span>🛒</span>
        </button>
      </div>
    </div>
  );
}

// ===== SECURITY BADGES SECTION =====
export function SecurityBadges() {
  const badges = [
    { icon: <Shield className="w-4 h-4" />, text: 'SSL 256-bit', color: 'blue' },
    { icon: <CheckCircle className="w-4 h-4" />, text: 'PCI Compliant', color: 'green' },
    { icon: <Award className="w-4 h-4" />, text: 'Garantia 30d', color: 'yellow' },
    { icon: <Truck className="w-4 h-4" />, text: 'Envio Seguro', color: 'purple' },
    { icon: <CreditCard className="w-4 h-4" />, text: 'Pagto Protegido', color: 'indigo' }
  ];

  return (
    <div className="security-badges">
      {badges.map((badge, index) => (
        <div key={index} className={`security-badge trust-indicator ${badge.color === 'security' ? 'security' : ''}`}>
          {badge.icon}
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

// ===== BRAZILIAN TESTIMONIALS =====
export function BrazilianTestimonials() {
  const testimonials = [
    {
      name: 'Maria Silva',
      location: 'Lisboa, Portugal',
      rating: 5,
      text: 'Produtos autênticos brasileiros! A progressiva Vogue deixou meu cabelo incrível. Entrega super rápida.',
      product: 'Progressiva Vogue',
      verified: true
    },
    {
      name: 'Ana Costa',
      location: 'Porto, Portugal',
      rating: 5,
      text: 'Mega hair brasileiro de qualidade excepcional. Parece meu próprio cabelo! Recomendo 100%.',
      product: 'Mega Hair 60cm',
      verified: true
    },
    {
      name: 'Carla Ferreira',
      location: 'Bruxelas, Bélgica',
      rating: 5,
      text: 'Finalmente encontrei produtos brasileiros autênticos na Europa! Atendimento nota 10.',
      product: 'BTX Capilar',
      verified: true
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-playfair font-bold mb-4">
            O que dizem nossos <span className="text-brasil">clientes brasileiros</span>
          </h2>
          <p className="text-gray-600">
            Avaliações reais de clientes que confiam na nossa qualidade
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="professional-card p-6 text-center">
              {/* Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.text}"
              </p>

              {/* Product */}
              <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                {testimonial.product}
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-center gap-2">
                  <strong className="text-gray-900">{testimonial.name}</strong>
                  {testimonial.verified && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== PROFESSIONAL CONTACT INFO =====
export function ProfessionalContact() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold mb-1">Suporte 24/7</div>
              <div className="text-gray-300 text-sm">+351 928 375 226</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold mb-1">Email Profissional</div>
              <div className="text-gray-300 text-sm">juliocesarurss62@gmail.com</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold mb-1">Localização</div>
              <div className="text-gray-300 text-sm">Seixal, Portugal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== TRUST INDICATORS BANNER =====
export function TrustIndicators() {
  return (
    <div className="bg-green-50 border-l-4 border-green-400 py-4 px-6">
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-green-800">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Compra 100% Segura</span>
        </div>
        <div className="flex items-center gap-2 text-green-800">
          <Truck className="w-4 h-4" />
          <span className="font-medium">Frete Grátis +€50</span>
        </div>
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Garantia 30 Dias</span>
        </div>
        <div className="flex items-center gap-2 text-green-800">
          <span>🇧🇷</span>
          <span className="font-medium">Produtos Autênticos</span>
        </div>
      </div>
    </div>
  );
}

// ===== BRAZILIAN STATS =====
export function BrazilianStats() {
  const stats = [
    { number: '2.847', label: 'Clientes Satisfeitos', icon: '😊' },
    { number: '40+', label: 'Anos de Experiência', icon: '🏆' },
    { number: '15+', label: 'Países Atendidos', icon: '🌍' },
    { number: '98%', label: 'Satisfação Garantida', icon: '⭐' }
  ];

  return (
    <div className="bg-gray-900 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stat.number}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}