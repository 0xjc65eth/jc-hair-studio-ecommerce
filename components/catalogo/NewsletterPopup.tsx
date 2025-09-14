'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Gift, Star, Heart, Sparkles } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { NewsletterSubscription } from '../../types/product';

interface NewsletterPopupProps {
  delay?: number; // Delay in seconds before showing
  showOnExit?: boolean; // Show when user tries to leave
  className?: string;
}

const INTERESTS = [
  { id: 'progressivas', label: 'Progressivas & Alisamentos', icon: '💇‍♀️' },
  { id: 'tratamentos', label: 'Tratamentos Capilares', icon: '✨' },
  { id: 'maquiagem', label: 'Maquiagem', icon: '💄' },
  { id: 'corpo', label: 'Cuidados Corporais', icon: '🧴' },
  { id: 'ofertas', label: 'Ofertas & Promoções', icon: '🔥' },
  { id: 'novidades', label: 'Lançamentos', icon: '🆕' }
];

export default function NewsletterPopup({
  delay = 30,
  showOnExit = true,
  className = ''
}: NewsletterPopupProps) {
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<'main' | 'interests' | 'success'>('main');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useLocalStorage('jc-newsletter-subscribed', false);
  const [lastShown, setLastShown] = useLocalStorage('jc-newsletter-last-shown', 0);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    interests: [] as string[]
  });

  // Initialize client flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show popup based on delay
  useEffect(() => {
    if (!isClient || hasSubscribed) return;
    
    // Don't show if shown recently (within 24 hours)
    const now = Date.now();
    if (now - lastShown < 24 * 60 * 60 * 1000) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      setLastShown(now);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay, hasSubscribed, lastShown, setLastShown, isClient]);

  // Exit intent detection
  useEffect(() => {
    if (!isClient || !showOnExit || hasSubscribed || isVisible) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        setLastShown(Date.now());
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showOnExit, hasSubscribed, isVisible, setLastShown, isClient]);

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      alert('Por favor, insira seu e-mail');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const subscription: NewsletterSubscription = {
        email: formData.email,
        name: formData.name || undefined,
        country: 'eu',
        interests: formData.interests,
        source: 'popup'
      };

      // Here you would typically send to your API
      console.log('Newsletter subscription:', subscription);
      
      setCurrentStep('success');
      setHasSubscribed(true);
      
      // Auto-close after success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
    } catch (error) {
      alert('Erro ao cadastrar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setLastShown(Date.now());
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia!';
    if (hour < 18) return 'Boa tarde!';
    return 'Boa noite!';
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header with Close Button */}
        <div className="relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main Step */}
          {currentStep === 'main' && (
            <>
              {/* Background Pattern */}
              <div className="relative bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#CD853F] p-8 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="absolute top-12 right-8">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="absolute bottom-6 left-8">
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Gift className="w-10 h-10" />
                  </div>
                </div>
                
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {getWelcomeMessage()} 👋
                  </h2>
                  <p className="text-white/90 text-lg">
                    Brasileira na Europa?
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Receba ofertas exclusivas! 🎁
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Seja a primeira a saber sobre <strong>promoções especiais</strong>, 
                    <strong> novos produtos brasileiros</strong> e <strong>dicas de beleza</strong> 
                    direto da nossa comunidade na Europa.
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xs font-medium text-green-800">Ofertas Exclusivas</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">🇧🇷</div>
                    <div className="text-xs font-medium text-blue-800">Produtos do Brasil</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-1">💄</div>
                    <div className="text-xs font-medium text-purple-800">Dicas de Beleza</div>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-2xl mb-1">👩‍🦰</div>
                    <div className="text-xs font-medium text-pink-800">Comunidade BR</div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Seu melhor e-mail"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] text-center"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Como você gostaria de ser chamada? (opcional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white font-semibold rounded-lg hover:from-[#6B3410] hover:to-[#8B4513] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Cadastrando...
                      </span>
                    ) : (
                      'Quero receber ofertas! 🎁'
                    )}
                  </button>
                </form>

                {/* Interests Button */}
                <button
                  onClick={() => setCurrentStep('interests')}
                  className="w-full mt-3 py-2 text-sm text-[#8B4513] hover:text-[#6B3410] transition-colors"
                >
                  Personalizar meus interesses →
                </button>

                {/* Skip */}
                <button
                  onClick={handleSkip}
                  className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Não, obrigada
                </button>

                {/* Trust Badge */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 100% seguro • Sem spam • Cancele quando quiser
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Interests Step */}
          {currentStep === 'interests' && (
            <>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">
                  Personalize sua experiência ✨
                </h3>
                <p className="text-purple-100">
                  Escolha seus interesses para receber conteúdo personalizado
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200
                        ${formData.interests.includes(interest.id)
                          ? 'border-[#8B4513] bg-[#8B4513]/5 text-[#8B4513]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }
                      `}
                    >
                      <span className="text-xl">{interest.icon}</span>
                      <span className="font-medium">{interest.label}</span>
                      {formData.interests.includes(interest.id) && (
                        <span className="ml-auto text-[#8B4513]">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep('main')}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410] disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Cadastrando...' : 'Finalizar'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Success Step */}
          {currentStep === 'success' && (
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-4xl">🎉</div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vinda à família! 💜
              </h3>
              
              <p className="text-gray-600 mb-4">
                Você foi cadastrada com sucesso! Prepare-se para receber as melhores 
                ofertas de produtos brasileiros na Europa.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm">
                  <strong>🎁 Oferta especial:</strong> Use o código <strong>BEM-VINDA10</strong> 
                  e ganhe 10% de desconto na sua primeira compra!
                </p>
              </div>

              <button
                onClick={() => setIsVisible(false)}
                className="w-full py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410] transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}