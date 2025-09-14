'use client';

import { useState } from 'react';
import { Sparkles, Mail, Gift, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsletterSectionProps {
  className?: string;
}

export default function NewsletterSection({ className = '' }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      // Add newsletter signup API call here
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    }
    
    setIsSubmitting(false);
  };

  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Get 15% off your first order + exclusive subscriber discounts"
    },
    {
      icon: Star,
      title: "Beauty Tips",
      description: "Brazilian beauty secrets and expert tips from professional stylists"
    },
    {
      icon: Mail,
      title: "New Arrivals",
      description: "Be the first to know about new Brazilian products and launches"
    }
  ];

  if (isSubscribed) {
    return (
      <section className={`py-24 newsletter-container bg-gradient-to-br from-black to-gray-900 text-white ${className}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-green-500 bg-opacity-20 border border-green-500 rounded-2xl p-12"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl mb-4">
              Welcome to Brazilian Beauty!
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              You're now part of our exclusive community. Check your email for your welcome gift!
            </p>
            <div className="inline-flex items-center bg-luxo-dourado text-black px-6 py-3 rounded-full text-sm font-medium">
              <Gift className="w-4 h-4 mr-2" />
              15% OFF code sent to your email
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-24 newsletter-container bg-gradient-to-br from-black to-gray-900 text-white overflow-hidden ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-12 h-12 text-luxo-dourado mx-auto lg:mx-0 mb-6" />
              <h2 className="font-playfair text-4xl md:text-5xl mb-6">
                Unlock Brazilian Beauty Secrets
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join our exclusive community and get insider access to authentic Brazilian beauty tips, 
                new product launches, and special offers from Brazil's top brands.
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-luxo-dourado bg-opacity-20 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-luxo-dourado" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-white mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-200 mb-2">
                    Your email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="newsletter-input w-full"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="newsletter-button w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Join the Beauty Community</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-gray-400 text-sm">
                    Join 25,000+ beauty enthusiasts. Unsubscribe anytime.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-luxo-dourado text-sm">
                    <span>✓ No spam, ever</span>
                    <span>✓ Exclusive content</span>
                    <span>✓ Free beauty guide</span>
                  </div>
                </div>
              </form>

              {/* Special Offer Highlight */}
              <div className="mt-8 p-4 bg-luxo-dourado bg-opacity-20 rounded-lg border border-luxo-dourado border-opacity-30">
                <div className="flex items-center justify-center space-x-2 text-luxo-dourado">
                  <Gift className="w-5 h-5" />
                  <span className="font-medium">Welcome Gift: 15% OFF your first order</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 floating-element opacity-60">
              <Sparkles className="w-8 h-8 text-luxo-dourado" />
            </div>
            <div className="absolute -bottom-4 -left-4 floating-element opacity-40">
              <Sparkles className="w-6 h-6 text-luxo-dourado" />
            </div>
          </div>
        </div>

        {/* Bottom Trust Elements */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-700 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm mb-4">
            Trusted by beauty enthusiasts across Europe
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-500 text-sm">
            <span>🇧🇷 Authentic Brazilian Beauty</span>
            <span>🚚 Free EU Shipping</span>
            <span>⭐ 4.9/5 Customer Rating</span>
            <span>🔒 Your privacy protected</span>
          </div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-luxo-dourado bg-opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-luxo-dourado bg-opacity-5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}