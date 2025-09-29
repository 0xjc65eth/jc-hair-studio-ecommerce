# NOVO ISSUE PARA O GITHUB (COM REPRODUÇÃO)

Copie e cole este conteúdo no novo issue após criar o repositório:

---

## Title: Critical: Stripe Live API Connection Failure from Vercel Functions

### Verify canary release

- [X] I verified that the issue exists in the latest Next.js canary release

### Provide environment information

```bash
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin 24.5.0

Binaries:
  Node: 20.x
  npm: 10.x

Relevant Packages:
  next: 15.5.3
  react: 19.0.0
  stripe: 14.14.0

Next.js Config:
  output: N/A
```

### Which area(s) of Next.js are affected? (leave empty if unsure)

API Routes, Middleware / Edge (API routes, runtime)

### Link to the code that reproduces this issue

https://github.com/0xjc65eth/vercel-stripe-bug-reproduction

### To Reproduce

1. Clone the reproduction repository
2. Add `STRIPE_SECRET_KEY` to Vercel environment variables (live key)
3. Deploy to Vercel
4. Visit `/api/test-stripe`
5. Observe the connection error

### Describe the Bug

When deployed to Vercel, any attempt to connect to Stripe's Live API from Vercel Functions fails with:

```
An error occurred with our connection to Stripe. Request was retried X times.
```

This happens with:
- All Stripe API endpoints (Payment Intents, Checkout Sessions, Account retrieve)
- Different Stripe SDK configurations
- Both minimal and complex implementations
- Live keys (test keys may also fail)

The exact same code works:
- ✅ Locally with the same keys
- ✅ On other hosting providers
- ❌ Only fails on Vercel Functions

### Expected Behavior

Stripe API calls should complete successfully from Vercel Functions, just as they do locally.

### Which browser are you using? (if relevant)

N/A - Server-side issue

### How are you deploying your application? (if relevant)

Vercel

### Additional Context

This appears to be an infrastructure-level connectivity issue between Vercel and Stripe's API servers. We've tested:

1. Multiple Stripe SDK configurations (with/without timeout, retries)
2. Different API endpoints
3. Minimal implementations (single API call)
4. Direct HTTPS calls to api.stripe.com

**Business Impact:** This is causing 100% payment failure on our production e-commerce site (https://jchairstudios62.xyz), making it business-critical.

**Vercel Project:** jc-hair-studio
**First occurrence:** Today
**Frequency:** Consistent (100% failure rate)

Related to closed issue #84136 (now with proper reproduction).

---

## PASSOS PARA POSTAR:

1. **Crie o repositório** em https://github.com/new
   - Nome: `vercel-stripe-bug-reproduction`
   - Público: SIM

2. **Push do código:**
   ```bash
   cd /tmp/vercel-stripe-bug-reproduction
   git remote add origin https://github.com/SEU_USUARIO/vercel-stripe-bug-reproduction.git
   git push -u origin master
   ```

3. **Crie o issue** em: https://github.com/vercel/next.js/issues/new/choose
   - Escolha "Bug Report"
   - Cole o conteúdo acima

4. **Importante:**
   - Marque como URGENTE
   - Mencione que é business-critical
   - Reference o issue fechado #84136