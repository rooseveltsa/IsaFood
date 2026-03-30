# Isa Fitness — Design System v1.0

> Guia visual para Instagram, materiais de venda, embalagens e comunicacao.

---

## 1. MARCA

| Item | Valor |
|------|-------|
| **Nome** | Isa Fitness |
| **Dominio** | isafood.com |
| **Tagline** | "120g de proteina. Zero desculpa." |
| **Tagline secundaria** | "Alimentacao saudavel em Brasilia" |
| **Tom de voz** | Direto, confiante, motivacional. Sem ser clinico. |

### Logotipo
- **Simbolo:** "iF" em bold dentro de quadrado com cantos arredondados (rounded-xl)
- **Gradiente do simbolo:** Emerald-500 → Emerald-700
- **Texto:** "Isa Fitness" em fonte Sora Bold
- **Subtitulo:** "ALIMENTACAO SAUDAVEL" em tracking-widest, emerald-600

---

## 2. PALETA DE CORES

### Cores Primarias (usar em 80% da comunicacao)

| Nome | Hex | Uso |
|------|-----|-----|
| **Emerald-700** | `#166534` | Cor principal da marca, CTAs, textos destaque |
| **Emerald-600** | `#16a34a` | Gradientes, icones, badges |
| **Emerald-50** | `#f0fdf4` | Backgrounds claros, cards |
| **Emerald-950** | `#052e16` | Backgrounds escuros (secao de depoimentos) |

### Cores de Acento (usar em 15%)

| Nome | Hex | Uso |
|------|-----|-----|
| **Amber-500** | `#f59e0b` | Promocoes, destaques, badges "Popular" |
| **Orange-500** | `#f97316` | CTAs secundarios, gradiente com amber |
| **Red-500** | `#ef4444` | Badge "Promocao", urgencia |

### Cores Neutras (usar em 5%)

| Nome | Hex | Uso |
|------|-----|-----|
| **Gray-900** | `#111827` | Textos principais |
| **Gray-500** | `#6b7280` | Textos secundarios, descricoes |
| **Gray-100** | `#f3f4f6` | Backgrounds, dividers |
| **White** | `#ffffff` | Cards, backgrounds |

### Gradientes Oficiais

```
Primario:     from-emerald-600 to-emerald-700 (CTAs)
Secundario:   from-amber-500 to-orange-500 (acentos)
Promocao:     from-amber-500 to-red-500 (urgencia)
Fundo escuro: from-emerald-900 via-emerald-800 to-emerald-900
```

---

## 3. TIPOGRAFIA

### Fontes

| Fonte | Peso | Uso |
|-------|------|-----|
| **Sora** | 700-800 (Bold/ExtraBold) | Titulos, headings, precos, numeros destaque |
| **Plus Jakarta Sans** | 400-600 (Regular/Semibold) | Corpo de texto, descricoes, UI |

### Hierarquia no Instagram

| Nivel | Tamanho | Fonte | Exemplo |
|-------|---------|-------|---------|
| **H1** (titulo do post) | 48-64px | Sora ExtraBold | "120g de proteina" |
| **H2** (subtitulo) | 32-40px | Sora Bold | "Kit 40 por R$449" |
| **Body** (texto) | 18-24px | Plus Jakarta Medium | Descricoes |
| **Caption** (detalhes) | 14-16px | Plus Jakarta Regular | Ingredientes, info nutricional |
| **Badge** (tags) | 11-12px | Plus Jakarta Bold, uppercase | "LOW CARB", "PROMOCAO" |

---

## 4. ELEMENTOS VISUAIS

### Cantos Arredondados
- **Cards:** rounded-2xl (16px) ou rounded-3xl (24px)
- **Botoes:** rounded-xl (12px)
- **Badges:** rounded-full (pill) ou rounded-lg (8px)
- **Imagens:** rounded-2xl (16px)

### Sombras
- **Cards:** `shadow-lg shadow-emerald-900/5` (sutil, elegante)
- **CTAs:** `shadow-lg shadow-emerald-600/25` (cor no shadow)
- **Cards hover:** `shadow-xl shadow-emerald-900/10`
- **Promo badges:** `shadow-lg` com animacao pulse

### Espacamento
- **Entre secoes:** 56-80px (py-14 md:py-20)
- **Entre elementos:** 16-32px
- **Padding interno de cards:** 24-32px
- **Padding de badges:** 8-16px horizontal, 4-8px vertical

### Icones
- **Biblioteca:** Lucide React (outline style)
- **Tamanho padrao:** 20px (h-5 w-5)
- **Icones em containers:** 44px quadrado com rounded-xl e gradiente
- **Estilo:** dentro de containers com fundo gradiente

---

## 5. COMPONENTES PARA INSTAGRAM

### Post Feed (1080x1080)

**Layout tipo 1: Produto destaque**
```
┌─────────────────────────┐
│  [Emerald-950 bg]       │
│                         │
│  ISA FITNESS            │
│  ──────────             │
│                         │
│  "120g DE PROTEINA      │
│   EM CADA REFEICAO"     │
│                         │
│  [Foto marmita]         │
│  rounded-2xl            │
│                         │
│  300-340g | 100% Natural│
│                         │
│  [Badge] PECA AGORA     │
│  @isafitnessfood        │
└─────────────────────────┘
```

