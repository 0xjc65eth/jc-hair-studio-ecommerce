'use client';

import { Star, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  content: string;
  rating: number;
  verified: boolean;
  productUsed?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Maria Santos",
    location: "Lisboa, Portugal",
    image: "/testimonials/maria.jpg",
    content: "Os produtos brasileiros da 62 Beauty transformaram completamente minha rotina de beleza. A qualidade é excepcional! Uso o tratamento Inoar há 6 meses e meu cabelo nunca esteve tão saudável.",
    rating: 5,
    verified: true,
    productUsed: "Inoar Keratin Treatment"
  },
  {
    id: 2,
    name: "Ana Rodriguez",
    location: "Madrid, España",
    image: "/testimonials/ana.jpg",
    content: "Finalmente encontrei productos auténticamente brasileños en Europa. El tratamiento capilar es increíble, y el servicio al cliente es excepcional. Recomiendo 100%.",
    rating: 5,
    verified: true,
    productUsed: "Brasil Cacau Keratin"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    location: "Paris, France",
    image: "/testimonials/sophie.jpg",
    content: "La qualité brésilienne authentique enfin accessible en Europe. Mes cheveux n'ont jamais été aussi beaux! L'équipe m'a parfaitement conseillée selon mon type de cheveux.",
    rating: 5,
    verified: true,
    productUsed: "Cadiveu Professional"
  }
];

const socialProofStats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Happy Customers"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating"
  },
  {
    icon: Globe,
    value: "25+",
    label: "Countries Served"
  }
];

interface TestimonialsSectionProps {
  className?: string;
}

export default function TestimonialsSection({ className = '' }: TestimonialsSectionProps) {
  return (
    <section className={`py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="h-px bg-luxo-dourado w-12 mr-4" />
            <span className="text-luxo-dourado text-sm font-medium tracking-widest uppercase">
              Customer Stories
            </span>
            <div className="h-px bg-luxo-dourado w-12 ml-4" />
          </motion.div>
          
          <motion.h2 
            className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Loved Across Europe
          </motion.h2>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {socialProofStats.map((stat, index) => (
              <div key={index} className="flex items-center">
                <stat.icon className="w-5 h-5 mr-2 text-luxo-dourado" />
                <span className="font-medium mr-1">{stat.value}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              className="testimonial-card relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                <div className="flex text-luxo-dourado mr-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {testimonial.verified && (
                  <span className="social-proof-badge">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              
              {/* Testimonial Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed relative z-10">
                "{testimonial.content}"
              </blockquote>
              
              {/* Product Used */}
              {testimonial.productUsed && (
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Product used: </span>
                  <span className="text-sm font-medium text-luxo-dourado">
                    {testimonial.productUsed}
                  </span>
                </div>
              )}
              
              {/* Customer Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden bg-gray-200">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=D4AF37&color=000&size=48`;
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
              
              {/* Decorative Quote Mark */}
              <div className="absolute -top-2 -left-2 text-6xl text-luxo-dourado opacity-20 font-serif leading-none">
                "
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Additional Social Proof */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-4 bg-luxo-cinza-100 px-8 py-4 rounded-full">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=Customer${i}&background=D4AF37&color=000&size=32`}
                    alt={`Customer ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-gray-700">
              <span className="font-medium">2,847</span> customers rated us 
              <span className="font-medium text-luxo-dourado"> 5 stars</span> this month
            </div>
          </div>
        </motion.div>
        
        {/* Trust Badge */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 text-sm">
            🇧🇷 Authentic Brazilian Products • 🚚 Free EU Shipping • 💯 Satisfaction Guaranteed
          </p>
        </motion.div>
      </div>
    </section>
  );
}