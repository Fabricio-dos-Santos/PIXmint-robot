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

-### Desenvolvimento (dicas)

- O script `npm run dev` usa `nodemon`/`ts-node` para reiniciar automaticamente quando arquivos em `src/` ou `openapi.json` mudarem.
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
````markdown
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
```powershell
git clone https://github.com/Fabricio-dos-Santos/PIXmint-robot.git
cd PIXmint-robot
```

2. Instale as dependências (raiz e frontend):
```powershell
npm install
cd frontend; npm install
```

3. Configure as variáveis de ambiente:
```powershell
copy .env.example .env
# Edite o arquivo .env com suas configurações
```

## 💻 Execução Local

Executar apenas o backend (dev):
```powershell
npm run dev
```

Executar apenas o frontend (dev):
```powershell
cd frontend
npm run dev
```

Executar backend + frontend (duas opções):

# PIXmint-robot

dApp onde você paga seus funcionários fazendo um PIX, e o funcionário recebe na StableCoin de sua preferência.

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

```powershell
git clone https://github.com/Fabricio-dos-Santos/PIXmint-robot.git
cd PIXmint-robot
```

2. Instale as dependências (raiz e frontend):

```powershell
npm install
cd frontend; npm install
```

3. Configure as variáveis de ambiente:

```powershell
copy .env.example .env
# Edite o arquivo .env com suas configurações
```

## 💻 Execução Local

Executar apenas o backend (dev):

```powershell
npm run dev
```

Executar apenas o frontend (dev):

```powershell
cd frontend
npm run dev
```

Executar backend + frontend (duas opções):

- Abrir o backend e o frontend em janelas PowerShell separadas:

```powershell
npm run dev:all
```

- Rodar ambos como jobs em background e ver os logs no mesmo terminal (PowerShell):

```powershell
npm run dev:all:bg
```

Após iniciar, as URLs padrão são:

- Frontend: http://localhost:5173
- Backend API / Swagger: http://localhost:3000 (docs em /docs)

### Logs e jobs (PowerShell)

Os logs são escritos em `logs/backend.log` e `logs/frontend.log` quando você usa `dev:all:bg`.

Ver os últimos 200 linhas:

```powershell
Get-Content logs\\backend.log -Tail 200
Get-Content logs\\frontend.log -Tail 200
```

Fazer tail (stream) combinado:

```powershell
Get-Content logs\\backend.log,logs\\frontend.log -Wait -Tail 10
```

Listar jobs do PowerShell:

```powershell
Get-Job
```

Parar os jobs:

```powershell
Get-Job -Name pixmint-backend,pixmint-frontend | Stop-Job
Get-Job -Name pixmint-backend,pixmint-frontend | Remove-Job
```

## 🐳 Usando Docker

1. Construa a imagem:

```powershell
docker build -t pixmint-robot .
```

2. Execute o container:

```powershell
docker run -p 3000:3000 --env-file .env pixmint-robot
```

## 📚 API Documentation

### Endpoints (exemplo)

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

Backend tests (Jest):

```powershell
npm test
```

Frontend tests (Vitest):

```powershell
cd frontend
npm test
```

Nota sobre Vitest no Windows

- Se você observar mensagens do tipo "Timeout starting forks runner" em ambientes Windows, há duas opções razoáveis:
  1. Usar execução em processo único — há um arquivo `frontend/vitest.config.ts` (local) que define `threads: false`, `isolate: false` e desabilita o pool de forks para reduzir flakiness no Windows.
  2. Executar os testes no CI (por exemplo, GitHub Actions) com Node 18 — ambientes limpos do CI normalmente não reproduzem esse problema.

Como reverter uma instalação automática indesejada (ex.: quando `npx vitest` sugeriu instalar `jsdom` e o npm alterou `node_modules`/`package-lock.json` no diretório raiz):

1. Do diretório raiz do repositório, remova o diretório `node_modules` e o arquivo `package-lock.json` que foram criados/alterados:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

2. Reinstale apenas as dependências listadas em `package.json` (isso recriará `node_modules` e `package-lock.json` coerentes com `package.json`):

```powershell
npm install
```

3. Se você também quer garantir que o `frontend/` esteja consistente, faça o mesmo dentro de `frontend` (opcional):

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Isso remove quaisquer pacotes instalados fora das dependências listadas nos respectivos `package.json` e restaura um estado limpo.

Observação sobre Node.js

- Recomendamos usar Node 18.x para rodar os testes localmente (especialmente Vitest no Windows). Há um arquivo `.nvmrc` em `frontend/` e os `engines` no `package.json` foram atualizados para indicar `>=18 <19`.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Implementation status

Mantemos um status de implementação em `docs/IMPLEMENTATION_STATUS.md` que lista funcionalidades implementadas e trabalho restante.
