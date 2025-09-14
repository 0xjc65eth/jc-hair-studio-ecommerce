'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Heart, Star, Palette, Sparkles, Leaf, ArrowRight, Eye, ShoppingCart, Droplets } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Badge, { StatusBadge } from '../ui/Badge';

interface ColorOption {
  name: string;
  hex: string;
  mood: string;
}

interface FragranceNote {
  type: 'top' | 'heart' | 'base';
  name: string;
  description: string;
}

interface Produto {
  id: number;
  nome: string;
  subtitulo: string;
  preco: number;
  precoOriginal?: number;
  categoria: 'esmalte' | 'corporal';
  cores?: ColorOption[];
  fragrancia?: FragranceNote[];
  embalagem: 'unidade' | 'kit' | 'ambos';
  precoKit?: number;
  sustentavel?: boolean;
  vegano?: boolean;
  memoriaEmocional: string;
  descricaoSensorial: string;
  antesDeps?: {
    antes: string;
    depois: string;
  };
  bestseller?: boolean;
  novo?: boolean;
}

const produtos: Produto[] = [
  {
    id: 13,
    nome: "Risqué Coleção Clássicos",
    subtitulo: "Nostalgia em vidrinhos",
    preco: 8,
    precoKit: 42,
    categoria: 'esmalte',
    embalagem: 'ambos',
    cores: [
      { name: 'Vermelho Clássico', hex: '#DC143C', mood: 'Poder e elegância' },
      { name: 'Rosa Antigo', hex: '#C08081', mood: 'Romantismo vintage' },
      { name: 'Nude Rosado', hex: '#E6B8A2', mood: 'Sofisticação natural' },
      { name: 'Burgundy', hex: '#800020', mood: 'Mistério e profundidade' },
      { name: 'Coral Vibrante', hex: '#FF7F50', mood: 'Alegria contagiante' },
      { name: 'French Manicure', hex: '#FFF8DC', mood: 'Pureza atemporal' }
    ],
    memoriaEmocional: "Aquele primeiro encontro, as mãos que tremiam de nervoso, o esmalte que escolhemos com tanto cuidado. Cada cor conta uma história de gerações.",
    descricaoSensorial: "O cheiro característico do esmalte que nos transporta instantaneamente para os salões de beleza da nossa adolescência. Texturas cremosas que deslizam como seda.",
    antesDeps: {
      antes: "Unhas sem vida, sem personalidade",
      depois: "Mãos que contam histórias, unhas que expressam quem somos"
    },
    bestseller: true
  },
  {
    id: 14,
    nome: "Risqué Coleção Verão Brasileiro",
    subtitulo: "Verão eterno nas unhas",
    preco: 32,
    categoria: 'esmalte',
    embalagem: 'kit',
    cores: [
      { name: 'Ipanema Sunset', hex: '#FF6B35', mood: 'Pôr do sol carioca' },
      { name: 'Açaí Power', hex: '#4A148C', mood: 'Energia amazônica' },
      { name: 'Caipirinha', hex: '#CDDC39', mood: 'Frescor tropical' },
      { name: 'Copacabana Blue', hex: '#0277BD', mood: 'Mar infinito' },
      { name: 'Carnaval Gold', hex: '#FFD700', mood: 'Festa e alegria' },
      { name: 'Bahia Coral', hex: '#FF5722', mood: 'Calor nordestino' }
    ],
    memoriaEmocional: "Férias na praia, o som das ondas, areia entre os dedos. Cores que capturam a essência do verão brasileiro que vive dentro de nós.",
    descricaoSensorial: "Tons vibrantes que aquecem a alma como o sol do meio-dia. Acabamento brilhante que reflete a luz como as águas cristalinas.",
    antesDeps: {
      antes: "Inverno cinzento, mãos escondidas",
      depois: "Verão permanente na ponta dos dedos"
    },
    novo: true
  },
  {
    id: 15,
    nome: "Dailus Esmaltes Veganos",
    subtitulo: "Beleza consciente",
    preco: 35,
    categoria: 'esmalte',
    embalagem: 'kit',
    vegano: true,
    sustentavel: true,
    cores: [
      { name: 'Terra Vermelha', hex: '#8B4513', mood: 'Conexão com a natureza' },
      { name: 'Verde Folha', hex: '#228B22', mood: 'Vida em crescimento' },
      { name: 'Azul Céu', hex: '#87CEEB', mood: 'Liberdade infinita' },
      { name: 'Rosa Flor', hex: '#DDA0DD', mood: 'Delicadeza natural' },
      { name: 'Dourado Sol', hex: '#DAA520', mood: 'Energia renovável' }
    ],
    memoriaEmocional: "A consciência de que podemos ser belas sem machucar o planeta. Cada pincelada é um ato de amor próprio e amor ao mundo.",
    descricaoSensorial: "Fórmulas livres de crueldade com pigmentação intensa. O aroma suave que não agride, cores que celebram a natureza.",
    antesDeps: {
      antes: "Beleza com peso na consciência",
      depois: "Esmaltes que nutrem a alma e respeitam a vida"
    }
  },
  {
    id: 16,
    nome: "O Boticário Nativa SPA Ameixa",
    subtitulo: "Cheiro que define o Brasil",
    preco: 25,
    precoKit: 30,
    categoria: 'corporal',
    embalagem: 'ambos',
    fragrancia: [
      { type: 'top', name: 'Ameixa Fresca', description: 'Doçura natural e envolvente' },
      { type: 'heart', name: 'Pétalas Florais', description: 'Suavidade feminina e elegante' },
      { type: 'base', name: 'Almíscar Brasileiro', description: 'Sensualidade tropical única' }
    ],
    memoriaEmocional: "O perfume da nossa mãe, o cheiro que ficava no ar quando ela passava. Ameixa que desperta memórias de carinho e proteção.",
    descricaoSensorial: "Textura aveludada que desliza na pele como uma carícia. Fragrância que permanece horas, criando um rastro inesquecível de brasilidade.",
    antesDeps: {
      antes: "Pele ressecada pelo tempo",
      depois: "Corpo perfumado com a essência do Brasil"
    },
    bestseller: true
  },
  {
    id: 17,
    nome: "Natura Ekos Castanha",
    subtitulo: "Amazônia na sua pele",
    preco: 28,
    categoria: 'corporal',
    embalagem: 'unidade',
    sustentavel: true,
    fragrancia: [
      { type: 'top', name: 'Castanha-do-Pará', description: 'Riqueza amazônica concentrada' },
      { type: 'heart', name: 'Óleos Nativos', description: 'Nutrição profunda da floresta' },
      { type: 'base', name: 'Madeiras Brasileiras', description: 'Força e resistência natural' }
    ],
    memoriaEmocional: "A conexão com nossas raízes, a força da floresta que pulsa em nós. Cada aplicação é um retorno às nossas origens.",
    descricaoSensorial: "Óleo rico que penetra profundamente, deixando a pele macia como seda. Aroma que transporta para o coração da Amazônia.",
    antesDeps: {
      antes: "Pele desnutrida e sem vida",
      depois: "Corpo nutrido com a sabedoria ancestral"
    }
  },
  {
    id: 18,
    nome: "Match Boticário Desodorante",
    subtitulo: "Memórias da adolescência",
    preco: 22,
    categoria: 'corporal',
    embalagem: 'unidade',
    fragrancia: [
      { type: 'top', name: 'Frutas Cítricas', description: 'Frescor jovem e vibrante' },
      { type: 'heart', name: 'Flores Brancas', description: 'Pureza e inocência' },
      { type: 'base', name: 'Almíscar Suave', description: 'Despertar da feminilidade' }
    ],
    memoriaEmocional: "O primeiro perfume, os primeiros encontros, os sonhos de adolescente. Cheiro que nos leva de volta aos 15 anos, quando tudo era possível.",
    descricaoSensorial: "Borrifada refrescante que desperta os sentidos. Proteção que dura o dia todo, mantendo a confiança em cada momento.",
    antesDeps: {
      antes: "Inseguranças de jovem",
      depois: "Confiança perfumada que acompanha cada passo"
    }
  }
];

