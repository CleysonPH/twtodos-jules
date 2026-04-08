# TWTodos API

API de gerenciamento de tarefas (todos) construída com Fastify, TypeScript e Zod.

O projeto segue uma estrutura simples e organizada por domínio, com validação de entrada nos handlers e um repositório em memória para persistência durante a execução.

## Tecnologias

- Node.js
- TypeScript
- Fastify
- Zod
- Vitest
- Supertest

## Funcionalidades

- Health check com ping
- Criar todo
- Listar todos os todos
- Buscar todo por ID
- Atualizar todo por ID
- Remover todo por ID

## Endpoints

Base URL local: http://localhost:3000

### Ping

- GET /api/ping

Resposta esperada:

```json
{
  "message": "pong"
}
```

### Todos

- GET /api/todos
- POST /api/todos
- GET /api/todos/:id
- PUT /api/todos/:id
- DELETE /api/todos/:id

Payload de criacao e atualizacao:

```json
{
  "title": "Minha tarefa",
  "description": "Descricao opcional"
}
```

## Variaveis de ambiente

As variaveis sao lidas e validadas em tempo de inicializacao.

- PORT: porta da aplicacao (padrao: 3000)
- NODE_ENV: development, production ou test (padrao: development)

Exemplo de arquivo .env:

```env
PORT=3000
NODE_ENV=development
```

## Como executar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

Servidor disponivel em:

- http://localhost:3000

### 3. Build e execucao em producao

```bash
npm run build
npm start
```

## Como testar

### Rodar testes uma vez

```bash
npm test
```

### Rodar em modo watch

```bash
npm run test:watch
```

Os testes sao e2e usando Vitest + Supertest e ficam ao lado dos handlers, com sufixo .spec.ts.

## Padroes utilizados

### 1. Organizacao por dominio e responsabilidade

A API e organizada por dominio em src/api/controllers.

Exemplo:

- src/api/controllers/ping
- src/api/controllers/todos

Cada arquivo de handler contem um caso de uso HTTP (por exemplo: create.ts, get-by-id.ts, update-by-id.ts).

### 2. Padrao de localizacao de rotas

As rotas sao registradas em camadas:

1. src/app.ts registra o modulo principal da API com prefixo /api.
2. src/api/routes.ts agrupa os modulos por dominio (ping e todos).
3. Cada dominio possui seu proprio arquivo routes.ts, que conecta paths aos handlers.

Fluxo de registro:

- app.ts -> api/routes.ts -> controllers/\<dominio\>/routes.ts -> handler

Isso facilita escalar o projeto: para adicionar um novo dominio, basta criar uma pasta em controllers com seu routes.ts e registrar no agregador de rotas da API.

### 3. Validacao de entrada

Os handlers validam params e body usando Zod.

Em caso de payload invalido, a API retorna status 400 com mensagem de erro.

### 4. Repositorio e fabrica

A camada core concentra regras de acesso a dados:

- src/core/repositories/todos/index.ts define o contrato (interface)
- src/core/repositories/todos/in-memory-todo-repository.ts implementa o contrato
- src/core/factories/repositories.ts centraliza a criacao e reutilizacao da instancia

Esse padrao permite trocar a implementacao em memoria por banco de dados no futuro sem alterar os handlers.

### 5. Alias de importacao

O projeto usa alias @ para apontar para src, configurado no tsconfig.

Exemplo:

- import { app } from "@/app"
