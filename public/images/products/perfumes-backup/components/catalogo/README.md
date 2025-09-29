# Componentes de Catálogo - JC Hair Studio's 62

Este diretório contém componentes especializados para diferentes categorias de produtos do catálogo.

## EsmaltesCorpo.tsx

Componente React para exibir produtos de Esmaltes e Cuidados Corporais com ênfase nas emoções e memórias que esses produtos despertam.

### Características Implementadas

✅ **Galeria de cores para esmaltes**
- Preview das cores dos esmaltes com códigos hexadecimais
- Seleção interativa de cores
- Descrição do mood/emoção de cada cor

✅ **Seletor de fragrâncias**
- Pirâmide olfativa (saída, coração, fundo)
- Descrição sensorial detalhada
- Notas de fragrância organizadas

✅ **Opções de kit vs unidade**
- Toggle entre compra individual e kit completo
- Preços diferenciados
- Cálculo automático de economia

✅ **Preview das cores dos esmaltes**
- Visualização em tempo real das cores
- Interface intuitiva de seleção

✅ **Descrição sensorial das fragrâncias**
- Textos evocativos e sensoriais
- Conexão emocional com as fragrâncias

✅ **Badges sustentabilidade/vegano**
- Indicadores visuais de produtos eco-friendly
- Badges de qualidade e certificações

✅ **Seção "antes/depois" com fotos**
- Transformação visual
- Benefícios tangíveis

✅ **Ênfase em emoções e memórias**
- Textos que despertam nostalgia
- Conexão emocional com os produtos
- Histórias pessoais e memórias afetivas

### Produtos Implementados

1. **Risqué Coleção Clássicos** (€8/€42) - "Nostalgia em vidrinhos"
   - 6 cores clássicas
   - Opções de unidade ou kit
   - Foco em memórias e tradição

2. **Risqué Coleção Verão Brasileiro** (€32) - "Verão eterno nas unhas"
   - 6 cores tropicais
   - Kit exclusivo
   - Evoca férias e brasilidade

3. **Dailus Esmaltes Veganos** (€35) - "Beleza consciente"
   - 5 cores sustentáveis
   - Certificação vegana
   - Foco na consciência ambiental

4. **O Boticário Nativa SPA Ameixa** (€25/€30) - "Cheiro que define o Brasil"
   - Fragrância icônica brasileira
   - Pirâmide olfativa completa
   - Memórias familiares

5. **Natura Ekos Castanha** (€28) - "Amazônia na sua pele"
   - Ingredientes amazônicos
   - Sustentabilidade
   - Conexão com as origens

6. **Match Boticário Desodorante** (€22) - "Memórias da adolescência"
   - Perfume nostálgico
   - Primeiro perfume
   - Juventude e descobertas

### Como Usar

```tsx
import { EsmaltesCorpo } from '../components/catalogo';

// Uso simples
<EsmaltesCorpo />

// Integração em página
export default function BeautyCare() {
  return (
    <div>
      <HeaderSection />
      <EsmaltesCorpo />
      <FooterSection />
    </div>
  );
}
```

### Funcionalidades Interativas

- **Filtros**: Por categoria (esmaltes/corporais) e sustentabilidade
- **Seleção de cores**: Interface visual para esmaltes
- **Pirâmide olfativa**: Para produtos corporais
- **Comparação de preços**: Unidade vs. kit
- **Expansão de detalhes**: Informações adicionais sob demanda
- **Call to actions**: Botões de favoritar e adicionar ao carrinho

### Estilo Visual

- Design minimalista e elegante
- Cores neutras com acentos em âmbar
- Typography: Playfair Display para títulos
- Animações suaves de hover e transição
- Cards com shadow e hover effects
- Badges coloridos para categorização

### Responsividade

- Grid adaptativo: 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)
- Componentes otimizados para touch
- Texto legível em todos os tamanhos
- Imagens e botões proporcionalmente ajustados

### Estados e Interações

- Loading states para ações assíncronas
- Hover effects em cards e botões
- Estados selecionados para cores e opções
- Transições suaves entre estados
- Feedback visual para ações do usuário

### Extensibilidade

O componente foi projetado para ser facilmente extensível:

- Novos produtos podem ser adicionados ao array `produtos`
- Novas categorias de filtro podem ser implementadas
- Componentes internos são reutilizáveis
- Interface TypeScript bem definida

### Dependências

- React 18+
- Lucide React (ícones)
- clsx (classes condicionais)
- Componentes UI internos (Card, Button, Badge)

### Performance

- Componentes otimizados com React.memo onde apropriado
- Lazy loading para imagens quando implementado
- Estados locais eficientes
- Renderização condicional para melhor performance