'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  TruckIcon,
  CurrencyEuroIcon,
  ScissorsIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: {
    id: string;
    question: string;
    answer: string;
    tags?: string[];
  }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'application',
    title: 'Aplicação e Técnicas',
    icon: ScissorsIcon,
    questions: [
      {
        id: 'app1',
        question: 'Quanto tempo demora a aplicação do mega hair?',
        answer: 'A aplicação completa varia de 2 a 4 horas, dependendo da quantidade de mechas e técnica utilizada. Para aplicação completa (8-12 mechas), o tempo médio é de 3 horas. Recomendamos sempre agendar com antecedência e reservar tempo adequado para um resultado perfeito.',
        tags: ['tempo', 'aplicação']
      },
      {
        id: 'app2',
        question: 'Qual a melhor técnica para aplicar mega hair?',
        answer: 'Oferecemos várias técnicas: Costura (mais tradicional e durável), Nano Links (discreta), Queratina (natural), e Tela/Trama (para volume). A escolha depende do seu tipo de cabelo, resultado desejado e estilo de vida. Nossa equipe pode orientar na melhor opção durante a consulta.',
        tags: ['técnica', 'costura', 'nano']
      },
      {
        id: 'app3',
        question: 'Posso aplicar mega hair em cabelo curto?',
        answer: 'Sim! O cabelo precisa ter pelo menos 10-15cm para uma aplicação segura. Para cabelos mais curtos, recomendamos técnicas como nano links ou micro links, que são mais discretas. O importante é ter comprimento suficiente para cobrir os pontos de aplicação.',
        tags: ['cabelo curto', 'aplicação']
      },
      {
        id: 'app4',
        question: 'É necessário ser profissional para aplicar?',
        answer: 'Recomendamos fortemente a aplicação profissional para garantir resultado natural, durabilidade e saúde capilar. Profissionais têm o conhecimento técnico para escolher a melhor técnica e realizar a aplicação sem danificar seus cabelos naturais.',
        tags: ['profissional', 'aplicação']
      }
    ]
  },
  {
    id: 'care',
    title: 'Cuidados e Manutenção',
    icon: HeartIcon,
    questions: [
      {
        id: 'care1',
        question: 'Quanto tempo dura o mega hair?',
        answer: 'Com cuidados adequados, nosso mega hair premium dura de 6 a 12 meses. A durabilidade varia conforme: qualidade do cabelo (nossos são Remy europeus), técnica de aplicação, cuidados diários e frequência de lavagem. Produtos de qualidade como os nossos mantêm brilho e textura por mais tempo.',
        tags: ['durabilidade', 'qualidade']
      },
      {
        id: 'care2',
        question: 'Como lavar cabelo com mega hair?',
        answer: 'Use shampoo sem sulfato, aplique apenas no couro cabeludo. Evite esfregar as mechas. Use condicionador/máscara apenas no comprimento. Lave 2-3 vezes por semana máximo. Seque suavemente com toalha e finalize com leave-in específico para cabelos com extensão.',
        tags: ['lavagem', 'shampoo', 'cuidados']
      },
      {
        id: 'care3',
        question: 'Posso usar chapinha e secador?',
        answer: 'Sim! Nosso mega hair premium suporta ferramentas térmicas até 180°C. Sempre use protetor térmico antes. Prefira temperaturas médias (140-160°C). Evite passar ferramentas nos pontos de aplicação. Para maior durabilidade, intercale dias com penteados sem calor.',
        tags: ['chapinha', 'secador', 'temperatura']
      },
      {
        id: 'care4',
        question: 'Que produtos devo evitar?',
        answer: 'Evite produtos com álcool, sulfatos agressivos, óleos minerais pesados e silicones não solúveis. Não use produtos de alisamento ou relaxamento no mega hair. Prefira linhas específicas para cabelos com extensão ou produtos naturais suaves.',
        tags: ['produtos', 'evitar', 'sulfato']
      }
    ]
  },
  {
    id: 'quality',
    title: 'Qualidade e Origem',
    icon: ShieldCheckIcon,
    questions: [
      {
        id: 'qual1',
        question: 'Qual a diferença entre cabelo Remy e comum?',
        answer: 'Cabelo Remy tem cutículas alinhadas na mesma direção, mantendo a estrutura natural. Isso resulta em: menos embaraço, brilho natural duradouro, textura sedosa e maior durabilidade. Nossos cabelos são Remy europeus premium, garantindo qualidade superior.',
        tags: ['remy', 'qualidade', 'cutícula']
      },
      {
        id: 'qual2',
        question: 'De onde vem o cabelo da JC Hair Studio?',
        answer: 'Nossos cabelos premium são europeus (Polônia, República Tcheca, Ucrânia) e brasileiros selecionados. Trabalhamos apenas com fornecedores certificados que garantem origem ética e processo de tratamento que preserva a qualidade natural do cabelo.',
        tags: ['origem', 'europeu', 'brasileiro']
      },
      {
        id: 'qual3',
        question: 'Como identificar a qualidade do mega hair?',
        answer: 'Cabelo de qualidade tem: brilho natural (não artificial), textura uniforme, cutículas intactas, não embaraça facilmente, mantém cor original, resiste a lavagens. Nossos produtos passam por controle rigoroso e vêm com certificado de qualidade.',
        tags: ['qualidade', 'identificar', 'brilho']
      }
    ]
  },
  {
    id: 'purchase',
    title: 'Compra e Entrega',
    icon: TruckIcon,
    questions: [
      {
        id: 'purch1',
        question: 'Quanto custa o frete para toda Europa?',
        answer: 'Frete grátis para pedidos acima de €500. Para pedidos menores: €15 (Europa Ocidental), €25 (Europa Oriental). Entrega em 5-10 dias úteis. Oferecemos tracking completo e seguro premium para produtos de alto valor.',
        tags: ['frete', 'europa', 'grátis']
      },
      {
        id: 'purch2',
        question: 'Posso devolver se não gostar?',
        answer: 'Sim! Garantia de 30 dias para troca ou devolução. O produto deve estar em condições originais, não aplicado. Cobrimos frete de devolução para defeitos de fabricação. Para questões de cor ou textura, oferecemos consultoria antes da compra.',
        tags: ['devolução', 'garantia', '30 dias']
      },
      {
        id: 'purch3',
        question: 'Como escolher a cor certa?',
        answer: 'Oferecemos amostras de cor por €5 (descontados na compra). Temos guia de cores digital e consultoria online gratuita. Para melhores resultados, recomendamos enviar foto do seu cabelo natural para nossa equipe avaliar.',
        tags: ['cor', 'amostra', 'consultoria']
      }
    ]
  },
  {
    id: 'price',
    title: 'Preços e Pagamento',
    icon: CurrencyEuroIcon,
    questions: [
      {
        id: 'price1',
        question: 'Por que os preços variam tanto?',
        answer: 'O preço reflete: origem do cabelo (europeu premium custa mais), comprimento (quanto maior, mais raro), qualidade (Remy AAA vs AA), tratamento especial (coloração, texturização). Nossos preços são justos para a qualidade premium oferecida.',
        tags: ['preço', 'qualidade', 'variação']
      },
      {
        id: 'price2',
        question: 'Vocês oferecem desconto para salões?',
        answer: 'Sim! Temos programa especial para profissionais e salões: 15-25% desconto progressivo, condições especiais de pagamento, suporte técnico exclusivo e amostras gratuitas. Entre em contato para cadastro profissional.',
        tags: ['desconto', 'salão', 'profissional']
      },
      {
        id: 'price3',
        question: 'Quais formas de pagamento aceitam?',
        answer: 'Cartões de crédito/débito (Visa, Mastercard, AMEX), PayPal, transferência bancária SEPA e PIX para brasileiros. Parcelamento até 6x sem juros. Todas as transações são seguras com certificação SSL.',
        tags: ['pagamento', 'cartão', 'parcelamento']
      }
    ]
  },
  {
    id: 'technical',
    title: 'Questões Técnicas',
    icon: QuestionMarkCircleIcon,
    questions: [
      {
        id: 'tech1',
        question: 'Mega hair pode danificar meu cabelo natural?',
        answer: 'Quando aplicado corretamente por profissional qualificado, não. Problemas surgem com: aplicação inadequada, uso de produtos incompatíveis, falta de manutenção ou remoção forçada. Sempre siga instruções de cuidado e faça manutenção regular.',
        tags: ['dano', 'cabelo natural', 'profissional']
      },
      {
        id: 'tech2',
        question: 'Posso colorir o mega hair após aplicação?',
        answer: 'Nosso mega hair aceita coloração, mas recomendamos processos suaves. Pode escurecer facilmente, clarear requer cuidado especial. Para melhores resultados, escolha a cor mais próxima do desejado antes da compra ou faça coloração antes da aplicação.',
        tags: ['coloração', 'tingir', 'química']
      },
      {
        id: 'tech3',
        question: 'Como remover o mega hair com segurança?',
        answer: 'SEMPRE procure profissional para remoção. Métodos variam por técnica: costura (cortar fios), queratina (produto removedor específico), nano links (alicate especial). Remoção inadequada pode causar danos severos ao cabelo natural.',
        tags: ['remoção', 'segurança', 'profissional']
      }
    ]
  }
];

