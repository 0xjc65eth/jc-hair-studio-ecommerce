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
  ChevronDown 
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

export default function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsDropdownOpen, setIsMobileProductsDropdownOpen] = useState(false);
  
  // Get cart data
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
    { name: 'Cosméticos', href: '/cosmeticos', active: pathname === '/cosmeticos' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'header-glass shadow-md' 
            : 'bg-white/95 backdrop-blur-sm'
        } ${className}`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex-shrink-0 z-50"
              onClick={closeMobileMenu}
            >
              <div className="flex items-center">
                <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                  <Image
                    src="/logo-icon.svg"
                    alt="JC Hair Studio's 62"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="ml-3 hidden sm:block">
                  <h1 className="font-playfair text-xl lg:text-2xl font-medium text-gray-900">
                    JC Hair Studio's <span className="italic">62</span>
                  </h1>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        // Use different states for different dropdowns
                        if (item.name === 'Produtos Capilares') {
                          setIsProductsDropdownOpen(true);
                        }
                      }}
                      onMouseLeave={() => {
                        // Close the appropriate dropdown
                        if (item.name === 'Produtos Capilares') {
                          setIsProductsDropdownOpen(false);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`nav-link flex items-center space-x-1 ${item.active ? 'active' : ''}`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-3 h-3" />
                      </Link>

                      {/* Show dropdown based on specific state */}
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
                      className={`nav-link ${item.active ? 'active' : ''} ${
                        item.name === 'Cosméticos' ? 'cosmetics-nav-link' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-black transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>PT</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                {isLanguageOpen && (
                  <div className="language-dropdown">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="language-option"
                        onClick={() => {
                          // Handle language change
                          setIsLanguageOpen(false);
                        }}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/favoritos"
                className="p-2 text-gray-700 hover:text-black transition-colors relative"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Points Widget */}
              <PointsWidget compact={true} />

              {/* Account */}
              <Link
                href="/conta"
                className="p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Minha Conta"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="p-2 text-gray-700 hover:text-black transition-colors relative"
                aria-label="Carrinho de compras"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="cart-counter">
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
                  <span className="cart-counter">
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
            <div className="container-custom py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                    autoFocus
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
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
                          // Use different states for different mobile dropdowns
                          if (item.name === 'Produtos Capilares') {
                            setIsMobileProductsDropdownOpen(!isMobileProductsDropdownOpen);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                          item.active
                            ? 'bg-gray-100 text-black'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          (item.name === 'Produtos Capilares' && isMobileProductsDropdownOpen)
                            ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Show dropdown based on specific mobile state */}
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
                          ? 'bg-gray-100 text-black'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                      } ${
                        item.name === 'Cosméticos' ? 'cosmetics-nav-link' : ''
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