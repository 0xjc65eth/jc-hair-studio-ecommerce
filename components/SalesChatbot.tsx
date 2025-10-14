'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: string[];
}

export default function SalesChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto open after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setIsOpen(true), 2000);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  // Initial message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: 'Olá! 👋 Sou a assistente virtual da JC Hair Studio. Vi que está navegando em nossos produtos! Posso ajudar com alguma dúvida ou oferecer um DESCONTO EXCLUSIVO? 🎁',
        sender: 'bot',
        timestamp: new Date(),
        options: [
          'Quero um desconto! 🎯',
          'Ver mais vendidos 🔥',
          'Preciso de ajuda',
          'Frete grátis?'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const responses: Record<string, string> = {
    'quero um desconto': 'Excelente! 🎉 Tenho um cupom EXCLUSIVO para você: Use CHAT20 e ganhe 20% OFF em toda a loja! Válido apenas nas próximas 2 horas. Quer que eu mostre nossos produtos mais vendidos?',
    'ver mais vendidos': 'Nossos TOP 3 mais vendidos:\n\n1. 🥇 COCOCHOCO Original - €124,89\n2. 🥈 Kit Mega Hair Loiro - €189,90\n3. 🥉 Progressiva Vogue - €89,90\n\nTodos com FRETE GRÁTIS hoje! Qual te interessou?',
    'preciso de ajuda': 'Claro! Estou aqui para ajudar. Sobre o que você gostaria de saber?\n\n• Produtos para seu tipo de cabelo\n• Como escolher a cor ideal\n• Formas de pagamento\n• Prazo de entrega\n• Garantia e trocas',
    'frete grátis': '📦 SIM! Temos FRETE GRÁTIS para:\n\n✅ Compras acima de €50\n✅ Primeira compra (use: PRIMEIRACOMPRA)\n✅ Kit com 3+ produtos\n\nEntrega em 2-3 dias úteis para toda Portugal!',
    'progressiva': 'Ótima escolha! Nossas progressivas são as MELHORES:\n\n🌟 COCOCHOCO Original - Mais vendida\n🌟 Vogue Professional - Melhor custo-benefício\n🌟 Nuance LISO - Para cabelos resistentes\n\nQuer um cupom de 15% OFF para experimentar?',
    'mega hair': 'Temos as MELHORES extensões:\n\n💎 Cabelo 100% humano brasileiro\n💎 Durabilidade de 6-12 meses\n💎 Todas as cores disponíveis\n💎 Kit completo com cola e removedor\n\nHOJE com 25% OFF! Use código: MEGAHAIR25',
    'pagamento': 'Facilitamos seu pagamento! Aceitamos:\n\n💳 Cartão (parcelamos em até 3x)\n💰 MBWay\n🏦 Transferência\n📱 PayPal\n💸 Pagamento na entrega\n\nTudo 100% seguro com SSL!',
    'garantia': 'Sua compra é 100% SEGURA:\n\n✅ 30 dias de garantia\n✅ Troca grátis\n✅ Devolução do dinheiro\n✅ Suporte WhatsApp 24h\n✅ +5000 clientes satisfeitos\n\nQuer aproveitar nosso desconto de primeira compra?'
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Bot response
    setTimeout(() => {
      const lowerText = messageText.toLowerCase();
      let botResponse = 'Interessante! Deixe-me verificar isso para você...';

      // Check for keywords
      for (const [keyword, response] of Object.entries(responses)) {
        if (lowerText.includes(keyword)) {
          botResponse = response;
          break;
        }
      }

      // Default responses
      if (botResponse === 'Interessante! Deixe-me verificar isso para você...') {
        const defaultResponses = [
          'Que tal aproveitar nosso DESCONTO de 20% válido hoje? Use o código CHAT20!',
          'Posso te mostrar produtos perfeitos para você! Qual seu tipo de cabelo?',
          'Temos uma PROMOÇÃO especial acontecendo agora! Quer saber mais?',
          'Vi que está interessado! Posso oferecer FRETE GRÁTIS para sua compra hoje!'
        ];
        botResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        options: lowerText.includes('desconto') ? [] : ['Quero desconto!', 'Ver produtos', 'Falar com humano']
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <>
      {/* Notification Badge */}
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-6 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg z-40"
          >
            1 Nova Mensagem!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-xl z-50 hover:shadow-2xl transition-shadow"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600"></span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Assistente JC Hair</h3>
                  <p className="text-xs text-white/80">Online agora • Resposta imediata</p>
                </div>
                <div className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                  DESCONTO 20%
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Quick Reply Options */}
                  {message.options && message.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option)}
                          className="bg-white border border-purple-300 text-purple-600 px-3 py-1 rounded-full text-sm hover:bg-purple-50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-2 hover:shadow-lg transition-shadow"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}