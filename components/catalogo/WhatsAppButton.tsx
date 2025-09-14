'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Clock, MapPin } from 'lucide-react';

interface WhatsAppButtonProps {
  position?: 'fixed' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showGreeting?: boolean;
  className?: string;
}

const WHATSAPP_NUMBER = '+320494989860';
const BUSINESS_HOURS = {
  start: 9,
  end: 18,
  timezone: 'Europe/Brussels'
};

const QUICK_MESSAGES = [
  '👋 Olá! Gostaria de saber mais sobre os produtos.',
  '📦 Quero informações sobre entrega para meu país.',
  '🎯 Preciso de ajuda para escolher o produto ideal.',
  '💰 Vocês têm promoções ou descontos especiais?',
  '🚚 Como funciona o rastreamento do pedido?',
  '✅ Quero confirmar se o produto é original.'
];

export default function WhatsAppButton({
  position = 'fixed',
  size = 'md',
  showGreeting = true,
  className = ''
}: WhatsAppButtonProps) {
  const [showChat, setShowChat] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  // Check if business is online
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const brusselsTime = new Date(now.toLocaleString("en-US", {timeZone: BUSINESS_HOURS.timezone}));
      const hour = brusselsTime.getHours();
      setIsOnline(hour >= BUSINESS_HOURS.start && hour < BUSINESS_HOURS.end);
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Show greeting bubble after delay
  useEffect(() => {
    if (showGreeting && position === 'fixed') {
      const timer = setTimeout(() => {
        setShowGreetingBubble(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showGreeting, position]);

  // Auto-hide greeting bubble
  useEffect(() => {
    if (showGreetingBubble) {
      const timer = setTimeout(() => {
        setShowGreetingBubble(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showGreetingBubble]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-14 h-14';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-7 h-7';
    }
  };

  const openWhatsApp = (message?: string) => {
    const defaultMessage = 'Olá! Vim do site JC Hair Studio e gostaria de saber mais sobre os produtos.';
    const text = encodeURIComponent(message || customMessage || defaultMessage);
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${text}`;
    window.open(url, '_blank');
    setShowChat(false);
    setShowGreetingBubble(false);
  };

  const formatBusinessHours = () => {
    return `${BUSINESS_HOURS.start}h - ${BUSINESS_HOURS.end}h (CET)`;
  };

  if (position === 'inline') {
    return (
      <button
        onClick={() => openWhatsApp()}
        className={`
          inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg 
          hover:bg-green-600 transition-colors ${className}
        `}
      >
        <MessageCircle className="w-5 h-5" />
        <span>WhatsApp</span>
        {isOnline && (
          <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        {/* Greeting Bubble */}
        {showGreetingBubble && !showChat && (
          <div className="absolute bottom-full right-0 mb-4 max-w-xs">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 relative">
              <button
                onClick={() => setShowGreetingBubble(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">JC Hair Studio</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {isOnline ? 'Online agora' : 'Offline'}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                👋 Olá! Sou brasileira e estou aqui para te ajudar com qualquer dúvida sobre nossos produtos!
              </p>
              
              <button
                onClick={() => {
                  setShowGreetingBubble(false);
                  setShowChat(true);
                }}
                className="w-full bg-green-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Iniciar Conversa
              </button>
              
              {/* Arrow */}
              <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-200" />
            </div>
          </div>
        )}

        {/* Chat Widget */}
        {showChat && (
          <div className="absolute bottom-full right-0 mb-4 w-80 max-w-[calc(100vw-2rem)]">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-green-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">JC Hair Studio</div>
                      <div className="text-xs text-green-100 flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-300' : 'bg-gray-400'}`} />
                        {isOnline ? 'Online agora' : `Offline • Volta às ${formatBusinessHours()}`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="mb-4">
                  <div className="bg-gray-100 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700">
                      👋 Olá! Sou brasileira e estou na Bélgica para te ajudar! 
                      Como posso auxiliar você hoje?
                    </p>
                  </div>

                  {/* Quick Messages */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Mensagens Rápidas:
                    </p>
                    {QUICK_MESSAGES.map((message, index) => (
                      <button
                        key={index}
                        onClick={() => openWhatsApp(message)}
                        className="w-full text-left text-sm p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {message}
                      </button>
                    ))}
                  </div>

                  {/* Custom Message */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Ou escreva sua mensagem:
                    </p>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={() => openWhatsApp()}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Enviar no WhatsApp
                    </button>
                  </div>
                </div>

                {/* Business Info */}
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>{WHATSAPP_NUMBER}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Atendimento: {formatBusinessHours()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>Base na Bélgica 🇧🇪</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => {
            if (showChat) {
              setShowChat(false);
            } else {
              setShowChat(true);
              setShowGreetingBubble(false);
            }
          }}
          className={`
            ${getSizeClasses()} 
            bg-green-500 hover:bg-green-600 text-white rounded-full 
            shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center justify-center group relative
            ${showChat ? 'rotate-0' : 'hover:scale-110'}
          `}
          title="Falar no WhatsApp"
        >
          {showChat ? (
            <X className={getIconSize()} />
          ) : (
            <MessageCircle className={getIconSize()} />
          )}
          
          {/* Online Indicator */}
          {isOnline && !showChat && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse" />
          )}
          
          {/* Pulse Animation */}
          {!showChat && (
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
          )}
        </button>
      </div>
    </>
  );
}