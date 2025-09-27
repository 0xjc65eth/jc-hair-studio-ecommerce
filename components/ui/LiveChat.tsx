'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Mail, Clock, User, Zap } from 'lucide-react';
import { Button } from './Button';

interface LiveChatProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
  typing?: boolean;
}

export default function LiveChat({ className = '' }: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPulse, setShowPulse] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Simulate online status
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    // Business hours: 9 AM to 6 PM Lisbon time
    setIsOnline(hours >= 9 && hours <= 18);
  }, []);

  // Show attention-grabbing pulse periodically
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 3000);
      }, 15000); // Every 15 seconds

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        sender: 'agent',
        message: isOnline
          ? '👋 Olá! Sou a Maria, especialista em produtos capilares brasileiros. Como posso ajudar você hoje?'
          : '👋 Olá! No momento estamos offline, mas pode deixar sua mensagem que respondemos em breve!',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, isOnline]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Simulate typing and response
    if (isOnline) {
      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          'Perfeita escolha! 😊 Nossos produtos são autênticos e direto do Brasil. Posso te ajudar a encontrar o produto ideal para seu cabelo.',
          'Ótima pergunta! 👍 Temos entrega rápida para toda Europa. Quer que eu calcule o frete para sua região?',
          'Claro! 💫 Posso te dar um desconto especial de 10% se finalizar a compra hoje. Qual produto te interessou mais?',
          'Excelente! 🎉 Vou te passar o WhatsApp do nosso especialista: +351 928 375 226. Ele pode te ajudar com dúvidas técnicas.',
          'Perfeito! 🌟 Nossos clientes adoram os resultados. Quer ver algumas fotos antes/depois dos tratamentos?'
        ];

        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const quickActions = [
    { icon: '💰', text: 'Desconto especial', action: () => setCurrentMessage('Vocês têm algum desconto especial?') },
    { icon: '🚚', text: 'Prazo de entrega', action: () => setCurrentMessage('Qual o prazo de entrega para Portugal?') },
    { icon: '💇‍♀️', text: 'Dúvida sobre produto', action: () => setCurrentMessage('Tenho dúvidas sobre qual produto escolher') },
    { icon: '📞', text: 'Falar no WhatsApp', action: () => window.open('https://wa.me/351928375226', '_blank') }
  ];

  return (
    <>
      {/* Chat Bubble */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          {/* Unread notification */}
          {unreadCount > 0 && !isOpen && (
            <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
              {unreadCount}
            </div>
          )}

          {/* Chat trigger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              isOnline
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            } ${showPulse ? 'animate-pulse ring-4 ring-green-300' : ''}`}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <MessageCircle className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Online/Offline status */}
          <div className="absolute -top-1 -right-1 w-5 h-5">
            <div className={`w-full h-full rounded-full border-2 border-white ${
              isOnline ? 'bg-green-400' : 'bg-gray-400'
            }`} />
            {isOnline && (
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
            )}
          </div>
        </div>

        {/* Hover tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {isOnline ? '💬 Chat ao vivo • Resposta em segundos!' : '📧 Deixe sua mensagem'}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className={`p-4 text-white ${
            isOnline
              ? 'bg-gradient-to-r from-green-500 to-green-600'
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 border border-white rounded-full ${
                  isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {isOnline ? 'Maria - Especialista' : 'Suporte JC Hair'}
                </div>
                <div className="text-xs opacity-90 flex items-center gap-1">
                  {isOnline ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Online • Responde em instantes
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      Offline • Respondemos em breve
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 bg-gray-50 border-b">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex items-center gap-2 p-2 text-xs bg-white rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <span>{action.icon}</span>
                  <span className="truncate">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            {isOnline ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="px-4 rounded-full"
                >
                  <Zap className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Seu email..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <textarea
                  placeholder="Deixe sua mensagem que retornamos em breve..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <Button size="sm" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </div>
            )}
          </div>

          {/* Contact alternatives */}
          <div className="p-3 bg-gray-50 border-t">
            <div className="flex justify-center gap-4 text-xs text-gray-600">
              <a
                href="tel:+351928375226"
                className="flex items-center gap-1 hover:text-green-600"
              >
                <Phone className="w-3 h-3" />
                <span>Ligar</span>
              </a>
              <a
                href="https://wa.me/351928375226"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-green-600"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:juliocesarurss62@gmail.com"
                className="flex items-center gap-1 hover:text-green-600"
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}