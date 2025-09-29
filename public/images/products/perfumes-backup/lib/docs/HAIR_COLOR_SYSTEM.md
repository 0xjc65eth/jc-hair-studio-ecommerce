# Sistema Profissional de Cores para Mega Hair

## Visão Geral

Sistema completo de colorimetria profissional baseado nos padrões internacionais da indústria de cabelo. Implementa escala numerada oficial (#1 a #613), categorização por undertones, níveis de dificuldade técnica e sistema de compatibilidade entre cores.

## Arquitetura do Sistema

### Arquivos Principais

```
types/
├── hairColor.ts          # Interfaces e tipos TypeScript

lib/data/
├── hairColors.ts         # Base de dados de cores profissionais

lib/utils/
├── hairColorUtils.ts     # Utilitários e validações

lib/examples/
├── hairColorSystemExample.ts  # Exemplos de uso

lib/docs/
├── HAIR_COLOR_SYSTEM.md  # Esta documentação
```

## Estrutura de Dados

### HairColor Interface

```typescript
interface HairColor {
  code: string;              // Código oficial (#1, #6, #613)
  commercialName: string;    // Nome comercial
  technicalName: string;     // Nome técnico profissional
  description: string;       // Descrição detalhada
  category: HairColorCategory;     // natural | blonde | fashion
  undertone: HairColorUndertone;   // cool | warm | neutral
  level: ColorLevel;              // 1-10 (1=preto, 10=platinado)
  difficulty: HairColorDifficulty; // basic | intermediate | advanced | premium
  hexColor: string;          // Cor hexadecimal para UI
  priceMultiplier: number;   // Multiplicador de preço
  compatibility: {           // Sistema de compatibilidade
    harmonious: string[];    // Cores harmoniosas
    gradient: string[];      // Para degradês
    highlights: string[];    // Para mechas
    avoid: string[];         // Cores incompatíveis
  };
  technicalInfo?: {          // Informações técnicas
    processingTime?: string;
    developerVolume?: string;
    technicalNotes?: string;
    aftercare?: string[];
  };
}
```

## Escala de Cores Implementada

### Cores Naturais (#1-#5)
- **#1** - Preto Natural
- **#1B** - Preto Azulado
- **#2** - Castanho Escuro
- **#4** - Castanho Médio
- **#5** - Castanho Claro Acinzentado

### Escala Loira (#6-#10)
- **#6** - Loiro Escuro
- **#8** - Loiro Claro
- **#10** - Loiro Platinado

### Cores Especiais
- **#16** - Mel Dourado
- **#18** - Loiro Acinzentado Médio
- **#24** - Loiro Dourado Natural
- **#27** - Ruivo Mel
- **#30** - Castanho Acobreado
- **#350** - Castanho Avermelhado
- **#613** - Loiro Ultra Claro Acinzentado
- **#99J** - Borgonha Intenso

## Funcionalidades Principais

### 1. Busca e Filtros

```typescript
// Buscar cores por categoria
const loiros = searchHairColors({
  category: 'blonde',
  isAvailable: true
});

// Filtrar por nível e undertone
const coresQuentes = searchHairColors({
  undertone: 'warm',
  levelRange: [5, 8]
});

// Filtrar por dificuldade e preço
const coresBasicas = searchHairColors({
  difficulty: 'basic',
  priceRange: [1.0, 1.5]
});
```

### 2. Sistema de Harmonização

```typescript
// Gerar harmonizações para uma cor
const harmonizacao = generateColorHarmonization('#16');

// Encontrar cores compatíveis
const compativeis = getCompatibleColors('#24');

// Análise de compatibilidade múltipla
const relatorio = generateCompatibilityReport(['#16', '#24', '#27']);
```

### 3. Cálculos de Transformação

```typescript
// Calcular custo de transformação
const custo = calculateColorTransformationCost('#2', '#613', 'long');

// Validar segurança da transformação
const validacao = validateColorTransformation('#1', '#10');

// Gerar formulação
const formulacao = generateColorFormulation('#27');
```

### 4. Recomendações Inteligentes

```typescript
// Encontrar cores similares
const similares = findSimilarColors('#6', 5);

// Obter cor por código
const cor = getColorByCode('#8');
```

## Níveis de Dificuldade

### Basic (1.0x - 1.2x preço)
- Cores naturais básicas
- Processo simples
- Ideal para iniciantes
- Manutenção baixa

### Intermediate (1.2x - 1.4x preço)
- Requer conhecimento técnico
- Pode necessitar pré-descoloração
- Matização necessária

### Advanced (1.4x - 1.8x preço)
- Processo complexo
- Múltiplas etapas
- Requer experiência profissional

### Premium (1.8x - 2.2x preço)
- Máxima complexidade
- Múltiplas sessões
- Manutenção intensiva
- Resultado exclusivo

## Undertones e Harmonização

### Cool (Frio)
- Nuances azuladas, violetas, acinzentadas
- Ideal para peles frias
- Cancela tons amarelados

### Warm (Quente)
- Nuances douradas, acobreadas, avermelhadas
- Ideal para peles quentes
- Adiciona luminosidade

### Neutral (Neutro)
- Sem dominante de cor
- Versátil para todos os tipos de pele
- Base universal

## Sistema de Preços

O sistema utiliza multiplicadores baseados na complexidade:

```typescript
const precoFinal = precoBase * color.priceMultiplier * comprimentoCabelo;
```

### Fatores que Afetam o Preço
1. **Dificuldade técnica**: Basic (1.0x) → Premium (2.2x)
2. **Comprimento do cabelo**: Curto (1.0x) → Extra longo (2.2x)
3. **Complexidade da transformação**: Diferença de níveis
4. **Cor de destino**: Cores premium têm multiplicador maior

## Integração com E-commerce

### Filtros Pré-configurados

```typescript
ColorFilterUtils.popularFilters = {
  natural: { category: 'natural', isAvailable: true },
  blonde: { category: 'blonde', isAvailable: true },
  premium: { isPremium: true, isAvailable: true },
  beginner: { difficulty: 'basic', isAvailable: true },
  warm: { undertone: 'warm', isAvailable: true },
  cool: { undertone: 'cool', isAvailable: true }
};
```

### Sistema de Recomendação

1. **Baseado em compatibilidade**: Cores harmoniosas
2. **Baseado em similaridade**: Cores do mesmo perfil
3. **Baseado em nível de usuário**: Adequado à experiência

## Validação e Segurança

### Validações Implementadas

1. **Compatibilidade de cores**: Evita combinações problemáticas
2. **Diferença de níveis**: Alerta para transformações extremas
3. **Complexidade técnica**: Recomenda profissional quando necessário
4. **Cuidados pós-aplicação**: Orientações específicas por cor

### Avisos Automáticos

- Transformações de alto risco
- Necessidade de múltiplas sessões
- Cuidados especiais de manutenção
- Incompatibilidades conhecidas

## Casos de Uso Práticos

### Para Clientes
- Busca por tipo de cor desejado
- Visualização de cores compatíveis
- Cálculo de custos estimados
- Recomendações personalizadas

### Para Profissionais
- Formulações técnicas
- Validação de processos
- Cálculo de tempo e materiais
- Orientações de aplicação

### Para E-commerce
- Filtros inteligentes
- Sistema de recomendação
- Cálculo de preços dinâmico
- Análise de popularidade

## Manutenção e Extensibilidade

### Adicionando Novas Cores

1. Adicionar no array `PROFESSIONAL_HAIR_COLORS`
2. Definir todas as propriedades obrigatórias
3. Configurar compatibilidades
4. Testar validações

### Atualizando Compatibilidades

As compatibilidades são baseadas em conhecimento profissional de colorimetria e podem ser atualizadas conforme necessário.

### Novos Filtros

O sistema é extensível para novos tipos de filtros através da interface `HairColorFilter`.

## Performance

- **Índices otimizados**: Busca O(1) por código
- **Cache de compatibilidade**: Evita recálculos
- **Filtros eficientes**: Algoritmos otimizados
- **Lazy loading**: Carregamento sob demanda quando necessário

## Padrões da Indústria

O sistema segue os padrões internacionais:
- **Escala de níveis 1-10**
- **Códigos numéricos oficiais**
- **Terminologia técnica padrão**
- **Classificação por undertones**
- **Compatibilidade com produtos profissionais**