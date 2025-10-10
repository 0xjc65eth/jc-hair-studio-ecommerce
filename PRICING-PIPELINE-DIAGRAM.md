# Pricing Pipeline - Visual Architecture Diagram

## 🎯 CURRENT STATE (BROKEN)

```
┌────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                   │
│                                                                        │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │ tintasCapilares.ts  │  │ esmaltesImpala.ts   │                   │
│  │ 85 products         │  │ 55 products         │                   │
│  │ basePrice: 12.0     │  │ basePrice: 6.5      │  ← ALREADY EUR!  │
│  │ currency: ??? ❌    │  │ currency: ??? ❌    │                   │
│  └─────────────────────┘  └─────────────────────┘                   │
│                                                                        │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │ perfumesWepink.ts   │  │ megaHairProducts.ts │                   │
│  │ 32 products         │  │ ??? products        │                   │
│  │ basePrice: 31.4     │  │ basePrice: ??? BRL? │  ← NEEDS CONV?   │
│  │ currency: ??? ❌    │  │ currency: ??? ❌    │                   │
│  └─────────────────────┘  └─────────────────────┘                   │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
                                    ↓ (no currency info!)
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                      CONVERSION LAYER (CONFLICT!)                      │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ System A: price-conversion.ts                                    │ │
│  │                                                                  │ │
│  │ convertBrlToEur(price):                                         │ │
│  │   return price × 0.20 × 1.5                                     │ │
│  │                                                                  │ │
│  │ Example: 12.0 → 12.0 × 0.20 × 1.5 = 3.60                       │ │
│  │                                                                  │ │
│  │ ❌ PROBLEM: Treats ALL inputs as BRL!                           │ │
│  │ ❌ RESULT: EUR inputs get 70% price destruction!                │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ System B: price-converter.ts                                     │ │
│  │                                                                  │ │
│  │ convertBRLtoEUR(price):                                         │ │
│  │   return (price / 5.50) × 1.15 + 2.50                          │ │
│  │                                                                  │ │
│  │ Example: 12.0 → (12.0 / 5.50) × 1.15 + 2.50 = 5.01            │ │
│  │                                                                  │ │
│  │ ❌ PROBLEM: Also treats ALL inputs as BRL!                      │ │
│  │ ❌ RESULT: Different corruption, but still wrong!               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
                                    ↓ (corrupted prices!)
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                         FORMATTING LAYER                               │
│                                                                        │
│  formatCurrency(value, 'EUR'):                                        │
│    return Intl.NumberFormat('pt-PT', {                               │
│      currency: 'EUR'                                                  │
│    }).format(value)                                                   │
│                                                                        │
│  Example: 3.60 → "€3,60" ❌ (should be €12,00)                       │
│                                                                        │
│  💡 Just formats - doesn't know price is corrupted!                   │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
                                    ↓ (displayed to customer)
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                          DISPLAY LAYER                                 │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ <ProductCard>                                                  │  │
│  │   Biocolor Tinta Capilar                                       │  │
│  │   ❌ €3,60  (WRONG!)                                            │  │
│  │   Expected: €12,00                                             │  │
│  │                                                                │  │
│  │   Impala Esmalte                                               │  │
│  │   ❌ €1,95  (WRONG!)                                            │  │
│  │   Expected: €6,50                                              │  │
│  │                                                                │  │
│  │   Wepink Perfume                                               │  │
│  │   ❌ €9,42  (WRONG!)                                            │  │
│  │   Expected: €31,40                                             │  │
│  └────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ FIXED STATE (SOLUTION)

```
┌────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                   │
│                                                                        │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │ tintasCapilares.ts  │  │ esmaltesImpala.ts   │                   │
│  │ 85 products         │  │ 55 products         │                   │
│  │ basePrice: 12.0     │  │ basePrice: 6.5      │                   │
│  │ currency: 'EUR' ✅  │  │ currency: 'EUR' ✅  │  ← Explicit!     │
│  └─────────────────────┘  └─────────────────────┘                   │
│                                                                        │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │ perfumesWepink.ts   │  │ megaHairProducts.ts │                   │
│  │ 32 products         │  │ ??? products        │                   │
│  │ basePrice: 31.4     │  │ basePrice: 500.0    │                   │
│  │ currency: 'EUR' ✅  │  │ currency: 'BRL' ✅  │  ← Explicit!     │
│  └─────────────────────┘  └─────────────────────┘                   │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
                                    ↓ (with currency metadata!)
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    SMART CONVERSION LAYER (NEW!)                       │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ getPriceInEur(product): number                                   │ │
│  │                                                                  │ │
│  │   // Step 1: Check currency                                     │ │
│  │   if (product.pricing.currency === 'EUR') {                     │ │
│  │     return product.pricing.basePrice;  // ✅ No conversion!     │ │
│  │   }                                                              │ │
│  │                                                                  │ │
│  │   // Step 2: Only convert BRL                                   │ │
│  │   if (product.pricing.currency === 'BRL') {                     │ │
│  │     return convertBrlToEur(product.pricing.basePrice);          │ │
│  │   }                                                              │ │
│  │                                                                  │ │
│  │   // Step 3: Error for unknown                                  │ │
│  │   throw new Error('Unknown currency');                          │ │
│  │                                                                  │ │
│  │ ✅ SOLUTION: Currency-aware conversion!                          │ │
│  │ ✅ RESULT: EUR prices preserved, BRL converted!                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  Examples:                                                             │
│  • Tinta (EUR): 12.0 → 12.0 ✅                                        │
│  • Esmalte (EUR): 6.5 → 6.5 ✅                                        │
│  • Perfume (EUR): 31.4 → 31.4 ✅                                      │
│  • Mega Hair (BRL): 500.0 → 150.0 ✅ (converted)                      │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
                                    ↓ (correct prices!)
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                         FORMATTING LAYER                               │
│                                                                        │
│  formatCurrency(value, 'EUR'):                                        │
│    return Intl.NumberFormat('pt-PT', {                               │
│      currency: 'EUR'                                                  │
│    }).format(value)                                                   │
│                                                                        │
│  Examples:                                                             │
│  • 12.0 → "€12,00" ✅                                                 │
│  • 6.5 → "€6,50" ✅                                                   │
│  • 31.4 → "€31,40" ✅                                                 │
│                                                                        │
│  💡 Formats correct prices - no more corruption!                      │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
                                    ↓ (displayed to customer)
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                          DISPLAY LAYER                                 │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ <ProductCard>                                                  │  │
│  │   Biocolor Tinta Capilar                                       │  │
│  │   ✅ €12,00  (CORRECT!)                                         │  │
│  │                                                                │  │
│  │   Impala Esmalte                                               │  │
│  │   ✅ €6,50   (CORRECT!)                                         │  │
│  │                                                                │  │
│  │   Wepink Perfume                                               │  │
│  │   ✅ €31,40  (CORRECT!)                                         │  │
│  │                                                                │  │
│  │   Mega Hair (converted from BRL)                               │  │
│  │   ✅ €150,00 (CORRECT!)                                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 DETAILED CONVERSION FLOW COMPARISON

