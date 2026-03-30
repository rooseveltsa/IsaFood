# Task: Conectar Instancia Evolution API

## Pre-requisitos
- Docker rodando com Evolution API (`docker ps | grep isafood-evolution`)
- API respondendo em http://localhost:8085

## Execucao

### Passo 1: Verificar se API esta rodando
```bash
curl -s http://localhost:8085/ | python3 -c "import sys,json; d=json.load(sys.stdin); print('✅ API v' + d['version'] + ' rodando')" 2>&1 || echo "❌ API nao responde. Rodar: cd infra && docker compose -f docker-compose.local.yml up -d"
```

### Passo 2: Listar instancias existentes
```bash
curl -s http://localhost:8085/instance/fetchInstances -H "apikey: isafood-evo-2026" | python3 -c "
import sys,json
data=json.load(sys.stdin)
if not data: print('Nenhuma instancia. Criar uma nova.')
for i in data: print(f'{i[\"name\"]} — {i[\"connectionStatus\"]}')
"
```

### Passo 3: Criar instancia nova (se nao existir)
```bash
curl -s -X POST http://localhost:8085/instance/create \
  -H "apikey: isafood-evo-2026" \
  -H "Content-Type: application/json" \
  -d '{"instanceName":"isafitness","qrcode":true}'
```

### Passo 4: Obter QR Code
O QR Code vem no campo `qrcode.base64` da resposta do create.
Salvar como PNG e abrir:
```bash
# O python extrai o base64 e salva como imagem
echo "$RESPONSE" | python3 -c "
import sys,json,base64
data=json.load(sys.stdin)
b64=data.get('qrcode',{}).get('base64','')
if b64:
    clean=b64.replace('data:image/png;base64,','')
    with open('/tmp/isafood-qr.png','wb') as f: f.write(base64.b64decode(clean))
    print('QR salvo em /tmp/isafood-qr.png')
"
open /tmp/isafood-qr.png
```

### Passo 5: Verificar conexao
```bash
curl -s http://localhost:8085/instance/connectionState/isafitness \
  -H "apikey: isafood-evo-2026"
# Deve retornar: {"instance":{"state":"open"}}
```

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| QR nao gera (count:0) | Versao v2.x tem bug. Usar v1.8.0 |
| QR expira rapido | Escanear em menos de 20s. Regerar se expirar |
| "Nao foi possivel conectar" | Remover dispositivos antigos no WhatsApp > Configuracoes > Dispositivos |
| Loop de reconnect | Deletar instancia e recriar do zero |
| Porta ocupada | Mudar porta no docker-compose (8085, 8086, etc) |
| Container nao sobe | Verificar Docker Desktop rodando. `docker logs isafood-evolution` |
