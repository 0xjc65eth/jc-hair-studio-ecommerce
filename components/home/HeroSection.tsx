'use client';

import Link from 'next/link';
import { ArrowRight, Play, Shield, Truck, Award, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  className?: string;
}

// PERFORMANCE OPTIMIZATION: Substituído framer-motion por CSS animations
// - Redução de bundle size: ~60KB (framer-motion removido)
// - Melhor performance: CSS animations usam GPU acceleration
// - Menor tempo de carregamento inicial (LCP)
export default function HeroSection({ className = '' }: HeroSectionProps) {
  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${className}`}>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUpSmall {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUpDelay {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-small {
          animation: fadeInUpSmall 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up-small-delay-1 {
          animation: fadeInUpSmall 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-small-delay-2 {
          animation: fadeInUpSmall 0.8s ease-out 0.9s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-small-delay-3 {
          animation: fadeInUpSmall 0.8s ease-out 1.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delay {
          animation: fadeInUpDelay 0.8s ease-out 1.5s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10" />
      <div className="absolute inset-0">
        <img
          src="/images/hero-brazilian-beauty.jpg"
          alt="Brazilian Beauty - Premium Products"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-24 w-full">
        <div className="max-w-2xl">
          {/* Accent Line - CSS Animation */}
          <div className="flex items-center mb-6 animate-fade-in-left">
            <div className="h-px bg-luxo-dourado w-12 mr-4" />
            <span className="text-luxo-dourado text-sm font-medium tracking-widest uppercase">
              Brazilian Beauty Excellence
            </span>
          </div>

          {/* Main Headline - CSS Animation */}
          <h1 className="font-playfair text-5xl md:text-7xl text-white mb-6 leading-tight hero-text-shadow animate-fade-in-up">
            Authentic Brazilian
            <span className="italic text-luxo-dourado block"> Beauty</span>
          </h1>

          {/* Subheading - CSS Animation */}
          <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg animate-fade-in-up-small-delay-1">
            Discover the secret of Brazilian beauty with our curated collection of premium products.
            Imported directly from Brazil's most prestigious brands.
          </p>

          {/* CTA Buttons - CSS Animation */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up-small-delay-2">
            <Link
              href="/produtos"
              className="bg-luxo-dourado text-black px-8 py-4 rounded-lg hover:bg-yellow-400 transition-all duration-300 text-center font-medium flex items-center justify-center group interactive-button"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all duration-300 text-center font-medium flex items-center justify-center interactive-button"
              onClick={() => {
                // Add video modal functionality here
                console.log('Open video modal');
              }}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Story
            </button>
          </div>

          {/* Trust Indicators - CSS Animation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80 text-sm animate-fade-in-up-small-delay-3">
            <div className="flex items-center trust-indicator">
              <Shield className="trust-icon mr-2" />
              <span>Authentic Brazilian Products</span>
            </div>
            <div className="flex items-center trust-indicator">
              <Truck className="trust-icon mr-2" />
              <span>Free EU Shipping</span>
            </div>
            <div className="flex items-center trust-indicator">
              <Award className="trust-icon mr-2" />
              <span>30+ Years Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 right-10 floating-element">
        <Sparkles className="w-8 h-8 text-luxo-dourado opacity-60" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 floating-element">
        <Sparkles className="w-6 h-6 text-luxo-dourado opacity-40" />
      </div>
      <div className="absolute top-1/2 right-1/2 floating-element">
        <Sparkles className="w-4 h-4 text-luxo-dourado opacity-30" />
      </div>

      {/* Scroll Indicator - CSS Animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in-up-delay">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}