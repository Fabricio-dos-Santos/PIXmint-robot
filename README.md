# PIXmint-robot

dApp onde você paga seus funcionários fazendo um PIX, e o funcionário recebe na StableCoin de sua preferência.

## 🚀 Funcionalidades

### Backend
- ✅ CRUD completo de employees (GET, POST, PUT, DELETE)
- ✅ Validação de pixKey (email, telefone, CPF, wallet, random)
- ✅ Busca global case-insensitive com query param `?search=termo` (busca em name, pixKey, wallet, network)
- ✅ Seed automático do banco de dados com script PowerShell (stop processes + generate + seed)
- ✅ Documentação Swagger/OpenAPI
- ✅ Testes unitários e de integração (Jest) - 19 testes passando

### Frontend
- ✅ Listagem de employees com paginação client-side
- ✅ Busca global integrada com backend (query param `?search=termo`)
- ✅ Botão de limpar filtro (reset search + refetch)
- ✅ **Modal de criação de employees com validação completa:**
  - Validação em tempo real (onBlur) em todos os campos
  - Máscaras de input: CPF (`000.000.000-00`), Telefone (`(00) 00000-0000`), Wallet (`0x` + hex)
  - **Separação de responsabilidades:** Frontend valida UX básica, backend valida regras de negócio
  - **Validação de negócio (backend):** Nome com sobrenome, sem preposições no final, PIX por tipo
  - Detecção automática de tipo de PIX (CPF, telefone, email, random)
  - Mensagens de erro específicas por campo
  - Network obrigatória
- ✅ Componentes reutilizáveis (EmployeeTable, Pagination, PixKey, CopyButton, EmployeeModal)
- ✅ Máscaras inteligentes para pixKey:
  - Email: exibição parcial com domínio preservado
  - CPF: formato `XXX.XX*.***-**`
  - Telefone: formato `(XX) XXXXX-XXXX`
  - Wallet: `0x12345...12345` (primeiros 5 + últimos 5, preservando prefixo `0x`)
  - Random: primeiros 5 + últimos 5 caracteres
- ✅ Botão de copiar para cada pixKey
- ✅ Operação de delete com confirmação
- ✅ Tema escuro
- ✅ Cantos arredondados nas tabelas
- ✅ Testes de hooks e componentes (Vitest + React Testing Library) - **53 testes passando**

### Funcionalidades Planejadas
- ⏳ Integração com PIX para geração de QR Code
- ⏳ Conversão automática para StableCoin
- ⏳ Modal de edição de employees

## 📋 Pré-requisitos

- Node.js >= 18 (recomendado para melhor compatibilidade com Vitest)
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
cd frontend
npm install
cd ..
```

3. Configure as variáveis de ambiente:

```powershell
copy .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Popule o banco de dados (seed):

```powershell
npm run seed
```

## 💻 Execução Local

### Executar apenas o backend (dev):

```powershell
npm run dev
```

### Executar apenas o frontend (dev):

```powershell
cd frontend
npm run dev
```

### Executar backend + frontend simultaneamente:

**Opção 1:** Abrir em janelas PowerShell separadas:

```powershell
npm run dev:all
```

**Opção 2:** Rodar ambos como jobs em background e ver os logs no mesmo terminal (PowerShell):

```powershell
npm run dev:all:bg
```

### URLs padrão:

- **Frontend:** http://localhost:5173
- **Backend API / Swagger:** http://localhost:3000 (documentação em `/docs`)

### Logs e jobs (PowerShell)

Os logs são escritos em `logs/backend.log` e `logs/frontend.log` quando você usa `dev:all:bg`.

Ver os últimos 200 linhas:

```powershell
Get-Content logs\backend.log -Tail 200
Get-Content logs\frontend.log -Tail 200
```

Fazer tail (stream) combinado:

