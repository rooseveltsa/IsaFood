# Evolution API — Referencia Rapida

## Endpoints Principais (v1.8.x)

### Instancia
```
POST /instance/create          — Criar instancia (retorna QR Code se qrcode:true)
GET  /instance/connect/{name}  — Reconectar e pegar QR Code
GET  /instance/connectionState/{name} — Status: open, close, connecting
GET  /instance/fetchInstances  — Listar todas as instancias
DEL  /instance/delete/{name}   — Deletar instancia
POST /instance/logout/{name}   — Desconectar WhatsApp
```

### Mensagens
```
POST /message/sendText/{name}       — Enviar texto
POST /message/sendMedia/{name}      — Enviar imagem/video/audio/documento
POST /message/sendButtons/{name}    — Enviar botoes interativos
POST /message/sendList/{name}       — Enviar lista interativa
POST /message/sendContact/{name}    — Enviar contato
POST /message/sendLocation/{name}   — Enviar localizacao
POST /message/sendReaction/{name}   — Reagir a mensagem
```

### Webhook
```
POST /webhook/set/{name}    — Configurar webhook
GET  /webhook/find/{name}   — Ver configuracao atual
```

### Headers
```
apikey: {AUTHENTICATION_API_KEY}
Content-Type: application/json
```

## Payloads

### Enviar Texto
```json
{
  "number": "5561996925018",
  "textMessage": {
    "text": "Ola! Bem-vindo a Isa Fitness!"
  }
}
```

### Enviar Imagem
```json
{
  "number": "5561996925018",
  "mediaMessage": {
    "mediatype": "image",
    "caption": "Nosso cardapio da semana!",
    "media": "https://isafood.com/lovable-uploads/c7d79ba7.png"
  }
}
```

### Enviar Botoes
```json
{
  "number": "5561996925018",
  "buttonMessage": {
    "title": "Isa Fitness",
    "description": "Escolha uma opcao:",
    "buttons": [
      {"buttonText": {"displayText": "Ver Cardapio"}, "buttonId": "menu"},
      {"buttonText": {"displayText": "Fazer Pedido"}, "buttonId": "order"},
      {"buttonText": {"displayText": "Falar com Isa"}, "buttonId": "human"}
    ]
  }
}
```

### Enviar Lista
```json
{
  "number": "5561996925018",
  "listMessage": {
    "title": "Cardapio Isa Fitness",
    "description": "Escolha a categoria:",
    "buttonText": "Ver opcoes",
    "sections": [
      {
        "title": "Low Carb",
        "rows": [
          {"title": "Pure de Abobora com Frango", "description": "300-340g | 120g proteina", "rowId": "lc1"},
          {"title": "Tilapia com Legumes", "description": "300-340g | 120g proteina", "rowId": "lc2"}
        ]
      },
      {
        "title": "Fit",
        "rows": [
          {"title": "Escondidinho de Carne", "description": "300-340g | 120g proteina", "rowId": "fit1"},
          {"title": "Frango Xadrez", "description": "300-340g | 120g proteina", "rowId": "fit2"}
        ]
      }
    ]
  }
}
```

### Configurar Webhook
```json
{
  "enabled": true,
  "url": "https://webhook.isafood.com/webhook/evolution",
  "webhookByEvents": true,
  "events": [
    "MESSAGES_UPSERT",
    "CONNECTION_UPDATE",
    "MESSAGES_UPDATE"
  ]
}
```

## Webhook Events (Inbound)

### MESSAGES_UPSERT
```json
{
  "event": "messages.upsert",
  "instance": "isafitness",
  "data": {
    "key": {
      "remoteJid": "5561999999999@s.whatsapp.net",
      "fromMe": false,
      "id": "ABC123"
    },
    "pushName": "Nome do Cliente",
    "message": {
      "conversation": "Texto da mensagem"
    },
    "messageTimestamp": 1234567890
  }
}
```

## Limites e Boas Praticas

| Fase | Limite diario | Estrategia |
|------|--------------|-----------|
| Numero novo (dia 1-7) | 50 msgs | So responder, nao iniciar |
| Aquecendo (dia 8-30) | 200 msgs | Iniciar com contatos que responderam |
| Estavel (dia 30+) | 1000 msgs | Campanhas controladas |
| Verificado | 10000 msgs | Escala total |

### Regras anti-ban
- Nunca enviar pra quem nao te conhece
- Intervalo minimo 30s entre mensagens em massa
- Incluir opt-out ("digite SAIR para parar")
- Nao enviar entre 22h-8h
- Variar texto das mensagens (nao copiar/colar identico)
- Maximo 3 mensagens sem resposta = parar de enviar