export default function MegaHairFAQ() {
  const [selectedCategory, setSelectedCategory] = useState('application');
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const currentCategory = faqCategories.find(cat => cat.id === selectedCategory);

  const filteredQuestions = currentCategory?.questions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
      <div className="text-center mb-8">
        <QuestionMarkCircleIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Perguntas Frequentes sobre Mega Hair
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tudo que você precisa saber sobre nossos produtos premium, desde aplicação até cuidados diários.
          Nossa expertise de anos resumida para você.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar dúvidas específicas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
            <div className="space-y-2">
              {faqCategories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'hover:bg-blue-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{category.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {currentCategory && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <currentCategory.icon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {currentCategory.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
                    {filteredQuestions.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {filteredQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(question.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="font-medium text-gray-900 pr-4">
                          {question.question}
                        </span>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            openQuestions.includes(question.id) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openQuestions.includes(question.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 bg-gray-50 border-t border-gray-200">
                              <p className="text-gray-700 leading-relaxed mb-3">
                                {question.answer}
                              </p>

                              {question.tags && (
                                <div className="flex flex-wrap gap-2">
                                  {question.tags.map(tag => (
                                    <span
                                      key={tag}
                                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {filteredQuestions.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <QuestionMarkCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 mb-2">
                      Nenhuma pergunta encontrada
                    </h4>
                    <p className="text-gray-500">
                      Tente outro termo de busca ou navegue pelas categorias
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-6 bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-xl p-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Não encontrou sua dúvida?
              </h4>
              <p className="text-gray-600 mb-4">
                Nossa equipe especializada está pronta para ajudar com qualquer questão específica
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium">
                  Chat ao Vivo
                </button>
                <button className="border border-rose-600 text-rose-600 px-6 py-3 rounded-lg hover:bg-rose-50 transition-colors font-medium">
                  Enviar Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}