```powershell
Get-Content logs\backend.log,logs\frontend.log -Wait -Tail 10
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

A documentação completa da API está disponível em `/docs` (Swagger UI) quando o servidor está rodando.

### Endpoints Principais

#### Employees

- **GET /employees** - Lista todos os employees
- **GET /employees?search=termo** - Busca employees por termo (case-insensitive em name, pixKey, wallet, network)
- **GET /employees/:id** - Busca um employee por ID
- **POST /employees** - Cria um novo employee
- **PUT /employees/:id** - Atualiza um employee existente
- **DELETE /employees/:id** - Remove um employee

**Exemplo de Request (POST /employees):**

```json
{
  "name": "João Silva",
  "pixKey": "joao@example.com",
  "wallet": "0x1234567890abcdef1234567890abcdef12345678",
  "network": "sepolia"
}
```

## 🧪 Testes

### Backend (Jest)

```powershell
npm test
```

**Status:** ✅ 3 suites, 19 testes passando
- Testes de serviços (`employeeService.test.ts`)
- Testes de modelos (`employee.test.ts`)
- Testes de integração (`employee.integration.test.ts`) - inclui 10 testes de busca global

### Frontend (Vitest)

```powershell
cd frontend
npm test
```

**Status:** ✅ 5 suites, 53 testes passando
- ✅ Testes de hooks (`useEmployees.test.ts`) - inclui testes das operações de create, delete e busca global
- ✅ Testes de componentes (`EmployeeTable.test.tsx`)
- ✅ Testes de utils (`pixKeyUtils.test.ts`)
- ✅ Testes de máscaras de input (`inputMasks.test.ts`) - 24 testes
- ✅ Testes de validação de campos (`fieldValidation.test.ts`) - 15 testes (validação de UX)

### Nota sobre Vitest no Windows

- Se você observar mensagens do tipo "Timeout starting forks runner" em ambientes Windows, há duas opções razoáveis:
  1. Usar execução em processo único — há um arquivo `frontend/vitest.config.ts` (local) que define `threads: false`, `isolate: false` e desabilita o pool de forks para reduzir flakiness no Windows.
  2. Executar os testes no CI (por exemplo, GitHub Actions) com Node 18 — ambientes limpos do CI normalmente não reproduzem esse problema.

### Como reverter uma instalação automática indesejada

Se `npx vitest` ou outro comando instalou pacotes inesperados e alterou `node_modules`/`package-lock.json`:

1. Do diretório raiz do repositório, remova o diretório `node_modules` e o arquivo `package-lock.json`:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

2. Reinstale apenas as dependências listadas em `package.json`:

```powershell
npm install
```

3. Se necessário, faça o mesmo no `frontend`:

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
cd ..
```

### Observação sobre Node.js

- Recomendamos usar **Node 18.x** para rodar os testes localmente (especialmente Vitest no Windows). 
- Há um arquivo `.nvmrc` em `frontend/` e os `engines` no `package.json` foram atualizados para indicar `>=18 <19`.

## 🏗️ Estrutura do Projeto

```
PIXmint-robot/
├── src/                        # Código-fonte do backend
│   ├── controllers/            # Controllers da API
│   ├── services/               # Lógica de negócio
│   ├── models/                 # Modelos do Prisma
│   ├── routes/                 # Definição de rotas
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utilitários (validation)
│   └── employee.ts             # Entry point do backend
├── frontend/                   # Aplicação React
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── EmployeeTable.tsx
│   │   │   ├── EmployeeModal.tsx      # Modal de criação
│   │   │   ├── Pagination.tsx
│   │   │   ├── PixKey.tsx
│   │   │   └── CopyButton.tsx
│   │   ├── pages/              # Páginas da aplicação
│   │   │   └── Employees.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useEmployees.ts
│   │   ├── lib/                # Utilitários e configurações
│   │   │   ├── api.ts
│   │   │   ├── inputMasks.ts           # Máscaras de input
│   │   │   ├── fieldValidation.ts      # Validação de campos
│   │   │   └── pixKeyUtils.ts
│   │   └── styles/             # CSS modules
│   │       ├── table.module.css
│   │       ├── modal.module.css        # Estilos do modal
│   │       └── theme.css
│   ├── vitest.config.ts        # Configuração do Vitest
│   └── package.json
├── prisma/                     # Schema e migrations do Prisma
│   ├── schema.prisma
│   └── seed.ts                 # Seed do banco de dados
├── scripts/                    # Scripts PowerShell
│   ├── run-seed.ps1            # Automação de seed
│   └── start-dev-bg.ps1        # Background jobs
├── tests/                      # Testes do backend
├── logs/                       # Logs de dev (background jobs)
├── .env.example                # Exemplo de variáveis de ambiente
├── package.json                # Dependências do backend
└── README.md                   # Este arquivo
```

