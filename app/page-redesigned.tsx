import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Star, Shield, Truck, Heart, ArrowRight, Play, ChevronLeft, ChevronRight, Users, Award, Globe, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: '62 Beauty - Premium Brazilian Beauty Products | Sophisticated Imports',
  description: 'Discover authentic Brazilian beauty excellence. Premium hair treatments, professional makeup, and luxury tools imported directly from Brazil\'s finest brands.',
};

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  shortDesc: string;
  images: {
    url: string;
    alt: string;
    isMain: boolean;
  }[];
  badge?: string;
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`/api/products?featured=true&limit=6`, {
      next: { revalidate: 900 }, // Cache for 15 minutes
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }
    
    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

function PremiumProductCard({ product }: { product: Product }) {
  const mainImage = product.images.find(img => img.isMain) || product.images[0];

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-gradient-to-br from-luxo-cinza-100 to-white rounded-xl overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500">
        {mainImage && (
          <img
            src={mainImage.url}
            alt={mainImage.alt}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        )}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-luxo-dourado text-black px-3 py-1 rounded-full text-xs font-medium">
            {product.badge}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-white/90 backdrop-blur-sm text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors">
            Ver Produto
          </button>
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-medium text-gray-900 mb-2 group-hover:text-luxo-dourado transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDesc}
        </p>

        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-medium text-gray-900">
            €{Number(product.price).toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              €{Number(product.comparePrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.slice(0, 6).map((product) => (
        <PremiumProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    location: "Lisboa, Portugal", 
    image: "/testimonials/maria.jpg",
    content: "Os produtos brasileiros da 62 Beauty transformaram completamente minha rotina de beleza. A qualidade é excepcional!",
    rating: 5,
    verified: true
  },
  {
    id: 2,
    name: "Ana Rodriguez",
    location: "Madrid, España",
    image: "/testimonials/ana.jpg", 
    content: "Finalmente encontrei produtos autenticamente brasileiros na Europa. O tratamento capilar é incrível!",
    rating: 5,
    verified: true
  },
  {
    id: 3,
    name: "Sophie Laurent",
    location: "Paris, France",
    image: "/testimonials/sophie.jpg",
    content: "La qualité brésilienne authentique. Mes cheveux n'ont jamais été aussi beaux!",
    rating: 5,
    verified: true
  }
];

const brazilianBrands = [
  { name: "Natura", logo: "/brands/natura.png" },
  { name: "O Boticário", logo: "/brands/boticario.png" },
  { name: "Brasil Cacau", logo: "/brands/brasil-cacau.png" },
  { name: "Inoar", logo: "/brands/inoar.png" },
  { name: "Cadiveu", logo: "/brands/cadiveu.png" },
  { name: "Alfaparf", logo: "/brands/alfaparf.png" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section - Brazilian Luxury */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0">
          <img
            src="/images/hero-brazilian-beauty.jpg"
            alt="Brazilian Beauty"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <div className="flex items-center mb-6">
              <div className="h-px bg-luxo-dourado w-12 mr-4" />
              <span className="text-luxo-dourado text-sm font-medium tracking-widest uppercase">
                Brazilian Beauty Excellence
              </span>
            </div>
            
            <h1 className="font-playfair text-5xl md:text-7xl text-white mb-6 leading-tight">
              Authentic Brazilian
              <span className="italic text-luxo-dourado"> Beauty</span>
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
              Discover the secret of Brazilian beauty with our curated collection of premium products. 
              Imported directly from Brazil's most prestigious brands.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                href="/produtos" 
                className="bg-luxo-dourado text-black px-8 py-4 rounded-lg hover:bg-yellow-400 transition-all duration-300 text-center font-medium flex items-center justify-center group"
              >
                Explore Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all duration-300 text-center font-medium flex items-center justify-center">
                <Play className="mr-2 w-5 h-5" />
                Watch Story
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 text-white/80 text-sm">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-luxo-dourado" />
                Authentic Brazilian Products
              </div>
              <div className="flex items-center">
                <Truck className="w-5 h-5 mr-2 text-luxo-dourado" />
                Free EU Shipping
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-luxo-dourado" />
                30+ Years Experience
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 right-10 animate-bounce">
          <Sparkles className="w-8 h-8 text-luxo-dourado opacity-60" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-pulse">
          <Sparkles className="w-6 h-6 text-luxo-dourado opacity-40" />
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-24 bg-gradient-to-b from-luxo-cinza-100 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-luxo-dourado w-12 mr-4" />
              <span className="text-luxo-dourado text-sm font-medium tracking-widest uppercase">
                Best Sellers
              </span>
              <div className="h-px bg-luxo-dourado w-12 ml-4" />
            </div>
            
            <h2 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6">
              Premium Brazilian Favorites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover why these authentic Brazilian beauty products are loved by customers across Europe.
            </p>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>

          <div className="text-center mt-12">
            <Link 
              href="/produtos" 
              className="inline-flex items-center text-gray-900 hover:text-luxo-dourado font-medium text-lg group transition-colors"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Highlights - Brazilian Specialties */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6">
              Brazilian Beauty Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From revolutionary hair treatments to vibrant makeup and professional tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hair Treatments */}
            <Link href="/categoria/tratamentos-capilares" className="group relative overflow-hidden rounded-2xl">
              <div className="aspect-[4/5] bg-gradient-to-br from-orange-100 to-red-50">
                <img
                  src="/categories/brazilian-hair-treatments.jpg"
                  alt="Brazilian Hair Treatments"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="font-playfair text-2xl mb-2 group-hover:text-luxo-dourado transition-colors">
                  Hair Treatments
                </h3>
                <p className="text-gray-200 text-sm mb-4">
                  Revolutionary Brazilian keratin and progressive treatments for all hair types
                </p>
                <div className="flex items-center text-luxo-dourado group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">Explore Treatments</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Makeup */}
            <Link href="/categoria/maquiagem" className="group relative overflow-hidden rounded-2xl">
              <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 to-purple-50">
                <img
                  src="/categories/brazilian-makeup.jpg"
                  alt="Brazilian Makeup"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="font-playfair text-2xl mb-2 group-hover:text-luxo-dourado transition-colors">
                  Makeup
                </h3>
                <p className="text-gray-200 text-sm mb-4">
                  Vibrant colors and long-lasting formulas inspired by Brazilian beauty
                </p>
                <div className="flex items-center text-luxo-dourado group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">Shop Makeup</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Professional Tools */}
            <Link href="/categoria/ferramentas" className="group relative overflow-hidden rounded-2xl">
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-blue-50">
                <img
                  src="/categories/professional-tools.jpg"
                  alt="Professional Beauty Tools"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="font-playfair text-2xl mb-2 group-hover:text-luxo-dourado transition-colors">
                  Professional Tools
                </h3>
                <p className="text-gray-200 text-sm mb-4">
                  High-quality styling tools and accessories used by Brazilian professionals
                </p>
                <div className="flex items-center text-luxo-dourado group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">View Tools</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banner - Special Offers */}
      <section className="py-16 bg-gradient-to-r from-luxo-dourado via-yellow-400 to-luxo-dourado">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-black">
            <h2 className="font-playfair text-3xl md:text-4xl mb-4">
              Limited Time: Brazilian Beauty Week
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Celebrate authentic Brazilian beauty with up to 30% off selected premium products. 
              Free shipping on orders over €75.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/promocoes" 
                className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Shop Sale Items
              </Link>
              <div className="flex items-center justify-center text-black font-medium">
                <span className="text-sm">Use code: </span>
                <span className="bg-black text-luxo-dourado px-3 py-1 rounded ml-2 font-mono">BRASIL30</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brazilian Brand Showcase */}
      <section className="py-24 bg-luxo-cinza-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6">
              Authentic Brazilian Brands
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We partner directly with Brazil's most prestigious beauty brands to bring you authentic products
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {brazilianBrands.map((brand, index) => (
              <div 
                key={brand.name}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center aspect-square"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials with Social Proof */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-luxo-dourado w-12 mr-4" />
              <span className="text-luxo-dourado text-sm font-medium tracking-widest uppercase">
                Customer Stories
              </span>
              <div className="h-px bg-luxo-dourado w-12 ml-4" />
            </div>
            
            <h2 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6">
              Loved Across Europe
            </h2>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-luxo-dourado" />
                <span>50,000+ Happy Customers</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-luxo-dourado" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-luxo-dourado" />
                <span>25+ Countries Served</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex text-luxo-dourado mr-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup - Brazilian Beauty Secrets */}
      <section className="py-24 bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Sparkles className="w-12 h-12 text-luxo-dourado mx-auto mb-6" />
            <h2 className="font-playfair text-4xl md:text-5xl mb-6">
              Unlock Brazilian Beauty Secrets
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get exclusive access to Brazilian beauty tips, new product launches, 
              and special offers from Brazil's top brands.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-luxo-dourado"
              />
              <button className="bg-luxo-dourado text-black px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors font-medium whitespace-nowrap">
                Join Now
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Join 25,000+ beauty enthusiasts. Unsubscribe anytime.
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              🇧🇷 Authentic Brazilian Beauty • 🚚 Free EU Shipping • ⭐ 4.9/5 Customer Rating
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}