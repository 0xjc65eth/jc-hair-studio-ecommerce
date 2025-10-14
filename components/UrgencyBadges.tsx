'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UrgencyBadgesProps {
  stock?: number;
  productId: string;
  price?: number;
}

export default function UrgencyBadges({ stock = 10, productId, price = 50 }: UrgencyBadgesProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [viewers, setViewers] = useState<number>(0);
  const [recentBuyer, setRecentBuyer] = useState<{ name: string; city: string; time: string } | null>(null);
  const [showPromo, setShowPromo] = useState(false);

  // Countdown timer
  useEffect(() => {
    const endTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('EXPIRADO');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Random viewers
  useEffect(() => {
    setViewers(Math.floor(Math.random() * 20) + 5);

    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 20) + 5);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Recent purchase notifications
  useEffect(() => {
    const buyers = [
      { name: 'Maria S.', city: 'Lisboa' },
      { name: 'Ana P.', city: 'Porto' },
      { name: 'João M.', city: 'Braga' },
      { name: 'Carla F.', city: 'Coimbra' },
      { name: 'Pedro L.', city: 'Faro' }
    ];

    const showBuyer = () => {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      const time = Math.floor(Math.random() * 59) + 1;
      setRecentBuyer({ ...buyer, time: `${time}` });

      setTimeout(() => setRecentBuyer(null), 5000);
    };

    showBuyer();
    const interval = setInterval(showBuyer, 45000);

    return () => clearInterval(interval);
  }, []);

  // Show promo after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-3">
      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between"
      >
        <span className="text-red-700 font-semibold text-sm">⏰ OFERTA EXPIRA EM:</span>
        <span className="text-red-900 font-bold text-lg tabular-nums">{timeLeft}</span>
      </motion.div>

      {/* Stock Alert */}
      {stock <= 10 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-3"
        >
          <span className="text-orange-700 font-semibold text-sm">
            🔥 APENAS {stock} UNIDADES RESTANTES!
          </span>
        </motion.div>
      )}

      {/* Live Viewers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-gray-600"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span>{viewers} pessoas estão vendo este produto agora</span>
      </motion.div>

      {/* Recent Purchase Notification */}
      <AnimatePresence>
        {recentBuyer && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50 border-l-4 border-green-500"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {recentBuyer.name} de {recentBuyer.city}
                </p>
                <p className="text-xs text-gray-500">
                  Comprou há {recentBuyer.time} minutos
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo Code Popup */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 shadow-xl"
          >
            <button
              onClick={() => setShowPromo(false)}
              className="float-right text-white/80 hover:text-white"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-2">🎁 OFERTA EXCLUSIVA!</h3>
            <p className="text-sm mb-2">Use o código abaixo para 15% de desconto:</p>
            <div className="bg-white/20 rounded px-3 py-2 text-center font-mono font-bold">
              COMPRE15
            </div>
            <p className="text-xs mt-2 text-white/80">*Válido apenas hoje</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Free Shipping */}
      {price && price < 50 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <span className="text-blue-700 font-semibold text-sm">
            🚚 Falta apenas €{(50 - price).toFixed(2)} para FRETE GRÁTIS!
          </span>
        </div>
      )}

      {/* Trust Badges */}
      <div className="flex justify-around items-center py-3 border-t">
        <div className="text-center">
          <span className="text-2xl">🔒</span>
          <p className="text-xs text-gray-600">Pagamento<br />Seguro</p>
        </div>
        <div className="text-center">
          <span className="text-2xl">🚚</span>
          <p className="text-xs text-gray-600">Envio<br />Rápido</p>
        </div>
        <div className="text-center">
          <span className="text-2xl">✅</span>
          <p className="text-xs text-gray-600">Garantia<br />30 dias</p>
        </div>
        <div className="text-center">
          <span className="text-2xl">⭐</span>
          <p className="text-xs text-gray-600">+1000<br />Clientes</p>
        </div>
      </div>
    </div>
  );
}