## 🎨 Componentes Frontend

### EmployeeModal
Modal completo para criação de employees com:
- Validação em tempo real (onBlur) em todos os campos
- Máscaras de input automáticas (CPF, telefone, wallet)
- Detecção automática de tipo de PIX key
- **Separação de responsabilidades:**
  - Frontend: validação de UX (required, formato básico)
  - Backend: validação de negócio (sobrenome obrigatório, PIX por tipo, etc.)
- Mensagens de erro específicas por campo
- Network obrigatória (seleção entre 6 redes)
- Estados de loading e tratamento de erros do backend
- Acessibilidade (ARIA labels, Escape key, overlay click)

### EmployeeTable
Tabela responsiva para exibição de employees com suporte a:
- Máscaras de pixKey inteligentes
- Botões de ação (editar/excluir)
- Render customizado de células

### Pagination
Componente de paginação client-side com:
- Navegação (primeira, anterior, próxima, última página)
- Resumo de registros exibidos
- Botões desabilitados conforme contexto

### PixKey
Componente para exibição de pixKey com:
- Detecção automática do tipo (email, CPF, telefone, wallet, random)
- Máscaras específicas por tipo
- Label colorido indicando o tipo
- Botão de copiar integrado

### CopyButton
Botão de copiar valor para área de transferência com:
- Feedback visual ao copiar
- Ícone SVG inline
- Acessibilidade (aria-label)

## 🔧 Tecnologias

### Backend
- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para SQLite
- **Swagger** - Documentação de API
- **Jest** - Framework de testes
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React 18** - Biblioteca UI
- **Vite 7** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **TanStack Query v5** (React Query) - Data fetching e cache
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos isolados
- **Vitest v4** - Framework de testes
- **React Testing Library** - Testes de componentes

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some amazing feature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação, ponto e vírgula, etc
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Atualização de dependências, config, etc

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Fabricio dos Santos - [@Fabricio-dos-Santos](https://github.com/Fabricio-dos-Santos)

Link do Projeto: [https://github.com/Fabricio-dos-Santos/PIXmint-robot](https://github.com/Fabricio-dos-Santos/PIXmint-robot)

## 📝 Changelog

### v0.6.0 (2024-11-14)
- ✅ **Menu lateral (Sidebar) com navegação:**
  - Componente `Sidebar.tsx` fixo à esquerda com collapse/expand
  - Menu items: Home e Colaboradores
  - Submenu "New" para criar novo colaborador
  - Destaque visual na rota ativa (borda roxa)
  - Tema escuro consistente
- ✅ **Ordenação alfabética por nome:**
  - Botão de ordenação no header da tabela (coluna Name)
  - 3 estados: null → asc → desc → null
  - Ordenação com `localeCompare('pt-BR')`
  - Ícones SVG para cada estado
- ✅ **Refinamentos de tema escuro:**
  - Body: `#090e1a` (20% mais escuro)
  - Barra de filtro: `#0b1220` (mesma cor do container)
  - Background consistente em toda aplicação
- ✅ **Tradução para português:**
  - "Employees" → "Colaboradores"
  - "New Employee" → "Novo Colaborador"
  - "Edit Employee" → "Editar Colaborador"
- ✅ Integração modal com sidebar (estado gerenciado no App.tsx)
- ✅ Removido header redundante e botão "Novo" da página Employees

### v0.5.0 (2024-11-14)
- ✅ **Separação de validação frontend/backend:**
  - Frontend (`fieldValidation.ts`): validação de UX apenas (required, formato básico)
  - Backend (`validation.ts`): validação de negócio completa (fonte única da verdade)
- ✅ **Backend como autoridade:**
  - Nome: sobrenome obrigatório, sem preposições no final, 3+ letras/palavra
  - PIX Key: validação básica (não vazio) - formato detalhado pode ser adicionado
  - Wallet: formato EVM (0x + 40 hex)
  - Network: lista de redes permitidas
- ✅ Eliminada duplicação de regras de negócio entre camadas
- ✅ Frontend simplificado: 53 testes (redução de ~40% nos testes)
- ✅ Backend fortalecido: 19 testes (validação de negócio robusta)

### v0.4.0 (2024-11-14)
- ✅ **Modal de criação de employees completo:**
  - Componente `EmployeeModal.tsx` com validação em tempo real
  - Máscaras de input automáticas (`inputMasks.ts`): CPF, telefone, wallet
  - Sistema de validação de campos (`fieldValidation.ts`) com mensagens específicas
  - 24 testes de máscaras de input
  - 51 testes de validação de campos (nome, PIX, wallet, network)
- ✅ **Validações robustas:**
  - Nome: mínimo 3 letras/palavra, nome + sobrenome obrigatório, sem preposições no final (dos, das, de, da, do, e)
  - PIX: detecção automática de tipo com validações específicas (CPF 11 dígitos, telefone com DDD válido, email com @ e ponto, random 32+ chars)
  - Wallet: formato EVM (0x + 40 caracteres hexadecimais)
  - Network: obrigatória
- ✅ Integração completa: hook `useEmployees` com `createEmployee`, modal integrado na página
- ✅ Estilos: CSS Module `modal.module.css` com tema escuro consistente
- ✅ Network obrigatória no backend (tipos e validação atualizados)
- ✅ Total de 90 testes frontend passando (24 máscaras + 51 validação + 9 hooks + 4 utils + 1 component)
- ✅ Removida duplicação: `isValidWallet` consolidado em `fieldValidation.ts`

### v0.3.0 (2024-11-14)
- ✅ Implementada busca global case-insensitive com query param `?search=termo`
- ✅ Backend: raw SQL para busca em name, pixKey, wallet, network
- ✅ Frontend: integração de busca com hook `useEmployees`
- ✅ Botão de limpar filtro com ícone X
- ✅ Automatização de `npm run seed` com script PowerShell
- ✅ Script `run-seed.ps1`: para processos Node.js e jobs antes de seed
- ✅ 10 novos testes backend de busca (19 total)
- ✅ 2 novos testes frontend de busca (11 total)
- ✅ Removidos arquivos não utilizados (useDeleteEmployee.ts, check-seed.ts, dump-pixkeys.ts)
- ✅ Documentação atualizada com novas funcionalidades

### v0.2.0 (2024-11-14)
- ✅ Implementado CRUD completo de employees no backend
- ✅ Criado frontend com React + Vite + TypeScript
- ✅ Componentes reutilizáveis (EmployeeTable, Pagination, PixKey, CopyButton)
- ✅ Máscaras inteligentes para pixKey
- ✅ Paginação client-side
- ✅ Campo de filtro (UI)
- ✅ Operação de delete com testes
- ✅ Tema escuro
- ✅ Testes backend (Jest) e frontend (Vitest)
- ✅ Seed automático do banco de dados
- ✅ Documentação completa atualizada

### v0.1.0 (Inicial)
- ✅ Setup inicial do projeto
- ✅ Configuração do backend com Express + TypeScript
- ✅ Configuração do Prisma com SQLite
- ✅ Documentação Swagger
