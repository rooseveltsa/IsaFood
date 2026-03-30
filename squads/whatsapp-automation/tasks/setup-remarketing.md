# Task: Configurar Remarketing Automatico

## Objetivo
Reativar clientes inativos automaticamente com mensagens personalizadas baseadas em tempo de inatividade.

## Fluxos de Remarketing

### Fluxo 1: Inativo 7 dias
- **Trigger:** Cliente nao faz pedido ha 7 dias
- **Mensagem:** Template "remarketing_7d" — tom leve, pergunta se quer ver novidades
- **Meta:** Reengajar com cardapio novo

### Fluxo 2: Inativo 15 dias
- **Trigger:** Cliente nao faz pedido ha 15 dias
- **Mensagem:** Template "remarketing_15d" — oferta de 10% desconto
- **Meta:** Converter com incentivo financeiro

### Fluxo 3: Inativo 30 dias
- **Trigger:** Cliente nao faz pedido ha 30 dias
- **Mensagem:** Template "remarketing_30d" — prova social + opt-out
- **Meta:** Ultima tentativa antes de classificar como churned

### Fluxo 4: Pos-entrega (NPS)
- **Trigger:** 2 horas apos status mudar para "entregue"
- **Mensagem:** Template "pos_entrega_nps" — avaliacao 1-5
- **Meta:** Coletar feedback + manter engajamento

### Fluxo 5: Carrinho abandonado
- **Trigger:** Lead preencheu formulario no site mas nao finalizou no WhatsApp
- **Mensagem:** "Oi {nome}! Vi que voce se interessou pelos nossos kits. Posso ajudar?"
- **Meta:** Converter lead quente

## Implementacao

### Via Supabase (consulta de inatividade)
```sql
-- Clientes inativos ha 7 dias
SELECT c.name, c.phone
FROM customers c
WHERE c.is_active = true
  AND c.last_order_at < NOW() - INTERVAL '7 days'
  AND c.last_order_at > NOW() - INTERVAL '8 days';
```

### Via Cron (webhook server)
O servidor webhook roda um cron diario as 10h:
1. Consulta clientes por faixa de inatividade
2. Aplica template correspondente
3. Envia via Evolution API com rate limiting
4. Registra envio em whatsapp_messages

## Regras
- Maximo 1 mensagem de remarketing por semana por cliente
- Se cliente responder "SAIR" — marcar is_active=false
- Se cliente nao responder 3 remarketings consecutivos — parar
- Nunca enviar remarketing pra quem ja tem pedido ativo