**Layout tipo 2: Preco/Promocao**
```
┌─────────────────────────┐
│  [White bg]             │
│                         │
│  PROMOCAO 🔥            │
│  ──────────             │
│                         │
│  KIT 40                 │
│  [strike] R$680         │
│  R$ 449                 │
│  (R$ 11,22/un)          │
│                         │
│  [Grid 2x2 fotos]      │
│                         │
│  ENTREGA GRATIS BSB     │
│  (61) 99692-5018        │
└─────────────────────────┘
```

**Layout tipo 3: Nutricional**
```
┌─────────────────────────┐
│  [Gradiente emerald]    │
│                         │
│  POR QUE 120g           │
│  DE PROTEINA?           │
│  ──────────             │
│                         │
│  ✓ Saciedade prolongada │
│  ✓ Recuperacao muscular │
│  ✓ Metabolismo ativo    │
│  ✓ Menos compulsao      │
│                         │
│  [Foto + badge macros]  │
│                         │
│  ISA FITNESS            │
└─────────────────────────┘
```

### Stories (1080x1920)

**Template 1: CTA direto**
```
┌───────────────┐
│ [Emerald bg]  │
│               │
│ LOGO          │
│               │
│ [Foto grande] │
│ rounded-3xl   │
│               │
│ PEDIDO ABERTO │
│ HOJE!         │
│               │
│ [Swipe up]    │
│ ou WhatsApp   │
└───────────────┘
```

**Template 2: Depoimento**
```
┌───────────────┐
│ [Dark bg]     │
│               │
│ ⭐⭐⭐⭐⭐     │
│               │
│ "Texto do     │
│  depoimento"  │
│               │
│ — Nome        │
│   Regiao BSB  │
│               │
│ [CTA verde]   │
└───────────────┘
```

### Carrossel (1080x1080, 5-10 slides)

**Slide 1:** Hook forte ("Voce sabe quanto de proteina tem no seu almoco?")
**Slide 2:** Problema ("A maioria das marmitas tem menos de 40g")
**Slide 3:** Solucao ("Na Isa Fitness: 120g por refeicao")
**Slide 4:** Prova (fotos + macros)
**Slide 5:** Oferta (Kit 40 por R$449)
**Slide 6:** CTA (WhatsApp + @isafitnessfood)

---

## 6. COPY BANK (frases prontas)

### Headlines
- "120g de proteina. Zero desculpa."
- "Seu treino merece mais que arroz com frango."
- "Macro perfeito. Sabor de verdade."
- "300g de resultado em cada marmita."
- "Comida de atleta, sabor de chef."

### CTAs
- "Peca agora pelo WhatsApp"
- "Monte seu kit personalizado"
- "Comece sua transformacao hoje"
- "Garanta seu kit antes que esgote"

### Gatilhos Nutricionais
- "120g de proteina = saciedade por 5-6 horas"
- "0% conservantes artificiais"
- "Ingredientes frescos comprados no dia"
- "Cada macro calculado para sua performance"
- "Nao e so comida fit. E nutricao de verdade."

### Gatilhos de Escassez/Urgencia
- "Kits limitados por semana"
- "Pedidos ate 14h = entrega no mesmo dia"
- "Kit 40 com 34% de desconto — promocao por tempo limitado"

### Gatilhos de Prova Social
- "+500 clientes em Brasilia"
- "Avaliacao 4.9 estrelas"
- "A mais pedida de Aguas Claras"
- "Recomendada por nutricionistas"

---

## 7. FOTOGRAFIA

### Estilo
- **Fundo:** clean, branco ou madeira clara
- **Iluminacao:** natural, lateral
- **Angulo:** 45 graus (hero shot) ou top-down (flat lay)
- **Props:** talheres de madeira, guardanapo verde, ervas frescas

### Composicao
- Marmita aberta mostrando ingredientes
- Close nos ingredientes (textura da proteina)
- Grid de marmitas (variedade)
- Marmita + ambiente (mesa, treino ao fundo)

### Evitar
- Fotos escuras ou com flash direto
- Filtros pesados que alteram cor da comida
- Embalagem fechada sem mostrar conteudo
- Backgrounds poluidos

---

## 8. APLICACAO EM MATERIAIS

### Embalagem
- **Adesivo:** Logo iF + nome "Isa Fitness" em fundo emerald-700
- **Etiqueta nutricional:** fundo branco, texto gray-900, destaque proteina em emerald-600
- **Faixa de selo:** "120g PROTEINA" em amber-500

### Cartao de visita
- Frente: Logo + nome + tagline em fundo branco
- Verso: QR code do WhatsApp + @isafitnessfood + telefone em fundo emerald-950

### Banner para iFood/99Food
- 1200x300px, gradiente emerald, foto de marmita lado direito
- Texto: "Isa Fitness | 120g de Proteina | Entrega Gratis"

---

*Design System v1.0 — Isa Fitness by IsaFood*
*Atualizado: Marco 2026*
