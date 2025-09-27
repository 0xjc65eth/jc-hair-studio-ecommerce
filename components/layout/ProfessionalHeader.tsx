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
  Star
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

export default function ProfessionalHeader({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsDropdownOpen, setIsMobileProductsDropdownOpen] = useState(false);

  const { getTotalItems, toggleCart } = useCart();
  const itemsCount = getTotalItems();

  const pathname = usePathname();

  const navigationItems = [
    { name: 'Início', href: '/', active: pathname === '/' },
    {
      name: 'Produtos Capilares',
      href: '/produtos',
      active: pathname.startsWith('/produtos') && !pathname.startsWith('/produto/'),
      hasDropdown: true,
      dropdownItems: [
        { name: 'Progressivas & Alisamentos', href: '/categoria/progressivas-alisamentos' },
        { name: 'Tratamentos Capilares', href: '/categoria/tratamentos-capilares' },
        { name: 'Shampoos & Condicionadores', href: '/categoria/shampoos-condicionadores' },
        { name: 'Ferramentas Profissionais', href: '/categoria/ferramentas-profissionais' },
      ]
    },
    { name: 'Cosméticos', href: '/cosmeticos', active: pathname.includes('/cosmeticos') },
    { name: 'Maquiagens', href: '/maquiagens', active: pathname === '/maquiagens' },
    { name: 'Mega Hair', href: '/mega-hair', active: pathname === '/mega-hair' },
    { name: 'Sobre Nós', href: '/sobre', active: pathname === '/sobre' },
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
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-gradient-to-r from-emerald-900/95 via-emerald-800/95 to-emerald-900/95 backdrop-blur-xl shadow-2xl border-b-2 border-yellow-400/30'
            : 'bg-gradient-to-r from-emerald-50/90 via-white/90 to-yellow-50/90 backdrop-blur-lg shadow-lg border-b border-emerald-100'
        } ${className}`}
      >
        {/* Brazilian Flag Accent Line */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-yellow-400 via-blue-500 to-emerald-500"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-28">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 z-50"
              onClick={closeMobileMenu}
            >
              <div className="flex items-center">
                <div className="relative">
                  {/* Main Logo Circle */}
                  <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-yellow-400/50 group-hover:border-yellow-400/80">
                    {/* Inner Circle with JC */}
                    <div className="absolute inset-2 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-inner">
                      <span className="font-playfair text-2xl lg:text-3xl font-black text-emerald-900">
                        JC
                      </span>
                    </div>

                    {/* Brazilian Crown */}
                    <div className="absolute -top-2 -right-1">
                      <Crown className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
                    </div>

                    {/* Sparkle Effect */}
                    <div className="absolute -top-1 -left-1">
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                    </div>
                  </div>

                  {/* 62 Badge */}
                  <div className="absolute -bottom-1 -right-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                      62
                    </div>
                  </div>
                </div>
                <div className="ml-4 hidden sm:block">
                  <div className="flex items-center mb-1">
                    <h1 className="font-playfair text-2xl lg:text-3xl font-bold text-emerald-800">
                      JC Hair Studio's
                    </h1>
                    <div className="ml-2 flex">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg lg:text-xl font-bold italic text-emerald-700">
                      62
                    </span>
                    <div className="flex space-x-1">
                      <span className="text-xs">🇧🇷</span>
                      <span className="text-xs font-semibold text-emerald-600">
                        CABELO BRASILEIRO PREMIUM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        if (item.name === 'Produtos Capilares') {
                          setIsProductsDropdownOpen(true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (item.name === 'Produtos Capilares') {
                          setIsProductsDropdownOpen(false);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-1 px-4 py-2 font-medium text-sm lg:text-base transition-all duration-200 rounded-lg hover:bg-gray-50 ${item.active ? 'text-amber-700 bg-amber-50' : 'text-gray-700 hover:text-gray-900'}`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-3 h-3" />
                      </Link>

                      {(item.name === 'Produtos Capilares' && isProductsDropdownOpen) &&
                        item.dropdownItems && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
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
                      className={`px-4 py-2 font-medium text-sm lg:text-base transition-all duration-200 rounded-lg hover:bg-gray-50 ${item.active ? 'text-amber-700 bg-amber-50' : 'text-gray-700 hover:text-gray-900'}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span>PT</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isLanguageOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        onClick={() => {
                          setIsLanguageOpen(false);
                        }}
                      >
                        <span className="mr-3">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/favoritos"
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 relative"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Points Widget */}
              <PointsWidget compact={true} />

              {/* Account */}
              <Link
                href="/conta"
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                aria-label="Minha Conta"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 relative group"
                aria-label="Carrinho de compras"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm group-hover:bg-amber-700 transition-colors">
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={toggleCart}
                className="p-2 text-gray-700 hover:text-black transition-colors relative"
                aria-label="Carrinho"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-700 hover:text-black transition-colors z-50"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    autoFocus
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-6 py-4 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.href}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => {
                          if (item.name === 'Produtos Capilares') {
                            setIsMobileProductsDropdownOpen(!isMobileProductsDropdownOpen);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                          item.active
                            ? 'bg-amber-50 text-amber-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          (item.name === 'Produtos Capilares' && isMobileProductsDropdownOpen)
                            ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {(item.name === 'Produtos Capilares' && isMobileProductsDropdownOpen) &&
                        item.dropdownItems && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors"
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
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        item.active
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="border-t border-gray-100 px-6 py-4">
              <div className="space-y-1">
                <Link
                  href="/auth/signin"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  <User className="w-5 h-5 mr-3" />
                  Entrar/Registrar
                </Link>

                <Link
                  href="/favoritos"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Favoritos
                </Link>
              </div>
            </div>

            {/* Language selector in mobile menu */}
            <div className="border-t border-gray-100 px-6 py-4">
              <p className="text-sm font-medium text-gray-900 mb-3">Idioma</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="flex items-center justify-center px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}