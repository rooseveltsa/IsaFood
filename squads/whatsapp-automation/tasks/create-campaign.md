# Task: Criar e Disparar Campanha

## Pre-requisitos
- Instancia conectada (state: open)
- Lista de contatos no Supabase ou CSV
- Template de mensagem definido

## Fluxo

### 1. Definir audiencia
Elicit: Quem vai receber?
- Todos os clientes ativos
- Clientes que nao pedem ha X dias
- Clientes de uma regiao especifica
- Lista personalizada (CSV)

### 2. Definir mensagem
Elicit: Qual template usar? (ver data/message-templates.md)
- Promocao semanal
- Remarketing 7 dias
- Remarketing 15 dias
- Novo cardapio
- Personalizada

### 3. Configurar envio
- Intervalo entre mensagens: 30-60 segundos (anti-ban)
- Horario: entre 9h e 20h (BSB timezone)
- Incluir opt-out: sempre
- Limite por dia: respeitar fase de aquecimento

### 4. Envio via Evolution API
```bash
# Para cada contato na lista:
curl -s -X POST http://localhost:8085/message/sendText/isafitness \
  -H "apikey: isafood-evo-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "{phone}",
    "textMessage": {"text": "{mensagem_personalizada}"}
  }'
# Aguardar 30-60s antes do proximo
```

### 5. Monitorar
- Verificar respostas recebidas via webhook
- Contabilizar: enviados, entregues, lidos, respondidos
- Parar se taxa de bloqueio > 2%

## Rate Limits (seguro)

| Fase do numero | Max/dia | Intervalo |
|---------------|---------|-----------|
| Novo (< 7 dias) | 50 | 60s |
| Aquecendo (7-30 dias) | 200 | 45s |
| Estavel (30+ dias) | 1000 | 30s |
