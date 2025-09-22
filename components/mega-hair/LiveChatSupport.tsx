'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ComputerDesktopIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'product-suggestion';
  data?: any;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  status: 'online' | 'busy' | 'offline';
  responseTime: string;
}

const agents: Agent[] = [
  {
    id: '1',
    name: 'Sofia Martinez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    specialty: 'Especialista em Mega Hair',
    status: 'online',
    responseTime: '< 2 min'
  },
  {
    id: '2',
    name: 'Elena Rossi',
    avatar: 'https://i.pravatar.cc/150?img=9',
    specialty: 'Consultora de Cores',
    status: 'online',
    responseTime: '< 3 min'
  },
  {
    id: '3',
    name: 'Anna Schmidt',
    avatar: 'https://i.pravatar.cc/150?img=16',
    specialty: 'Técnicas de Aplicação',
    status: 'busy',
    responseTime: '< 5 min'
  }
];

const quickReplies = [
  'Qual o melhor mega hair para mim?',
  'Quanto custa a aplicação?',
  'Como escolher a cor ideal?',
  'Preciso de quanto tempo?',
  'Vocês fazem entrega em Portugal?',
  'Qual a garantia dos produtos?'
];

const productSuggestions = [
  {
    id: 'mh001',
    name: 'Mega Hair Liso Loiro Platinado 613 - 50cm',
    price: '€85.00',
    image: 'https://i.ibb.co/6c9qWqnq/613-1800x.webp'
  },
  {
    id: 'mh002',
    name: 'Mega Hair Castanho Natural - 55cm',
    price: '€90.00',
    image: 'https://i.ibb.co/n8NDS1BB/1-8e322489-17fb-4397-842e-4e24610ea213-1800x.webp'
  }
];

export default function LiveChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'closed' | 'agents' | 'chat'>('closed');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Simulate new messages when chat is closed
    if (!isOpen && Math.random() > 0.95) {
      setUnreadCount(prev => prev + 1);
    }
  }, [isOpen]);

  const openChat = () => {
    setIsOpen(true);
    setCurrentView('agents');
    setUnreadCount(0);
  };

  const closeChat = () => {
    setIsOpen(false);
    setCurrentView('closed');
  };

  const selectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setCurrentView('chat');

    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Olá! Sou ${agent.name}, ${agent.specialty}. Como posso ajudar você hoje com nossos produtos de mega hair premium?`,
      sender: 'agent',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Add quick replies
    setTimeout(() => {
      const quickReplyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Escolha uma das opções abaixo ou digite sua dúvida:',
        sender: 'agent',
        timestamp: new Date(),
        type: 'quick-reply',
        data: quickReplies
      };
      setMessages(prev => [...prev, quickReplyMessage]);
    }, 1000);
  };

  const sendMessage = (text: string, type: 'text' | 'quick-reply' = 'text') => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const response = generateResponse(text);
      setMessages(prev => [...prev, response]);
    }, Math.random() * 2000 + 1000);
  };

  const generateResponse = (userText: string): Message => {
    const responses = {
      'cor': 'Para escolher a cor ideal, recomendo nosso serviço de consultoria gratuita! Pode enviar uma foto do seu cabelo atual? Temos uma paleta com mais de 30 tonalidades europeias premium.',
      'preço': 'Nossos mega hairs premium variam de €60 a €190, dependendo do comprimento e coleção. Temos opções de parcelamento e desconto para profissionais!',
      'aplicação': 'A aplicação demora de 2-4 horas com nossos profissionais certificados. Oferecemos curso de capacitação e suporte técnico completo.',
      'entrega': 'Fazemos entrega em toda Europa! Frete grátis acima de €500. Portugal: 3-5 dias úteis. Outras regiões: 5-10 dias úteis.',
      'garantia': 'Oferecemos 30 dias de garantia para troca ou devolução. Nossos produtos premium têm qualidade certificada e origem europeia comprovada.',
      'default': 'Ótima pergunta! Nossos produtos são todos premium europeus com qualidade Remy AAA. Posso ajudar com algo específico sobre aplicação, cores ou técnicas?'
    };

    let responseText = responses.default;
    const lowerText = userText.toLowerCase();

    Object.entries(responses).forEach(([key, value]) => {
      if (lowerText.includes(key) && key !== 'default') {
        responseText = value;
      }
    });

    // Sometimes suggest products
    if (Math.random() > 0.7) {
      return {
        id: Date.now().toString(),
        text: responseText + '\n\nVeja alguns produtos que podem interessar:',
        sender: 'agent',
        timestamp: new Date(),
        type: 'product-suggestion',
        data: productSuggestions
      };
    }

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'agent',
      timestamp: new Date()
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openChat}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-rose-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {currentView === 'chat' && selectedAgent ? selectedAgent.name : 'Suporte JC Hair'}
                  </h3>
                  <p className="text-xs text-white/80">
                    {currentView === 'chat' && selectedAgent
                      ? `${selectedAgent.specialty} • Online`
                      : 'Escolha um especialista'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="text-white/80 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Agent Selection */}
            {currentView === 'agents' && (
              <div className="p-4 h-[400px] overflow-y-auto">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Escolha seu Especialista
                  </h4>
                  <p className="text-sm text-gray-600">
                    Nossa equipe está online para ajudar
                  </p>
                </div>

                <div className="space-y-3">
                  {agents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => selectAgent(agent)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all"
                    >
                      <div className="relative">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          agent.status === 'online' ? 'bg-green-400' :
                          agent.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}></span>
                      </div>
                      <div className="flex-1 text-left">
                        <h5 className="font-medium text-gray-900">{agent.name}</h5>
                        <p className="text-sm text-gray-600">{agent.specialty}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <ClockIcon className="w-3 h-3" />
                          <span>Responde em {agent.responseTime}</span>
                        </div>
                      </div>
                      <div className="text-rose-600">
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Contact Options */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">Outras formas de contato:</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <PhoneIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-xs text-gray-600">Telefone</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-xs text-gray-600">Email</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <ComputerDesktopIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-xs text-gray-600">FAQ</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {currentView === 'chat' && (
              <>
                <div className="h-[320px] overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-2xl px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-rose-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                        </div>

                        {/* Quick Replies */}
                        {message.type === 'quick-reply' && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.data.slice(0, 3).map((reply: string, index: number) => (
                              <button
                                key={index}
                                onClick={() => sendMessage(reply, 'quick-reply')}
                                className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-rose-50 hover:border-rose-300 transition-colors"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Product Suggestions */}
                        {message.type === 'product-suggestion' && (
                          <div className="space-y-2 mt-2">
                            {message.data.map((product: any) => (
                              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <h6 className="text-sm font-medium text-gray-900 line-clamp-1">
                                      {product.name}
                                    </h6>
                                    <p className="text-sm text-rose-600 font-semibold">
                                      {product.price}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.sender === 'agent' && (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 order-1">
                          <img
                            src={selectedAgent?.avatar}
                            alt={selectedAgent?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <img
                          src={selectedAgent?.avatar}
                          alt={selectedAgent?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                    />
                    <button
                      onClick={() => sendMessage(inputText)}
                      disabled={!inputText.trim()}
                      className="bg-rose-600 text-white p-2 rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}