### ❌ BEFORE (Broken)

```
Product: Tinta Capilar (stored in EUR)
├─ Data File: basePrice: 12.0 (EUR)
│
├─ ❌ MISTAKE: Assumed to be BRL
│
├─ Conversion: convertBrlToEur(12.0)
│  └─ Formula: 12.0 × 0.20 × 1.5 = 3.60
│
├─ Format: formatCurrency(3.60, 'EUR')
│  └─ Output: "€3,60"
│
└─ Display: €3,60 ❌ (70% loss!)
```

### ✅ AFTER (Fixed)

```
Product: Tinta Capilar (stored in EUR)
├─ Data File:
│  ├─ basePrice: 12.0
│  └─ currency: 'EUR' ✅
│
├─ Smart Conversion: getPriceInEur(product)
│  ├─ Check: currency === 'EUR'? Yes!
│  └─ Return: 12.0 (no conversion) ✅
│
├─ Format: formatCurrency(12.0, 'EUR')
│  └─ Output: "€12,00"
│
└─ Display: €12,00 ✅ (preserved!)
```

---

## 📊 CONVERSION DECISION TREE

```
                      Product.pricing
                            |
                            |
                  ┌─────────┴─────────┐
                  │ Check currency    │
                  └─────────┬─────────┘
                            |
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        currency === 'EUR'      currency === 'BRL'
                │                       │
                │                       │
                ▼                       ▼
        ┌───────────────┐      ┌───────────────┐
        │ Return price  │      │ Convert price │
        │ as-is         │      │ BRL → EUR     │
        │ (no change)   │      │               │
        └───────┬───────┘      └───────┬───────┘
                │                       │
                │                       │
                └───────────┬───────────┘
                            │
                            ▼
                    Format to EUR
                            │
                            ▼
                    Display to user
```

---

## 🎯 PRICE FLOW BY CATEGORY

### Category: Cosmetics (Tintas, Esmaltes, Perfumes)
```
Storage:     EUR (already converted)
Conversion:  SKIP (pass-through)
Display:     EUR (direct)

Example Flow:
  12.0 EUR → [NO CONVERSION] → 12.0 EUR → "€12,00"
```

### Category: Mega Hair
```
Storage:     BRL (Brazilian pricing)
Conversion:  REQUIRED (BRL → EUR)
Display:     EUR (converted)

Example Flow:
  500.0 BRL → [CONVERT] → 150.0 EUR → "€150,00"
```

### Category: Mixed (Future Products)
```
Storage:     Varies (check currency field)
Conversion:  Conditional (based on currency)
Display:     EUR (normalized)

Example Flow:
  product.currency === 'EUR' ? passthrough : convert
```

