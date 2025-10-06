'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  Heart,
  Globe,
  ChevronDown,
  Crown,
  Sparkles,
  Star,
  Scissors,
  Palette
} from 'lucide-react';
import { useCart } from '@/lib/stores/cartStore';
import { CartDrawer } from '../cart/CartDrawer';
import { PointsWidget } from '../points/PointsWidget';

interface NavigationItem {
  name: string;
  href: string;
  active: boolean;
  hasDropdown?: boolean;
  dropdownItems?: Array<{
    name: string;
    href: string;
  }>;
}

interface HeaderProps {
  className?: string;
}

export default function RevolutionaryHeader({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaHairDropdownOpen, setIsMegaHairDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsDropdownOpen, setIsMobileProductsDropdownOpen] = useState(false);

  const { getTotalItems, toggleCart } = useCart();
  const itemsCount = getTotalItems();

  const pathname = usePathname();

  const navigationItems = [
    { name: 'Início', href: '/', active: pathname === '/' },
    {
      name: 'Mega Hair Brasileiro',
      href: '/mega-hair',
      active: pathname === '/mega-hair',
      hasDropdown: true,
      dropdownItems: [
        { name: '🌟 Liso Premium Brasil', href: '/mega-hair/liso' },
        { name: '🌊 Ondulado Natural', href: '/mega-hair/ondulado' },
        { name: '💫 Cacheado Brasileiro', href: '/mega-hair/cacheado' },
        { name: '👑 Coleção VIP Exclusiva', href: '/mega-hair/vip' },
      ]
    },
    {
      name: 'Produtos Capilares',
      href: '/produtos',
      active: pathname.startsWith('/produtos'),
      hasDropdown: true,
      dropdownItems: [
        { name: 'PROGRESSIVA', href: '/categoria/progressivas' },
        { name: 'BOTOX - SELAGEM', href: '/categoria/botox-selagem' },
        { name: 'SHAMPOO & CONDICIONADOR', href: '/categoria/shampoos-condicionadores' },
        { name: 'TRATAMENTO CAPILAR', href: '/categoria/tratamentos-capilares' },
        { name: 'Ferramentas Profissionais', href: '/categoria/ferramentas-profissionais' },
      ]
    },
    { name: 'Maquiagem Brasileira', href: '/maquiagens', active: pathname === '/maquiagens' },
    { name: 'Cosméticos', href: '/cosmeticos', active: pathname.includes('/cosmeticos') },
    { name: 'Nossa História', href: '/sobre', active: pathname === '/sobre' },
  ];

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileProductsDropdownOpen(false);
    setIsMegaHairDropdownOpen(false);
    setIsProductsDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-gradient-to-r from-emerald-900/95 via-emerald-800/95 to-emerald-900/95 backdrop-blur-xl shadow-2xl border-b-2 border-yellow-400/30'
            : 'bg-gradient-to-r from-emerald-50/90 via-white/90 to-yellow-50/90 backdrop-blur-lg shadow-lg border-b border-emerald-100'
        } ${className}`}
      >
        {/* Revolutionary Brazilian Flag Accent */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-yellow-400 via-blue-500 to-emerald-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Revolutionary Brazilian Logo */}
            <Link
              href="/"
              className="flex-shrink-0 z-50 group"
              onClick={closeMobileMenu}
            >
              <div className="flex items-center">
                {/* Completely Revolutionary Logo Design */}
                <div className="relative transform group-hover:scale-105 transition-all duration-700">
                  {/* Hair Silhouette Background */}
                  <div className="relative w-16 h-16 lg:w-20 lg:h-20">
                    {/* Brazilian Flag Diamond Pattern */}
                    <div
                      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-700 border-4 border-white/50"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #fbbf24 25%, #3b82f6 50%, #fbbf24 75%, #10b981 100%)',
                        transform: 'rotate(-2deg)',
                        animation: 'logoShimmer 4s ease-in-out infinite'
                      }}
                    >
                      {/* Diamond Reflection */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20"></div>
                      {/* Animated Stripes */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 animate-pulse" style={{animationDelay: '2s'}}></div>
                    </div>

                    {/* Central Logo Container - Hair Studio Aesthetic */}
                    <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-inner border-3 border-white/70 h-full flex items-center justify-center backdrop-blur-sm">
                      {/* Floating Hair Strands with Physics */}
                      <div className="absolute top-3 left-3 w-1 h-10 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-full transform rotate-15 opacity-80 group-hover:rotate-30 group-hover:scale-110 transition-all duration-1000 shadow-lg"></div>
                      <div className="absolute top-4 right-4 w-0.5 h-8 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 rounded-full transform -rotate-20 opacity-70 group-hover:-rotate-35 group-hover:scale-110 transition-all duration-1000 shadow-lg"></div>
                      <div className="absolute bottom-3 left-4 w-0.5 h-6 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 rounded-full transform rotate-45 opacity-60 group-hover:rotate-90 group-hover:scale-110 transition-all duration-1000 shadow-lg"></div>
                      <div className="absolute bottom-4 right-3 w-1 h-7 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full transform -rotate-30 opacity-50 group-hover:-rotate-60 group-hover:scale-110 transition-all duration-1000 shadow-lg"></div>

                      {/* Central JC with Revolutionary Typography */}
                      <div className="text-center relative">
                        <div className="relative inline-block">
                          {/* J with Hair Curl */}
                          <span className="font-playfair text-2xl lg:text-4xl font-black bg-gradient-to-br from-emerald-800 via-emerald-600 to-emerald-900 bg-clip-text text-transparent drop-shadow-2xl relative">
                            J
                          </span>
                          {/* C with Hair Curl */}
                          <span className="font-playfair text-2xl lg:text-4xl font-black bg-gradient-to-br from-amber-700 via-yellow-500 to-yellow-700 bg-clip-text text-transparent drop-shadow-2xl">
                            C
                          </span>

                          {/* Hair Curls Above Letters */}
                          <div className="absolute -top-2 -left-1 w-3 h-3 border-3 border-emerald-500 rounded-full transform -rotate-45 group-hover:rotate-45 group-hover:scale-125 transition-all duration-700 shadow-md"></div>
                          <div className="absolute -top-2 -right-1 w-3 h-3 border-3 border-yellow-500 rounded-full transform rotate-45 group-hover:-rotate-45 group-hover:scale-125 transition-all duration-700 shadow-md"></div>

                          {/* Hair Tools Icons */}
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Scissors className="w-3 h-3 text-emerald-600 animate-pulse" style={{animationDelay: '1s'}} />
                          </div>
                          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                            <Palette className="w-3 h-3 text-amber-600 animate-pulse" style={{animationDelay: '3s'}} />
                          </div>
                        </div>
                      </div>

                      {/* Brazilian Geometric Accents */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-4 h-0.5 bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full opacity-80 group-hover:w-6 transition-all duration-500"></div>
                      </div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-4 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-full opacity-80 group-hover:w-6 transition-all duration-500"></div>
                      </div>

                      {/* Premium Quality Indicators */}
                      <div className="absolute top-1 right-1 flex space-x-0.5">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                      </div>
                    </div>

                    {/* Floating 62 Badge - Completely Redesigned */}
                    <div className="absolute -bottom-3 -right-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                      <div className="relative">
                        {/* Badge with Brazilian Diamond Shape */}
                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 transform rotate-45 rounded-2xl shadow-2xl border-4 border-white relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-transparent"></div>
                          <div className="absolute inset-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center transform -rotate-45">
                            <span className="font-black text-white text-base lg:text-lg drop-shadow-lg">
                              62
                            </span>
                          </div>
                        </div>

                        {/* Premium Sparkles */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full animate-ping opacity-75"></div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full shadow-lg"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Orbital Hair Elements */}
                    <div className="absolute -top-3 left-1/4 w-1 h-6 bg-gradient-to-b from-amber-300 to-transparent rounded-full opacity-70 group-hover:h-8 group-hover:opacity-90 transition-all duration-1000 transform rotate-12"></div>
                    <div className="absolute -top-2 right-1/3 w-0.5 h-4 bg-gradient-to-b from-yellow-400 to-transparent rounded-full opacity-80 group-hover:h-6 group-hover:opacity-100 transition-all duration-1000 transform -rotate-12"></div>
                    <div className="absolute -bottom-3 left-1/3 w-0.5 h-5 bg-gradient-to-t from-emerald-400 to-transparent rounded-full opacity-60 group-hover:h-7 group-hover:opacity-90 transition-all duration-1000 transform rotate-25"></div>
                    <div className="absolute -bottom-2 right-1/4 w-1 h-4 bg-gradient-to-t from-blue-400 to-transparent rounded-full opacity-50 group-hover:h-6 group-hover:opacity-80 transition-all duration-1000 transform -rotate-25"></div>

                    {/* Floating Particles */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
                    <div className="absolute bottom-3 left-2 w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
                    <div className="absolute top-1/2 right-1 w-0.5 h-0.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
                    <div className="absolute top-1/3 left-1 w-1 h-1 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '3s', animationDuration: '4s'}}></div>
                  </div>
                </div>

                {/* Revolutionary Brand Typography */}
                <div className="ml-4 hidden sm:block">
                  <div className="relative">
                    {/* Main Brand Name with Hair-Inspired Effects */}
                    <div className="flex items-baseline mb-1">
                      <h1 className="font-playfair text-xl lg:text-3xl font-black tracking-tight">
                        <span className={`${isScrolled ? 'text-white' : 'text-emerald-900'} transition-colors duration-300 drop-shadow-sm`}>
                          JC Hair Studio's
                        </span>
                      </h1>

                      {/* Dynamic Quality Indicators */}
                      <div className="ml-4 flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-pulse shadow-lg"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-md" style={{animationDelay: '0.7s'}}></div>
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse shadow-sm" style={{animationDelay: '1.4s'}}></div>
                      </div>
                    </div>

                    {/* Signature 62 with Brazilian Identity */}
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="relative">
                        <span
                          className={`text-3xl lg:text-5xl font-black italic ${isScrolled ? 'text-yellow-300' : 'text-emerald-700'} transition-colors duration-300 drop-shadow-xl`}
                          style={{
                            fontFamily: 'Playfair Display, serif',
                            textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
                            WebkitTextStroke: '1px rgba(0,0,0,0.1)'
                          }}
                        >
                          62
                        </span>
                        {/* Signature Underline with Animation */}
                        <div className={`absolute -bottom-2 left-0 right-0 h-2 ${isScrolled ? 'bg-gradient-to-r from-yellow-300 to-amber-400' : 'bg-gradient-to-r from-emerald-500 to-yellow-500'} rounded-full transition-colors duration-300 shadow-lg`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Brazilian Heritage Badge */}
                      <div className="relative">
                        <div className={`px-4 py-2 rounded-2xl border-3 ${isScrolled ? 'border-emerald-200 bg-emerald-800/70' : 'border-emerald-600 bg-emerald-50'} transition-all duration-300 shadow-lg backdrop-blur-sm`}>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-black animate-pulse">🇧🇷</span>
                            <span className={`text-sm font-bold tracking-widest ${isScrolled ? 'text-emerald-100' : 'text-emerald-800'} transition-colors duration-300`}>
                              BRASIL PREMIUM
                            </span>
                          </div>
                        </div>
                        {/* Premium Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-yellow-400/30 rounded-2xl blur-md -z-10 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Tagline with Animated Hair Elements */}
                    <div className="flex items-center space-x-3">
                      {/* Animated Hair Strands in Tagline */}
                      <div className="flex space-x-1">
                        <div className="w-6 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transform rotate-12 group-hover:rotate-24 transition-transform duration-700 shadow-sm"></div>
                        <div className="w-4 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transform -rotate-12 group-hover:-rotate-24 transition-transform duration-700 shadow-sm"></div>
                        <div className="w-3 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transform rotate-6 group-hover:rotate-12 transition-transform duration-700 shadow-sm"></div>
                        <div className="w-2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transform -rotate-6 group-hover:-rotate-12 transition-transform duration-700 shadow-sm"></div>
                      </div>
                      <span className={`text-xs font-bold tracking-wider uppercase ${isScrolled ? 'text-emerald-200' : 'text-emerald-700'} transition-colors duration-300`}>
                        TRADIÇÃO • QUALIDADE • EUROPA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Enhanced Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative group"
                      onMouseEnter={() => {
                        if (item.name === 'Mega Hair Brasileiro') {
                          setIsMegaHairDropdownOpen(true);
                        } else if (item.name === 'Produtos Capilares') {
                          setIsProductsDropdownOpen(true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (item.name === 'Mega Hair Brasileiro') {
                          setIsMegaHairDropdownOpen(false);
                        } else if (item.name === 'Produtos Capilares') {
                          setIsProductsDropdownOpen(false);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-1 px-3 py-2 font-semibold text-xs lg:text-sm transition-all duration-300 rounded-xl border-2 border-transparent hover:border-yellow-400/50 group relative overflow-hidden ${
                          item.active
                            ? `${isScrolled ? 'text-yellow-300 bg-emerald-700/70' : 'text-emerald-700 bg-yellow-50'} border-yellow-400/60`
                            : `${isScrolled ? 'text-white hover:text-yellow-300' : 'text-emerald-800 hover:text-emerald-600'} hover:bg-gradient-to-r hover:from-emerald-50 hover:to-yellow-50`
                        }`}
                      >
                        {/* Enhanced Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 to-yellow-400/0 group-hover:from-emerald-400/20 group-hover:to-yellow-400/20 transition-all duration-500 rounded-2xl"></div>
                        <span className="relative z-10">{item.name}</span>
                        <ChevronDown className="w-4 h-4 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                      </Link>

                      {((item.name === 'Mega Hair Brasileiro' && isMegaHairDropdownOpen) ||
                        (item.name === 'Produtos Capilares' && isProductsDropdownOpen)) && item.dropdownItems && (
                        <div className="absolute top-full left-0 pt-2 z-50">
                          <div className="w-80 bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-2xl border-3 border-emerald-100 py-4 backdrop-blur-xl">
                            {/* Enhanced Dropdown Header */}
                            <div className="px-6 pb-3 border-b border-emerald-100">
                              <span className="text-emerald-700 font-bold text-base flex items-center">
                                <Crown className="w-5 h-5 mr-3 text-yellow-500" />
                                {item.name}
                              </span>
                            </div>
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className="block px-6 py-4 text-sm text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-yellow-50 hover:text-emerald-800 transition-all duration-300 font-medium border-l-4 border-transparent hover:border-yellow-400 mx-3 rounded-xl"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-2 font-semibold text-xs lg:text-sm transition-all duration-300 rounded-xl border-2 border-transparent hover:border-yellow-400/50 group relative overflow-hidden ${
                        item.active
                          ? `${isScrolled ? 'text-yellow-300 bg-emerald-700/70' : 'text-emerald-700 bg-yellow-50'} border-yellow-400/60`
                          : `${isScrolled ? 'text-white hover:text-yellow-300' : 'text-emerald-800 hover:text-emerald-600'} hover:bg-gradient-to-r hover:from-emerald-50 hover:to-yellow-50`
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 to-yellow-400/0 group-hover:from-emerald-400/20 group-hover:to-yellow-400/20 transition-all duration-500 rounded-2xl"></div>
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Enhanced Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isScrolled ? 'text-white hover:bg-emerald-700/50' : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span>PT</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isLanguageOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-emerald-100 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="w-full flex items-center px-5 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors font-medium rounded-xl mx-2"
                        onClick={() => setIsLanguageOpen(false)}
                      >
                        <span className="mr-3 text-lg">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isScrolled
                    ? 'text-white hover:bg-emerald-700/50 hover:text-yellow-300'
                    : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <Search className="w-6 h-6" />
              </button>

              <Link
                href="/favoritos"
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-110 relative ${
                  isScrolled
                    ? 'text-white hover:bg-emerald-700/50 hover:text-yellow-300'
                    : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <Heart className="w-6 h-6" />
              </Link>

              <PointsWidget compact={true} />

              <Link
                href="/conta"
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isScrolled
                    ? 'text-white hover:bg-emerald-700/50 hover:text-yellow-300'
                    : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <User className="w-6 h-6" />
              </Link>

              {/* Revolutionary Cart */}
              <button
                onClick={toggleCart}
                data-testid="cart-button"
                aria-label="Carrinho de compras"
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-110 relative group ${
                  isScrolled
                    ? 'text-white hover:bg-emerald-700/50 hover:text-yellow-300'
                    : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
                style={{ position: 'relative', zIndex: 60 }}
              >
                <ShoppingBag className="w-7 h-7 group-hover:scale-110 transition-transform" />
                {itemsCount > 0 && (
                  <span className="cart-counter" data-testid="cart-counter">
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-3 rounded-xl transition-colors ${
                  isScrolled ? 'text-white' : 'text-emerald-700'
                }`}
              >
                <Search className="w-6 h-6" />
              </button>

              <button
                onClick={toggleCart}
                data-testid="mobile-cart-button"
                aria-label="Carrinho"
                className={`p-3 rounded-xl transition-colors relative group ${
                  isScrolled ? 'text-white' : 'text-emerald-700'
                }`}
                style={{ position: 'relative', zIndex: 60 }}
              >
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {itemsCount > 0 && (
                  <span className="cart-counter" data-testid="mobile-cart-counter">
                    {itemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleMobileMenu}
                className={`p-3 rounded-xl transition-colors z-50 ${
                  isScrolled ? 'text-white' : 'text-emerald-700'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-emerald-200/50 bg-gradient-to-r from-emerald-50/95 to-yellow-50/95 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center space-x-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="🔍 Buscar mega hair brasileiro, progressivas Vogue, maquiagem premium..."
                    className="w-full pl-8 pr-16 py-6 border-3 border-emerald-200 rounded-3xl focus:outline-none focus:ring-6 focus:ring-yellow-400/40 focus:border-emerald-400 bg-white/90 backdrop-blur-sm text-emerald-800 placeholder-emerald-500 font-medium text-lg shadow-lg"
                    autoFocus
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-emerald-400 w-8 h-8" />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-8 py-4 text-emerald-700 hover:text-emerald-600 border-3 border-emerald-200 rounded-2xl font-bold bg-white/90 hover:bg-emerald-50 transition-all duration-300 shadow-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={closeMobileMenu} />
      )}

      <div className={`
        fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-emerald-800 to-emerald-900 z-50 transform transition-transform duration-500 lg:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full text-white">
          <div className="flex items-center justify-between p-8 border-b border-emerald-700">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-bold text-yellow-300">Menu Brasileiro</h2>
            </div>
            <button onClick={closeMobileMenu} className="p-3 text-emerald-200 hover:text-white">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-8 py-6 space-y-3">
              {navigationItems.map((item) => (
                <div key={item.href}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => {
                          if (item.name === 'Mega Hair Brasileiro' || item.name === 'Produtos Capilares') {
                            setIsMobileProductsDropdownOpen(!isMobileProductsDropdownOpen);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-6 py-5 text-lg font-bold rounded-2xl transition-all duration-300 ${
                          item.active
                            ? 'bg-yellow-400/30 text-yellow-300 border-2 border-yellow-400/50'
                            : 'text-emerald-100 hover:bg-emerald-700/70 hover:text-white'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${
                          isMobileProductsDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {isMobileProductsDropdownOpen && item.dropdownItems && (
                        <div className="ml-6 mt-3 space-y-2">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-6 py-4 text-base text-emerald-200 hover:bg-emerald-700/40 hover:text-white rounded-xl transition-all duration-300 border-l-4 border-transparent hover:border-yellow-400"
                              onClick={closeMobileMenu}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-6 py-5 text-lg font-bold rounded-2xl transition-all duration-300 ${
                        item.active
                          ? 'bg-yellow-400/30 text-yellow-300 border-2 border-yellow-400/50'
                          : 'text-emerald-100 hover:bg-emerald-700/70 hover:text-white'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="border-t border-emerald-700 px-8 py-6">
              <div className="space-y-3">
                <Link
                  href="/auth/signin"
                  className="flex items-center px-6 py-4 text-lg font-medium text-emerald-100 hover:bg-emerald-700/70 hover:text-white rounded-xl transition-colors"
                  onClick={closeMobileMenu}
                >
                  <User className="w-6 h-6 mr-4" />
                  Entrar/Registrar
                </Link>

                <Link
                  href="/favoritos"
                  className="flex items-center px-6 py-4 text-lg font-medium text-emerald-100 hover:bg-emerald-700/70 hover:text-white rounded-xl transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Heart className="w-6 h-6 mr-4" />
                  Favoritos
                </Link>
              </div>
            </div>

            <div className="border-t border-emerald-700 px-8 py-6">
              <p className="text-base font-bold text-yellow-300 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-3" />
                Idioma
              </p>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="flex items-center justify-center px-4 py-3 text-sm border-2 border-emerald-600 rounded-xl hover:bg-emerald-700/70 transition-colors text-emerald-100"
                  >
                    <span className="mr-2 text-lg">{lang.flag}</span>
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes logoShimmer {
          0% { transform: rotate(-2deg) scale(1); }
          50% { transform: rotate(2deg) scale(1.02); }
          100% { transform: rotate(-2deg) scale(1); }
        }
      `}</style>
    </>
  );
}