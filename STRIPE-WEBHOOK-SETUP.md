# 🔗 STRIPE WEBHOOK CONFIGURATION

## 📋 WEBHOOKS NECESSÁRIOS PARA JC HAIR STUDIO'S 62

### 🎯 **ENDPOINT URL (após deploy):**
```
https://jchairstudios62.vercel.app/api/webhooks/stripe
```

### ⚡ **EVENTOS ESSENCIAIS A CONFIGURAR:**

#### **1. PAGAMENTOS (OBRIGATÓRIOS)**
```
checkout.session.completed        # Checkout finalizado com sucesso
payment_intent.succeeded          # Pagamento aprovado
payment_intent.payment_failed     # Pagamento falhado
```

#### **2. FATURAS E COBRANÇA**
```
invoice.payment_succeeded         # Fatura paga (para assinaturas)
invoice.payment_failed           # Fatura não paga
```

#### **3. ASSINATURAS (SE APLICÁVEL)**
```
customer.subscription.created     # Assinatura criada
customer.subscription.updated     # Assinatura atualizada
customer.subscription.deleted     # Assinatura cancelada
```

#### **4. DISPUTAS E SEGURANÇA**
```
charge.dispute.created           # Contestação criada
charge.failed                    # Cobrança falhada
```

---

## 🛠️ **PASSO A PASSO CONFIGURAÇÃO:**

### **1. Acessar Dashboard Stripe**
1. Login em https://dashboard.stripe.com
2. Ir para **Developers** > **Webhooks**
3. Clicar **+ Add endpoint**

### **2. Configurar Endpoint**
```
Endpoint URL: https://jchairstudios62.vercel.app/api/webhooks/stripe
Description: JC Hair Studio Ecommerce Webhooks
Version: Latest API version
```

### **3. Selecionar Eventos**
Marcar exatamente estes eventos:
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `charge.dispute.created`

### **4. Obter Webhook Secret**
1. Após criar o webhook, clique nele
2. Ir para **Signing secret**
3. Clicar **Reveal** e copiar o valor `whsec_...`

### **5. Atualizar Variável de Ambiente**
Substitua no `.env.local`:
```env
STRIPE_WEBHOOK_SECRET="whsec_SEU_WEBHOOK_SECRET_AQUI"
```

---

## 🧪 **TESTE DOS WEBHOOKS:**

### **Stripe CLI (Desenvolvimento)**
```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Testar webhooks localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### **Produção (Stripe Dashboard)**
1. Acesso: Dashboard > Webhooks > [Seu endpoint]
2. Aba **Testing**
3. Enviar eventos de teste para verificar funcionamento

---

## ✅ **RESULTADO ESPERADO:**

Após configuração, o sistema automaticamente:

1. **Pagamento aprovado** → Pedido marcado como "CONCLUÍDO"
2. **Pagamento falhado** → Pedido marcado como "PAGAMENTO_FALHADO"
3. **Checkout completo** → Email de confirmação enviado
4. **Disputa criada** → Administradores notificados

---

## 🔧 **CONFIGURAÇÃO ADICIONAL NECESSÁRIA:**

### **Após Deploy:**
1. Deploy no Vercel: `vercel --prod`
2. Copie o URL final (ex: https://jchairstudios62.vercel.app)
3. Configure webhooks no Stripe com este URL
4. Atualize `STRIPE_WEBHOOK_SECRET` nas variáveis do Vercel
5. Teste uma compra completa

### **Variáveis Vercel Dashboard:**
```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

**🎯 COM ESTA CONFIGURAÇÃO, SEU SISTEMA DE PAGAMENTOS ESTARÁ 100% FUNCIONAL!**