'use client';

import Link from 'next/link';
import { ArrowRight, Play, Shield, Truck, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${className}`}>
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
          {/* Accent Line */}
          <motion.div 
            className="flex items-center mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px bg-luxo-dourado w-12 mr-4" />
            <span className="text-luxo-dourado text-sm font-medium tracking-widest uppercase">
              Brazilian Beauty Excellence
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            className="font-playfair text-5xl md:text-7xl text-white mb-6 leading-tight hero-text-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Authentic Brazilian
            <span className="italic text-luxo-dourado block"> Beauty</span>
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover the secret of Brazilian beauty with our curated collection of premium products. 
            Imported directly from Brazil's most prestigious brands.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
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
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
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
          </motion.div>
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
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
}