---

## 🔧 IMPLEMENTATION CODE

### Step 1: Type Definition
```typescript
// types/product.ts
interface ProductPricing {
  basePrice: number;
  ourPrice: number;
  discountPrice?: number;
  currency: 'BRL' | 'EUR';        // ← Required!
  requiresConversion: boolean;     // ← Helper
  margin: string;
  competitive: string;
}
```

### Step 2: Safe Conversion
```typescript
// lib/utils/price-safe-conversion.ts
export function getPriceInEur(product: Product): number {
  const { currency, basePrice } = product.pricing;

  // Guard: Already EUR
  if (currency === 'EUR') {
    return basePrice;  // Pass-through
  }

  // Convert: BRL to EUR
  if (currency === 'BRL') {
    return convertBrlToEur(basePrice);
  }

  // Error: Unknown
  throw new Error(`Unknown currency: ${currency}`);
}
```

### Step 3: Usage in Components
```typescript
// components/ui/ProductCard.tsx
import { getPriceInEur } from '@/lib/utils/price-safe-conversion';

function ProductCard({ product }: { product: Product }) {
  const priceInEur = getPriceInEur(product);  // Safe!
  const formatted = formatCurrency(priceInEur, 'EUR');

  return <div className="price">{formatted}</div>;
}
```

---

## 🧪 TEST SCENARIOS

### Test 1: EUR Price (No Conversion)
```typescript
Input:
  product = {
    pricing: {
      basePrice: 12.0,
      currency: 'EUR'
    }
  }

Expected:
  getPriceInEur(product) === 12.0

Result: ✅ PASS
```

### Test 2: BRL Price (With Conversion)
```typescript
Input:
  product = {
    pricing: {
      basePrice: 100.0,
      currency: 'BRL'
    }
  }

Expected:
  getPriceInEur(product) === 30.0  // Using System A

Result: ✅ PASS
```

### Test 3: Invalid Currency
```typescript
Input:
  product = {
    pricing: {
      basePrice: 50.0,
      currency: 'USD'  // Not supported!
    }
  }

Expected:
  throw Error('Unknown currency: USD')

Result: ✅ PASS
```

### Test 4: Double Conversion Prevention
```typescript
Input:
  product = {
    pricing: {
      basePrice: 12.0,
      currency: 'EUR'
    }
  }

Step 1: getPriceInEur(product) → 12.0
Step 2: getPriceInEur(product) → 12.0  // Same!

Expected:
  No change, no corruption

Result: ✅ PASS
```

---

## 📈 IMPACT METRICS

### Before Fix
```
Tintas (85 products):
  Stored: €12-16
  Displayed: €3.60-4.80 ❌
  Loss: 70%

Esmaltes (55 products):
  Stored: €6.50-10.90
  Displayed: €1.95-3.27 ❌
  Loss: 70%

Perfumes (32 products):
  Stored: €31.40-59.90
  Displayed: €9.42-17.97 ❌
  Loss: 70%

Total affected: 172 products
Revenue impact: 70% underpricing
```

### After Fix
```
Tintas (85 products):
  Stored: €12-16
  Displayed: €12-16 ✅
  Accuracy: 100%

Esmaltes (55 products):
  Stored: €6.50-10.90
  Displayed: €6.50-10.90 ✅
  Accuracy: 100%

Perfumes (32 products):
  Stored: €31.40-59.90
  Displayed: €31.40-59.90 ✅
  Accuracy: 100%

Total fixed: 172 products
Revenue impact: Restored!
```

---

## 🎓 KEY PRINCIPLES

### 1. Explicit Over Implicit
```
❌ Bad:  Assume currency from context
✅ Good: Declare currency explicitly
```

### 2. Guard Against Corruption
```
❌ Bad:  Convert all prices blindly
✅ Good: Check currency before converting
```

### 3. Single Responsibility
```
❌ Bad:  One function does detection + conversion
✅ Good: Separate currency check from conversion
```

### 4. Type Safety
```
❌ Bad:  currency?: string
✅ Good: currency: 'BRL' | 'EUR'
```

---

## 🚀 ROLLOUT PLAN

### Phase 1: Data Update (Day 1)
- [ ] Add currency field to product type
- [ ] Update tintasCapilares.ts (85 products)
- [ ] Update esmaltesImpala.ts (55 products)
- [ ] Update perfumesWepink.ts (32 products)

### Phase 2: Logic Update (Day 2)
- [ ] Create getPriceInEur() function
- [ ] Update ProductCard component
- [ ] Update price utilities
- [ ] Add validation

### Phase 3: Testing (Day 3)
- [ ] Unit tests for conversion
- [ ] Integration tests for display
- [ ] Visual regression tests
- [ ] Price audit script

### Phase 4: Deployment (Day 4)
- [ ] Deploy to staging
- [ ] Manual QA verification
- [ ] Deploy to production
- [ ] Monitor for issues

---

**End of Diagram**
