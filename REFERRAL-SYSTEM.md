# Sistema de Referrals - JC Hair Studio's 62

## 📋 Visão Geral

Sistema completo de referrals que permite aos usuários indicar amigos e ganhar recompensas em forma de:
- **Descontos** (percentuais ou valores fixos)
- **Cashback** (dinheiro real para saque)
- **Pontos** (sistema de fidelidade existente)

## 🏗️ Arquitetura do Sistema

### 📊 Modelos de Dados (Prisma Schema)

#### 1. **ReferralCode** - Códigos de Referral
```prisma
model ReferralCode {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  userId              String   @db.ObjectId
  code                String   @unique
  isActive            Boolean  @default(true)
  maxUses             Int      @default(100)
  currentUses         Int      @default(0)
  referrerRewardType  ReferralRewardType @default(PERCENTAGE)
  referrerRewardValue Float    @default(0.10) // 10% default
  refereeRewardType   ReferralRewardType @default(PERCENTAGE)
  refereeRewardValue  Float    @default(0.05) // 5% default
  validFrom           DateTime @default(now())
  validTo             DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

#### 2. **Referral** - Registro de Indicações
```prisma
model Referral {
  id               String         @id @default(auto()) @map("_id") @db.ObjectId
  referralCodeId   String         @db.ObjectId
  referrerId       String         @db.ObjectId // Quem indicou
  refereeId        String         @db.ObjectId // Quem foi indicado
  status           ReferralStatus @default(PENDING)
  ipAddress        String?
  userAgent        String?
  source           String? // "link", "social", "email"
  firstPurchaseId  String?        @db.ObjectId
  firstPurchaseAt  DateTime?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}
```

#### 3. **ReferralReward** - Recompensas
```prisma
model ReferralReward {
  id               String             @id @default(auto()) @map("_id") @db.ObjectId
  referralId       String             @db.ObjectId
  userId           String             @db.ObjectId // Quem recebeu
  type             ReferralRewardType
  rewardType       RewardDeliveryType
  value            Float              // Valor em EUR ou porcentagem
  points           Int                @default(0)
  cashbackAmount   Float              @default(0)
  cashbackStatus   CashbackStatus     @default(PENDING)
  orderId          String?            @db.ObjectId
  couponCode       String?            @unique
  status           RewardStatus       @default(PENDING)
  processedAt      DateTime?
  paidAt           DateTime?
  expiresAt        DateTime?
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
}
```

#### 4. **ReferralCashback** - Gestão de Cashback
```prisma
model ReferralCashback {
  id              String       @id @default(auto()) @map("_id") @db.ObjectId
  userId          String       @unique @db.ObjectId
  totalEarned     Float        @default(0)
  totalPaid       Float        @default(0)
  availableBalance Float       @default(0)
  pendingBalance   Float       @default(0)
  bankAccount     String?
  bankName        String?
  accountHolder   String?
  minPayoutAmount Float        @default(25.0) // Mínimo €25
  payoutMethod    PayoutMethod @default(BANK_TRANSFER)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}
