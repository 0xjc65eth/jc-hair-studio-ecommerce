'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Shield,
  Phone,
  Star,
  Award
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
    description?: string;
    featured?: boolean;
  }>;
}

interface BrazilianHeaderProps {
  className?: string;
}

export default function BrazilianHeader({ className = '' }: BrazilianHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsDropdownOpen, setIsMobileProductsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get cart data
  const { getTotalItems, toggleCart } = useCart();
  const itemsCount = getTotalItems();

  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    { name: 'Início', href: '/', active: pathname === '/' },
    {
      name: 'Produtos Brasileiros',
      href: '/produtos',
      active: pathname.startsWith('/produtos') && !pathname.startsWith('/produto/'),
      hasDropdown: true,
      dropdownItems: [
        {
          name: 'Progressivas Premium',
          href: '/categoria/progressivas-alisamentos',
          description: 'Vogue, Portier, Inoar',
          featured: true
        },
        {
          name: 'Mega Hair Natural',
          href: '/mega-hair',
          description: '100% cabelo humano brasileiro',
          featured: true
        },
        {
          name: 'BTX & Tratamentos',
          href: '/categoria/tratamentos-capilares',
          description: 'Botox capilar e reconstrução'
        },
        {
          name: 'Maquiagem Brasileira',
          href: '/maquiagens',
          description: 'Mari Maria, Ruby Rose, QDB'
        },
        {
          name: 'Esmaltes & Unhas',
          href: '/esmaltes',
          description: 'Impala, Risqué, Colorama'
        }
      ]
    },
    { name: 'Mega Hair', href: '/mega-hair', active: pathname === '/mega-hair' },
    { name: 'Maquiagens', href: '/maquiagens', active: pathname === '/maquiagens' },
    { name: 'Sobre Nós', href: '/sobre', active: pathname === '/sobre' },
  ];

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇵🇹', region: 'Portugal' },
    { code: 'en', name: 'English', flag: '🇬🇧', region: 'United Kingdom' },
    { code: 'es', name: 'Español', flag: '🇪🇸', region: 'España' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'France' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileProductsDropdownOpen(false);
  };

  return (
    <>
      {/* Top Bar Brasileiro */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 text-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-base">🇧🇷</span>
                <span className="font-medium">Produtos Autênticos do Brasil</span>
                <span className="bg-green-800/50 px-2 py-0.5 rounded-full text-xs">40+ anos</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>+351 928 375 226</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>4.9/5 • 2.847 avaliações</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b-2 border-green-500'
            : 'bg-white/98 backdrop-blur-sm'
        } ${className}`}
        style={{ top: isScrolled ? '0' : '40px' }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo Profissional */}
            <Link
              href="/"
              className="flex-shrink-0 z-50 group"
              onClick={closeMobileMenu}
            >
              <div className="flex items-center">
                <div className="relative w-14 h-14 mr-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Image
                    src="/logo-icon.svg"
                    alt="JC Hair Studio's 62"
                    fill
                    className="object-contain relative z-10"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="font-playfair text-2xl font-bold text-gray-900 mb-1">
                    JC Hair Studio's <span className="text-green-600">62</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      Brasileiro Autêntico
                    </span>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span>Tradição desde 1980</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        if (item.name === 'Produtos Brasileiros') {
                          setIsProductsDropdownOpen(true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (item.name === 'Produtos Brasileiros') {
                          setIsProductsDropdownOpen(false);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`nav-link-professional flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
                          item.active
                            ? 'text-green-600 bg-green-50'
                            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Link>

                      {/* Professional Dropdown */}
                      {(item.name === 'Produtos Brasileiros' && isProductsDropdownOpen) && item.dropdownItems && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50">
                          <div className="px-4 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-green-600 font-semibold">
                              <span className="text-lg">🇧🇷</span>
                              <span>Produtos Brasileiros Autênticos</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Tradição e qualidade direto do Brasil</p>
                          </div>
                          <div className="px-2 pt-2">
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className={`block px-4 py-3 rounded-xl hover:bg-green-50 transition-colors group ${
                                  dropdownItem.featured ? 'bg-gradient-to-r from-green-50 to-yellow-50' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className={`font-semibold text-gray-800 group-hover:text-green-600 ${
                                      dropdownItem.featured ? 'text-green-700' : ''
                                    }`}>
                                      {dropdownItem.name}
                                      {dropdownItem.featured && (
                                        <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                          POPULAR
                                        </span>
                                      )}
                                    </div>
                                    {dropdownItem.description && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {dropdownItem.description}
                                      </div>
                                    )}
                                  </div>
                                  {dropdownItem.featured && (
                                    <Star className="w-4 h-4 text-yellow-500" />
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`nav-link-professional px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
                        item.active
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                >
                  <Globe className="w-4 h-4" />
                  <span>PT</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setIsLanguageOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{lang.flag}</span>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{lang.name}</div>
                            <div className="text-xs text-gray-500">{lang.region}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/favoritos"
                className="p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors relative"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Points Widget */}
              <PointsWidget compact={true} />

              {/* Account */}
              <Link
                href="/conta"
                className="p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                aria-label="Minha Conta"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Professional Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Carrinho de compras"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors"
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={toggleCart}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors relative"
                aria-label="Carrinho"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors z-50"
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
          <div className="border-t border-gray-100 bg-white/95 backdrop-blur">
            <div className="container-custom py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar produtos brasileiros autênticos..."
                    className="w-full pl-12 pr-4 py-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu - Updated for Professional Look */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />

          <div className={`
            fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇧🇷</span>
                    <div>
                      <div className="font-bold text-lg">Menu</div>
                      <div className="text-green-100 text-sm">Produtos Brasileiros</div>
                    </div>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-green-700/50 backdrop-blur rounded-lg p-3 text-center">
                  <div className="text-sm text-green-100">Tradição desde</div>
                  <div className="text-xl font-bold text-yellow-300">1980</div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <div key={item.href}>
                      {item.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => {
                              if (item.name === 'Produtos Brasileiros') {
                                setIsMobileProductsDropdownOpen(!isMobileProductsDropdownOpen);
                              }
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
                              item.active
                                ? 'bg-green-100 text-green-800'
                                : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                          >
                            <span>{item.name}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${
                              (item.name === 'Produtos Brasileiros' && isMobileProductsDropdownOpen)
                                ? 'rotate-180' : ''
                            }`} />
                          </button>

                          {(item.name === 'Produtos Brasileiros' && isMobileProductsDropdownOpen) &&
                            item.dropdownItems && (
                            <div className="ml-4 mt-2 space-y-1">
                              {item.dropdownItems.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.href}
                                  href={dropdownItem.href}
                                  className="block px-4 py-3 text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                                  onClick={closeMobileMenu}
                                >
                                  <div className="font-medium">{dropdownItem.name}</div>
                                  {dropdownItem.description && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {dropdownItem.description}
                                    </div>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
                            item.active
                              ? 'bg-green-100 text-green-800'
                              : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                          }`}
                          onClick={closeMobileMenu}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile User Actions */}
                <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Entrar/Registrar
                  </Link>

                  <Link
                    href="/favoritos"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    Favoritos
                  </Link>
                </div>

                {/* Mobile Language Selector */}
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3 px-4">Idioma / Language</p>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{lang.name}</div>
                          <div className="text-xs text-gray-500">{lang.region}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="text-center text-xs text-gray-600">
                  <div className="font-semibold text-gray-900 mb-1">JC Hair Studio's 62</div>
                  <div>🇧🇷 Produtos Brasileiros Autênticos</div>
                  <div className="mt-2 text-green-600">+351 928 375 226</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}