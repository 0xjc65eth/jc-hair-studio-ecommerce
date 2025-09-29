'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/stores/cartStore';
import { X, Gift, Clock, Mail } from 'lucide-react';
import { Button } from '../ui/Button';

interface CartAbandonmentRecoveryProps {
  className?: string;
}

interface AbandonmentOffer {
  id: string;
  title: string;
  discount: number;
  code: string;
  expiresIn: number; // minutes
  description: string;
  icon: string;
}

export default function CartAbandonmentRecovery({ className = '' }: CartAbandonmentRecoveryProps) {
  const { items, isEmpty } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<AbandonmentOffer | null>(null);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const offers: AbandonmentOffer[] = [
    {
      id: 'first-time',
      title: 'PRIMEIRA COMPRA?',
      discount: 15,
      code: 'PRIMEIRA15',
      expiresIn: 30,
      description: 'Desconto especial para novos clientes',
      icon: '🎁'
    },
    {
      id: 'comeback',
      title: 'NÃO VÁ EMBORA!',
      discount: 10,
      code: 'VOLTA10',
      expiresIn: 15,
      description: 'Seus produtos estão esperando',
      icon: '❤️'
    },
    {
      id: 'last-chance',
      title: 'ÚLTIMA CHANCE',
      discount: 20,
      code: 'ULTIMO20',
      expiresIn: 10,
      description: 'Maior desconto disponível!',
      icon: '⚡'
    }
  ];

  // Detect user intent to leave
  useEffect(() => {
    let mouseLeaveTimer: NodeJS.Timeout;
    let scrollTimer: NodeJS.Timeout;
    let inactivityTimer: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isEmpty && !hasInteracted) {
        mouseLeaveTimer = setTimeout(() => {
          triggerAbandonmentPopup('first-time');
        }, 1000);
      }
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };

    // Scroll behavior tracking
    let scrollDepth = 0;
    const handleScroll = () => {
      const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (currentScroll > scrollDepth) {
        scrollDepth = currentScroll;
      }

      // If user scrolled less than 50% and tries to leave
      if (scrollDepth < 50 && !isEmpty && !hasInteracted) {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          triggerAbandonmentPopup('comeback');
        }, 5000);
      }
    };

    // Inactivity detection
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!isEmpty && !hasInteracted) {
          triggerAbandonmentPopup('last-chance');
        }
      }, 120000); // 2 minutes of inactivity
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    resetInactivityTimer();

    return () => {
      clearTimeout(mouseLeaveTimer);
      clearTimeout(scrollTimer);
      clearTimeout(inactivityTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('scroll', handleScroll);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isEmpty, hasInteracted]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const triggerAbandonmentPopup = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (offer && !showPopup) {
      setCurrentOffer(offer);
      setTimeLeft(offer.expiresIn * 60); // Convert minutes to seconds
      setShowPopup(true);

      // Track abandonment event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'begin_checkout_abandonment', {
          event_category: 'E-commerce',
          event_label: offerId,
          value: items.reduce((sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity, 0)
        });
      }
    }
  };

  const handleEmailCapture = async () => {
    if (!email || !currentOffer) return;

    try {
      // Send abandonment recovery email
      const response = await fetch('/api/cart-abandonment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          offer: currentOffer,
          cartItems: items.map(item => ({
            id: item.id,
            name: item.product.name,
            price: item.variant?.price || item.product.price,
            quantity: item.quantity,
            image: item.product.images?.[0]?.url
          })),
          total: items.reduce((sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity, 0)
        }),
      });

      if (response.ok) {
        setHasInteracted(true);

        // Track successful email capture
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'cart_abandonment_email_captured', {
            event_category: 'Lead Generation',
            event_label: currentOffer.id
          });
        }

        // Show success message
        alert(`✅ Desconto de ${currentOffer.discount}% enviado para ${email}!`);
        setShowPopup(false);
      }
    } catch (error) {
      console.error('Error sending abandonment email:', error);
      alert('Erro ao enviar desconto. Tente novamente.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showPopup || !currentOffer || isEmpty) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={() => {
            setShowPopup(false);
            setHasInteracted(true);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl text-center">
          <div className="text-4xl mb-2">{currentOffer.icon}</div>
          <div className="text-xl font-bold mb-1">{currentOffer.title}</div>
          <div className="text-red-100 text-sm">{currentOffer.description}</div>
        </div>

        {/* Timer */}
        <div className="bg-red-50 border-b border-red-100 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-red-700">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Oferta expira em:</span>
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Discount highlight */}
          <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-200 rounded-xl p-4 mb-4 text-center">
            <div className="text-3xl font-bold text-green-700 mb-1">{currentOffer.discount}% OFF</div>
            <div className="text-green-600 text-sm">Código: <span className="font-mono font-bold">{currentOffer.code}</span></div>
          </div>

          {/* Email capture form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite seu email para receber o desconto:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                autoFocus
              />
            </div>

            <Button
              onClick={handleEmailCapture}
              disabled={!email}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 text-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              RECEBER DESCONTO DE {currentOffer.discount}%
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-center text-gray-600 space-y-1">
              <div>✅ Sem spam • Apenas ofertas especiais</div>
              <div>🔒 Email protegido • Não compartilhamos dados</div>
              <div>⚡ Desconto aplicado automaticamente</div>
            </div>
          </div>
        </div>

        {/* Alternative action */}
        <div className="bg-gray-50 rounded-b-2xl p-4 text-center">
          <button
            onClick={() => {
              setShowPopup(false);
              setHasInteracted(true);
              // Redirect to checkout
              window.location.href = '/checkout';
            }}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Não, quero finalizar sem desconto
          </button>
        </div>
      </div>
    </div>
  );
}