```

#### 5. **UserReferralStats** - Estatísticas do Usuário
```prisma
model UserReferralStats {
  id                    String   @id @default(auto()) @map("_id") @db.ObjectId
  userId                String   @unique @db.ObjectId
  currentTierId         String?  @db.ObjectId
  totalReferrals        Int      @default(0)
  successfulReferrals   Int      @default(0)
  totalReferralSales    Float    @default(0)
  totalRewardsEarned    Float    @default(0)
  totalCashbackEarned   Float    @default(0)
  totalPointsEarned     Int      @default(0)
  monthlyReferrals      Int      @default(0)
  monthlyReferralSales  Float    @default(0)
  lastMonthlyReset      DateTime @default(now())
  profileViews          Int      @default(0)
  linkClicks            Int      @default(0)
  socialShares          Int      @default(0)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

#### 6. **ReferralTier** - Sistema de Níveis
```prisma
model ReferralTier {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  name                String   @unique
  description         String?
  minReferrals        Int      @default(0)
  minTotalSales       Float    @default(0)
  referrerRewardBonus Float    @default(0)
  refereeRewardBonus  Float    @default(0)
  cashbackMultiplier  Float    @default(1.0)
  freeShipping        Boolean  @default(false)
  prioritySupport     Boolean  @default(false)
  exclusiveProducts   Boolean  @default(false)
  badgeIcon           String?
  badgeColor          String?
  displayOrder        Int      @default(0)
  isActive            Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

### 🔄 Enums
```prisma
enum ReferralStatus {
  PENDING     // Usuário se registrou mas não comprou
  QUALIFIED   // Primeira compra realizada
  REWARDED    // Recompensas processadas
  CANCELLED   // Cancelado
}

enum ReferralRewardType {
  PERCENTAGE  // Porcentagem de desconto
  FIXED       // Valor fixo
  POINTS      // Pontos no sistema
  CASHBACK    // Dinheiro real
}

enum RewardDeliveryType {
  DISCOUNT_COUPON // Cupom de desconto
  STORE_CREDIT    // Crédito na loja
  CASHBACK        // Dinheiro real
  LOYALTY_POINTS  // Pontos de fidelidade
}

enum CashbackStatus {
  PENDING     // Aguardando processamento
  AVAILABLE   // Disponível para saque
  PAID        // Pago
  CANCELLED   // Cancelado
}
```

## 🛠️ Serviços e APIs

### 📡 API Endpoints

#### 1. `/api/referrals` (GET/POST)
- **GET**: Buscar código de referral do usuário
- **POST**: Criar novo código de referral

#### 2. `/api/referrals/[code]` (GET)
- Validar código de referral

#### 3. `/api/referrals/stats` (GET)
- Buscar estatísticas completas do usuário

#### 4. `/api/referrals/process` (POST)
- Processar referral quando usuário se registra

#### 5. `/api/referrals/cashback/payout` (GET/POST)
- **GET**: Histórico de saques
- **POST**: Solicitar saque de cashback

### 🔧 ReferralService
Serviço principal que gerencia toda a lógica de referrals:

```typescript
class ReferralService {
  // Gerar código único
  generateReferralCode(): string

  // Criar código de referral
  createReferralCode(data: CreateReferralCodeData)

  // Processar referral no registro
  processReferral(data: ProcessReferralData)

  // Processar primeira compra e ativar recompensas
  processFirstPurchase(refereeId: string, orderId: string, orderValue: number)

  // Calcular recompensas
  calculateRewardAmount(type: ReferralRewardType, value: number, orderValue: number)

  // Entregar recompensas
  deliverReward(reward: any)

  // Solicitar saque de cashback
  requestCashbackPayout(userId: string, amount: number, method: PayoutMethod)

  // Buscar estatísticas
  getUserStats(userId: string)
  getUserReferrals(userId: string, limit?: number, offset?: number)
  getUserRewards(userId: string, limit?: number, offset?: number)
  getUserCashback(userId: string)
}
```

## 🎨 Interface do Usuário

### 📱 Páginas

#### 1. `/conta/referrals` - Dashboard Principal
- **Estatísticas**: Total de indicações, vendas geradas, recompensas
- **Código de Referral**: Geração e compartilhamento
- **Compartilhamento Social**: WhatsApp, Facebook, Twitter, Telegram
- **Abas**: Indicações, Recompensas, Cashback
- **Histórico**: Indicações recentes e recompensas

#### 2. `/ref/[code]` - Landing Page de Referral
- **Validação**: Verificação automática do código
- **Benefícios**: Exibição das recompensas
- **Conversão**: Registro ou login do usuário
- **Tracking**: Rastreamento de origem e dispositivo

#### 3. `/auth/signup` - Registro com Referral
- **Campo de Código**: Captura automática via URL ou localStorage
- **Validação em Tempo Real**: Verificação do código
- **Exibição de Benefícios**: Mostra recompensas disponíveis
- **Processamento**: Integração com o sistema de referrals

## ⚙️ Integração com Checkout

### 🔗 Webhook do Stripe Modificado
O webhook `/api/webhooks/stripe` foi atualizado para processar referrals:

```typescript
// No evento payment_intent.succeeded
async function processReferralPurchase(paymentIntent: Stripe.PaymentIntent, requestId: string) {
  const userId = paymentIntent.metadata.userId
  const orderId = paymentIntent.id
  const orderValue = paymentIntent.amount / 100

  // Processar primeira compra e ativar recompensas
  const referral = await referralService.processFirstPurchase(userId, orderId, orderValue)

  if (referral) {
    // Enviar notificações
    await sendReferralNotification({ referral, orderId, orderValue, requestId })
  }
}
```

## 💰 Sistema de Recompensas

### 🎁 Tipos de Recompensas

#### 1. **Descontos**
- **Percentual**: 5%, 10%, 15%, etc.
- **Valor Fixo**: €5, €10, €25, etc.
- **Entrega**: Cupom automático com validade de 30 dias

#### 2. **Cashback**
- **Percentual do Pedido**: 5%, 10%, etc.
- **Acúmulo**: Saldo disponível para saque
- **Saque Mínimo**: €25
- **Métodos**: Transferência bancária, PayPal, PIX

#### 3. **Pontos**
- **Integração**: Sistema de pontos existente
- **Conversão**: 1 ponto = €0.01
- **Uso**: Desconto em futuras compras

### 🏆 Sistema de Níveis (Tiers)

| Nível | Min. Indicações | Min. Vendas | Bonus Referrer | Bonus Referee | Benefícios |
|-------|----------------|-------------|----------------|---------------|------------|
| Iniciante | 0 | €0 | +0% | +0% | - |
| Bronze | 3 | €150 | +2% | +1% | - |
| Prata | 10 | €500 | +5% | +2.5% | Frete Grátis |
| Ouro | 25 | €1500 | +8% | +4% | Frete + Suporte + Produtos Exclusivos |
| Platina | 50 | €3000 | +12% | +6% | Todos os Benefícios |
| Diamante | 100 | €6000 | +15% | +8% | Elite |

## 🚀 Configuração e Deploy

### 📋 Pré-requisitos
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
MONGODB_URI=mongodb://...
NEXTAUTH_URL=https://seu-site.com
SENDGRID_API_KEY=...
STRIPE_SECRET_KEY=...
```

### 🔄 Atualização do Banco
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations (se necessário)
npx prisma db push

# Seed dos tiers iniciais
npx tsx lib/seeders/referral-tiers-seed.ts
```

### ⚡ Deploy
1. **Build**: `npm run build`
2. **Deploy**: Vercel, Railway, etc.
3. **MongoDB**: Configurar cluster
4. **Webhooks**: Configurar Stripe webhooks

## 📊 Analytics e Métricas

### 📈 Métricas de Usuário
- Total de indicações
- Indicações convertidas
- Vendas geradas
- Recompensas ganhas
- Cashback acumulado
- Nível atual

### 🎯 Métricas de Sistema
- Taxa de conversão de referrals
- Valor médio por referral
- ROI do programa
- Usuários mais ativos
- Performance por canal

## 🔐 Segurança

### ✅ Validações
- Códigos únicos de 8 caracteres
- Limite de usos por código
- Verificação de expiração
- Prevenção de auto-referral
- Validação de primeira compra

### 🛡️ Proteções
- Rate limiting nas APIs
- Validação de entrada
- Sanitização de dados
- Logs de auditoria
- Prevenção de fraudes

## 🔄 Próximos Passos

### 📝 Melhorias Futuras
1. **Dashboard Admin**: Gestão completa do sistema
2. **Relatórios Avançados**: Analytics detalhados
3. **Notificações Push**: Alertas em tempo real
4. **Integração Social**: Login social automático
5. **Gamificação**: Badges e conquistas
6. **API Pública**: Para integrações externas
7. **Multi-idioma**: Suporte internacional
8. **Mobile App**: Aplicativo dedicado

### 🧪 Testes
- [ ] Testes unitários dos serviços
- [ ] Testes de integração das APIs
- [ ] Testes E2E do fluxo completo
- [ ] Testes de carga
- [ ] Testes de segurança

## 📞 Suporte

Para dúvidas sobre implementação ou uso do sistema:
- 📧 Email: suporte@jchairstudios62.xyz
- 📱 WhatsApp: +351 928 375 226
- 🌐 Site: https://jchairstudios62.xyz

---

**Sistema de Referrals v1.0** - JC Hair Studio's 62 🇵🇹
*Desenvolvido com ❤️ para aumentar vendas através de indicações*