# PIXmint-robot

dApp onde você paga seus funcionários fazendo um PIX, e o funcionario recebe na StableCoin de sua preferencia.

## 🚀 Funcionalidades

- Geração de QR Code para pagamentos PIX
- Conversão automática para StableCoin
- Interface simples e intuitiva
- Confirmação em tempo real

## 📋 Pré-requisitos

- Node.js >= 16
- npm ou yarn
- Docker (opcional)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Fabricio-dos-Santos/PIXmint-robot.git
cd PIXmint-robot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

## 💻 Execução Local

Para desenvolvimento (com hot-reload):
```bash
npm run dev
```

Para produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

### Desenvolvimento (dicas)

- O script `npm run dev` usa `nodemon` para reiniciar automaticamente quando `employee.js` ou `openapi.json` mudarem.
- Para editar variáveis de ambiente, copie `.env.example` para `.env` e não comite o `.env`.
- A documentação interativa (Swagger) fica disponível enquanto o servidor roda em:
  - http://localhost:3000/docs

Exemplo rápido:
```bash
copy .env.example .env
npm install
npm run dev
# abra http://localhost:3000/docs no navegador
```

## 🐳 Usando Docker

1. Construa a imagem:
```bash
docker build -t pixmint-robot .
```

2. Execute o container:
```bash
docker run -p 3000:3000 --env-file .env pixmint-robot
```

## 📚 API Documentation

### Endpoints

#### POST /pix/generate
Gera um QR Code PIX para pagamento.

**Request:**
```json
{
  "value": "100.00",
  "description": "Pagamento PIX"
}
```

**Response:**
```json
{
  "qrcode": "string",
  "expiration": "timestamp"
}
```

#### GET /pix/status/:id
Verifica o status de um pagamento.

**Response:**
```json
{
  "status": "pending|completed|failed",
  "transaction": {
    "id": "string",
    "value": "100.00",
    "timestamp": "datetime"
  }
}
```

## 🧪 Testes

Para executar os testes:
```bash
npm test
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