interface ColorSelectorProps {
  cores: ColorOption[];
  corSelecionada: string | null;
  onCorSelect: (cor: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ cores, corSelecionada, onCorSelect }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Escolha sua cor</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cores.map((cor) => (
          <button
            key={cor.name}
            onClick={() => onCorSelect(cor.name)}
            className={clsx(
              'group relative p-3 border transition-all duration-300',
              'hover:shadow-lg hover:-translate-y-1',
              corSelecionada === cor.name
                ? 'border-black shadow-md scale-105'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div
              className="w-full h-8 mb-2 border border-gray-200"
              style={{ backgroundColor: cor.hex }}
            />
            <div className="text-center">
              <div className="text-xs font-medium text-gray-900 mb-1">
                {cor.name}
              </div>
              <div className="text-xs text-gray-500 italic">
                {cor.mood}
              </div>
            </div>
            {corSelecionada === cor.name && (
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

interface FragranceSelectorProps {
  fragrancia: FragranceNote[];
}

const FragranceSelector: React.FC<FragranceSelectorProps> = ({ fragrancia }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Droplets className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Pirâmide Olfativa</span>
      </div>
      <div className="space-y-3">
        {fragrancia.map((nota, index) => (
          <div key={index} className="border border-gray-100 p-3">
            <div className="flex items-start gap-3">
              <div className={clsx(
                'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                nota.type === 'top' && 'bg-yellow-400',
                nota.type === 'heart' && 'bg-pink-400',
                nota.type === 'base' && 'bg-purple-400'
              )} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {nota.type === 'top' && 'Saída: '}
                  {nota.type === 'heart' && 'Coração: '}
                  {nota.type === 'base' && 'Fundo: '}
                  {nota.name}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {nota.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BeforeAfterProps {
  antesDeps: { antes: string; depois: string };
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({ antesDeps }) => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-l-4 border-amber-400">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Transformação
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="font-medium text-gray-700">Antes:</div>
            <div className="text-gray-600 italic">{antesDeps.antes}</div>
          </div>
          <div className="flex items-center justify-center md:justify-start">
            <ArrowRight className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-1">
            <div className="font-medium text-gray-700">Depois:</div>
            <div className="text-gray-600 italic">{antesDeps.depois}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProdutoCardProps {
  produto: Produto;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto }) => {
  const [corSelecionada, setCorSelecionada] = useState<string | null>(null);
  const [embalagem, setEmbalagem] = useState<'unidade' | 'kit'>('unidade');
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const precoAtual = embalagem === 'kit' && produto.precoKit ? produto.precoKit : produto.preco;

  return (
    <Card variant="luxury" className="group relative overflow-hidden">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {produto.bestseller && <StatusBadge status="bestseller" />}
        {produto.novo && <StatusBadge status="new" />}
        {produto.vegano && (
          <Badge variant="success" size="sm" className="flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            Vegano
          </Badge>
        )}
        {produto.sustentavel && (
          <Badge variant="success" size="sm" className="flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            Sustentável
          </Badge>
        )}
      </div>

      {/* Imagem do Produto */}
      <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-32 mx-auto bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg shadow-lg" />
            <div className="mt-2 text-xs text-gray-500">
              {produto.categoria === 'esmalte' ? 'Esmalte' : 'Corporal'}
            </div>
          </div>
        </div>
        
        {/* Overlay de ação */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center pb-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            leftIcon={<Eye className="w-4 h-4" />}
          >
            Ver Detalhes
          </Button>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Header do Produto */}
        <div>
          <CardTitle className="text-lg font-playfair">{produto.nome}</CardTitle>
          <p className="text-sm text-gray-600 italic mt-1">{produto.subtitulo}</p>
        </div>

        {/* Memória Emocional */}
        <div className="bg-amber-50 p-3 border-l-4 border-amber-200">
          <p className="text-sm text-gray-700 italic leading-relaxed">
            "{produto.memoriaEmocional}"
          </p>
        </div>

        {/* Seletor de Embalagem */}
        {produto.embalagem === 'ambos' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Opção:</div>
            <div className="flex gap-2">
              <Button
                variant={embalagem === 'unidade' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setEmbalagem('unidade')}
              >
                Unidade
              </Button>
              <Button
                variant={embalagem === 'kit' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setEmbalagem('kit')}
              >
                Kit Completo
              </Button>
            </div>
          </div>
        )}

        {/* Seletor de Cores (Esmaltes) */}
        {produto.categoria === 'esmalte' && produto.cores && (
          <ColorSelector
            cores={produto.cores}
            corSelecionada={corSelecionada}
            onCorSelect={setCorSelecionada}
          />
        )}

        {/* Seletor de Fragrâncias (Corporais) */}
        {produto.categoria === 'corporal' && produto.fragrancia && (
          <FragranceSelector fragrancia={produto.fragrancia} />
        )}

        {/* Detalhes Expandidos */}
        {mostrarDetalhes && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            {/* Descrição Sensorial */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Experiência Sensorial</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {produto.descricaoSensorial}
              </p>
            </div>

            {/* Antes e Depois */}
            {produto.antesDeps && <BeforeAfter antesDeps={produto.antesDeps} />}
          </div>
        )}

        {/* Preço e Ações */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                €{precoAtual.toFixed(2)}
              </span>
              {embalagem === 'kit' && produto.preco && (
                <span className="text-sm text-gray-500">
                  (Un: €{produto.preco.toFixed(2)})
                </span>
              )}
            </div>
            {embalagem === 'kit' && produto.cores && (
              <div className="text-xs text-gray-500">
                {produto.cores.length} cores incluídas
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Heart className="w-4 h-4" />}
            >
              Favoritar
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShoppingCart className="w-4 h-4" />}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EsmaltesCorpo: React.FC = () => {
  const [filtroCategoria, setFiltroCategoria] = useState<'todos' | 'esmalte' | 'corporal'>('todos');
  const [filtroSustentavel, setFiltroSustentavel] = useState(false);

  const produtosFiltrados = produtos.filter(produto => {
    const categoriaMatch = filtroCategoria === 'todos' || produto.categoria === filtroCategoria;
    const sustentavelMatch = !filtroSustentavel || produto.sustentavel || produto.vegano;
    return categoriaMatch && sustentavelMatch;
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
            Esmaltes & Cuidados Corporais
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Desperte memórias, expresse emoções. Cada produto conta uma história, 
            cada cor revela um sentimento, cada fragrância transporta para um momento especial.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <div className="flex gap-2">
            <Button
              variant={filtroCategoria === 'todos' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFiltroCategoria('todos')}
            >
              Todos
            </Button>
            <Button
              variant={filtroCategoria === 'esmalte' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFiltroCategoria('esmalte')}
              leftIcon={<Palette className="w-4 h-4" />}
            >
              Esmaltes
            </Button>
            <Button
              variant={filtroCategoria === 'corporal' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFiltroCategoria('corporal')}
              leftIcon={<Droplets className="w-4 h-4" />}
            >
              Corporais
            </Button>
          </div>
          
          <Button
            variant={filtroSustentavel ? 'accent' : 'outline'}
            size="sm"
            onClick={() => setFiltroSustentavel(!filtroSustentavel)}
            leftIcon={<Leaf className="w-4 h-4" />}
          >
            Sustentáveis
          </Button>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtosFiltrados.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-amber-50 to-orange-50 p-8">
          <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
            Encontre sua Cor, Desperte sua Essência
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Cada produto carrega consigo o poder de transformar não apenas sua aparência, 
            mas também despertar memórias preciosas e criar novos momentos inesquecíveis.
          </p>
          <Button
            variant="accent"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Ver Coleção Completa
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EsmaltesCorpo;