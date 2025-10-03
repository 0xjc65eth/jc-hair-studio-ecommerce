# Guia Visual de Regex Patterns - Validações de Formulário

## Índice
1. [Nome Completo](#nome-completo)
2. [Email RFC 5322](#email-rfc-5322)
3. [Telefone Internacional](#telefone-internacional)
4. [CPF com Dígitos Verificadores](#cpf-com-dígitos-verificadores)
5. [NIF com Módulo 11](#nif-com-módulo-11)
6. [Códigos Postais Internacionais](#códigos-postais-internacionais)
7. [Endereço Completo](#endereço-completo)
8. [Cidade/Localidade](#cidadelocalidade)

---

## 1. Nome Completo

### Regex Pattern
```regex
^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$
```

### Explicação Visual
```
^                      Início da string
[A-Za-zÀ-ÿ]+          Uma ou mais letras (incluindo acentos)
(                      Grupo de captura
  \s+                  Um ou mais espaços
  [A-Za-zÀ-ÿ]+        Uma ou mais letras
)+                     Repetir grupo 1+ vezes
$                      Fim da string
```

### Decompondo o Pattern
```
^ [A-Za-zÀ-ÿ]+ ( \s+ [A-Za-zÀ-ÿ]+ )+ $
│      │        │  │       │        │ │
│      │        │  │       │        │ └─ Fim obrigatório
│      │        │  │       │        └─── Repetir 1+ vezes
│      │        │  │       └──────────── Sobrenome (letras)
│      │        │  └──────────────────── Espaços
│      │        └─────────────────────── Grupo (sobrenomes)
│      └──────────────────────────────── Nome (letras)
└─────────────────────────────────────── Início obrigatório
```

### Exemplos com Visualização
```
✓ "João Silva"
   ^^^^ ^^^^^
   Nome Sobr.

✓ "Maria José Santos"
   ^^^^^ ^^^^ ^^^^^^
   Nome  Meio Final

✗ "João"
   ^^^^
   Falta sobrenome!

✗ "João123"
   ^^^^###
   Números não permitidos!
```

### Caracteres Aceitos (À-ÿ)
```
Acentos Portugueses: á, é, í, ó, ú, â, ê, ô, à, ã, õ, ç
Acentos Brasileiros: á, é, í, ó, ú, â, ê, ô, à, ã, õ, ç
Outros: ñ, ü, ä, ö, etc.
```

---

## 2. Email RFC 5322

### Regex Pattern
```regex
^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$
```

### Versão Simplificada para Entender
```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

### Explicação Visual (Versão Simplificada)
```
^                      Início
[a-zA-Z0-9._%+-]+     Local part (antes do @)
@                      Arroba obrigatório
[a-zA-Z0-9.-]+        Domínio
\.                     Ponto literal
[a-zA-Z]{2,}          TLD (mínimo 2 letras)
$                      Fim
```

### Decompondo um Email
```
usuario.teste+tag@empresa.com.br
│         │   │   │       │   │
│         │   │   │       │   └─ TLD (.br)
│         │   │   │       └───── Domínio secundário (.com)
│         │   │   └─────────────── Domínio principal (empresa)
│         │   └─────────────────── Separador obrigatório (@)
│         └───────────────────────── Tag opcional (+tag)
└─────────────────────────────────── Local part (usuario.teste)
```

### Exemplos com Visualização
```
✓ "usuario@exemplo.com"
   ███████ ███████ ███
   Local    Domín  TLD

✓ "maria.silva@empresa.pt"
   ██████████ ███████ ██
   Local      Domín  TLD

✗ "usuario@"
   ███████ ←─── Falta domínio!

✗ "usuario@exemplo"
   ███████ ███████ ←─── Falta TLD!
```

---

## 3. Telefone Internacional

### Portugal
```regex
^(\+351|351)?9[1236]\d{7}$
```

### Explicação Visual
```
^                      Início
(\+351|351)?          Código país opcional
9                      Primeiro dígito (9)
[1236]                 Segundo dígito (1, 2, 3 ou 6)
\d{7}                  7 dígitos restantes
$                      Fim
```

### Visualização
```
+351 912 345 678
│    │   │   │
│    │   │   └─── 3 dígitos finais
│    │   └─────── 3 dígitos do meio
│    └─────────── 91/92/93/96
└──────────────── Código país (opcional)
```

### Brasil
```regex
^(\+55|55)?\d{10,11}$
```

### Visualização
```
+55 (11) 98765-4321
│   │    │     │
│   │    │     └───── 4 dígitos finais
│   │    └─────────── 5 dígitos (9 + 4 dígitos)
│   └──────────────── DDD (2 dígitos)
└──────────────────── Código país (opcional)
```

### Internacional
```regex
^(\+?\d{1,3})?\d{7,15}$
```

---

## 4. CPF com Dígitos Verificadores

### Regex Format
```regex
^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$
```

### Explicação Visual
```
^                      Início
\d{3}                  3 dígitos
\.?                    Ponto opcional
\d{3}                  3 dígitos
\.?                    Ponto opcional
\d{3}                  3 dígitos
-?                     Hífen opcional
\d{2}                  2 dígitos verificadores
$                      Fim
```

### Estrutura do CPF
```
123.456.789-09
│   │   │   ││
│   │   │   │└─── 2º dígito verificador
│   │   │   └──── 1º dígito verificador
│   │   └──────── 3 dígitos (bloco 3)
│   └──────────── 3 dígitos (bloco 2)
└──────────────── 3 dígitos (bloco 1)
```

### Algoritmo de Validação (Passo a Passo)

#### Exemplo: Validar 123.456.789-09

**PASSO 1: Calcular 1º dígito verificador**
```
Posição:  1   2   3   4   5   6   7   8   9
Dígito:   1   2   3   4   5   6   7   8   9
Peso:     10  9   8   7   6   5   4   3   2
Mult:     10  18  24  28  30  30  28  24  18

Soma = 10+18+24+28+30+30+28+24+18 = 210
Resto = 210 % 11 = 1
Dígito = 11 - 1 = 10 → 0 (se >= 10, usar 0)
```

**PASSO 2: Calcular 2º dígito verificador**
```
Posição:  1   2   3   4   5   6   7   8   9   0
Dígito:   1   2   3   4   5   6   7   8   9   0
Peso:     11  10  9   8   7   6   5   4   3   2
Mult:     11  20  27  32  35  36  35  32  27  0

Soma = 11+20+27+32+35+36+35+32+27+0 = 255
Resto = 255 % 11 = 2
Dígito = 11 - 2 = 9
```

**RESULTADO:** 123.456.789-**09** ✓ Válido!

### Visualização do Cálculo
```
CPF: 1 2 3 4 5 6 7 8 9 - ? ?
     │ │ │ │ │ │ │ │ │   │ │
     ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓   │ │
    ×10×9×8×7×6×5×4×3×2   │ │
     │                     │ │
     └─────── Soma ────────┘ │
                  ↓           │
            Resto % 11        │
                  ↓           │
            11 - Resto        │
                  ↓           │
             1º Dígito ───────┘
                              │
            (Repetir com 2º)  │
                              ↓
                         2º Dígito
```

---

## 5. NIF com Módulo 11

### Regex Format
```regex
^[1-9]\d{8}$
```

### Explicação Visual
```
^                      Início
[1-9]                  1º dígito (1-9, não pode ser 0)
\d{8}                  8 dígitos restantes
$                      Fim
```

### Estrutura do NIF
```
123456789
││││││││└─── Dígito de controlo
│││││││└──── 7º dígito
││││││└───── 6º dígito
│││││└────── 5º dígito
││││└─────── 4º dígito
│││└──────── 3º dígito
││└───────── 2º dígito
│└────────── 1º dígito
└─────────── 1º dígito (1-9)
```

### Algoritmo de Validação (Passo a Passo)

#### Exemplo: Validar 123456789

**Cálculo do dígito de controlo:**
```
Posição:  1   2   3   4   5   6   7   8   |  9
Dígito:   1   2   3   4   5   6   7   8   |  ?
Peso:     9   8   7   6   5   4   3   2   |
Mult:     9  16  21  24  25  24  21  16   |

Soma = 9+16+21+24+25+24+21+16 = 156
Resto = 156 % 11 = 2
Dígito = 11 - 2 = 9 (se resto < 2, dígito = 0)
```

**RESULTADO:** 12345678**9** ✓ Válido!

### Visualização do Cálculo
```
NIF: 1 2 3 4 5 6 7 8 - ?
     │ │ │ │ │ │ │ │   │
     ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓   │
    ×9×8×7×6×5×4×3×2   │
     │                 │
     └─── Soma ────────┘
              ↓
        Resto % 11
              ↓
      11 - Resto (ou 0 se resto < 2)
              ↓
        Dígito de controlo
```

---

## 6. Códigos Postais Internacionais

### Portugal: XXXX-XXX
```regex
^\d{4}-\d{3}$
```
```
1000-001
││││ │││
││││ │││
││││ └┴┴─── 3 dígitos (localidade)
└┴┴┴─────── 4 dígitos (zona)
```

### Brasil: XXXXX-XXX
```regex
^\d{5}-\d{3}$
```
```
01310-100
│││││ │││
│││││ │││
│││││ └┴┴─── 3 dígitos (setor)
└┴┴┴┴─────── 5 dígitos (região)
```

### EUA: XXXXX ou XXXXX-XXXX
```regex
^\d{5}(-\d{4})?$
```
```
90210         ou    90210-1234
│││││               │││││ ││││
│││││               │││││ │││└─ Extension
│││││               │││││ └┴┴── (Plus 4)
└┴┴┴┴───────────────└┴┴┴┴────── ZIP Code
```

### Reino Unido: AAX XXA
```regex
^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$
```
```
SW1A 1AA
││││ │││
││││ │││
││││ └┴┴─── 2 letras (setor)
││││  └──── 1 número (distrito)
│││└──────── Espaço opcional
││└───────── 1-2 números (área)
└┴────────── 1-2 letras (zona)
```

---

## 7. Endereço Completo

### Regex Pattern
```regex
^[A-Za-zÀ-ÿ0-9\s.,º°ª\-]+$
```

### Explicação Visual
```
^                             Início
[                            Conjunto de caracteres permitidos
  A-Z                          Letras maiúsculas
  a-z                          Letras minúsculas
  À-ÿ                          Acentos
  0-9                          Números
  \s                           Espaços
  .,                           Pontuação
  º°ª                          Ordinais
  \-                           Hífen
]+                            Um ou mais caracteres
$                             Fim
```

### Exemplos com Visualização
```
✓ "Rua das Flores, 123"
   ███ ███ ██████  ███
   Tipo  Nome     Nº

✓ "Av. Paulista, 1000 - Apto 45"
   ███ █████████ ████   ████ ██
   Tipo   Nome    Nº    Comp.

✓ "Travessa do Comércio, nº 5, 2º Esq."
   ████████ ██ ████████  ██ ██ ██ ████
   Tipo        Nome      Nº    Comp.

✗ "Rua @# 123"
   ███ ██ ███
       └──── Símbolos inválidos!
```

---

## 8. Cidade/Localidade

### Regex Pattern
```regex
^[A-Za-zÀ-ÿ\s\-]+$
```

### Explicação Visual
```
^                      Início
[                     Conjunto de caracteres permitidos
  A-Z                   Letras maiúsculas
  a-z                   Letras minúsculas
  À-ÿ                   Acentos
  \s                    Espaços
  \-                    Hífen
]+                    Um ou mais caracteres
$                      Fim
```

### Exemplos com Visualização
```
✓ "Lisboa"
   ██████
   Cidade simples

✓ "São Paulo"
   ███ █████
   Com acento e espaço

✓ "Trás-os-Montes"
   ████ ██ ██████
   Com hífens

✗ "Lisboa123"
   █████████
         └──── Números não permitidos!

✗ "L"
   █
   └──── Muito curto!
```

---

## Resumo Visual de Todos os Patterns

```
┌──────────────────┬─────────────────────────────────────────────────────┐
│ CAMPO            │ PATTERN VISUAL                                      │
├──────────────────┼─────────────────────────────────────────────────────┤
│ Nome             │ [Letras]+ ([Espaços]+ [Letras]+)+                  │
│ Email            │ [Local]+ @ [Domínio]+ . [TLD]{2,}                  │
│ Telefone PT      │ (+351)? 9[1236] [7 dígitos]                        │
│ Telefone BR      │ (+55)? [DDD] 9[4 dígitos]-[4 dígitos]              │
│ CPF              │ [3dígitos].[3dígitos].[3dígitos]-[2verificadores]  │
│ NIF              │ [1-9][8 dígitos]                                    │
│ CEP PT           │ [4 dígitos]-[3 dígitos]                            │
│ CEP BR           │ [5 dígitos]-[3 dígitos]                            │
│ Endereço         │ [Letras, Números, Pontuação, Ordinais]+            │
│ Cidade           │ [Letras, Acentos, Espaços, Hífens]+                │
└──────────────────┴─────────────────────────────────────────────────────┘
```

---

## Ferramentas Online para Testar Regex

1. **Regex101** - https://regex101.com/
   - Explicação visual detalhada
   - Testes em tempo real
   - Biblioteca de exemplos

2. **RegExr** - https://regexr.com/
   - Interface amigável
   - Cheat sheet integrado
   - Comunidade ativa

3. **RegexPal** - https://www.regexpal.com/
   - Simples e rápido
   - Sem cadastro necessário

---

**Desenvolvido por JC Hair Studio Development Team**
**Última atualização: 2025-01-XX**
