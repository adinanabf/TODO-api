# TODO API

API REST que permite gerenciar listas de tarefas. Oferece endpoints de registro/login de usuário e operações de CRUD sobre TODOs.

Senhas são armazenadas com hash via `bcrypt`. O acesso aos endpoints de TODO é autenticado por JWT. Validação de payloads usa `Joi`. A camada de persistência tem implementações para **MongoDB** (padrão) e **PostgreSQL**, selecionáveis via variável de ambiente.

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz com:

   ```env
   DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>/
   DATABASE_NAME=todo_api
   TOKEN_SECRET=<uma_string_secreta_longa>
   ```

3. Suba o servidor:

   ```bash
   npm run dev
   ```

   O servidor escuta em `http://localhost:8080`.

> Para usar PostgreSQL em vez do Mongo, exporte `DB=postgres` e tenha um Postgres local em `localhost:5432` (user/pass `postgres/postgres`).

## Middleware de autenticação

Os endpoints de `/api/TODO/*` exigem um JWT no header `Authorization: Bearer <token>`. O middleware decodifica o token, injeta `req.userId` e chama `next()`. Se o token estiver ausente ou inválido, devolve `401`.

## Endpoints

### `POST /api/register`

Cria um novo usuário.

**Body:**

- `email` (obrigatório): string entre 6 e 255 caracteres, formato e-mail.
- `password` (obrigatório): string entre 8 e 255 caracteres.

**Resposta (201):**

```json
{ "result": { "status": 201, "message": "User created successfully.", "userId": "..." } }
```

### `POST /api/login`

Valida credenciais e retorna um JWT.

**Body:**

- `email` (obrigatório)
- `password` (obrigatório)

**Resposta (200):**

```json
{ "status": 200, "message": "You are successfully logged in.", "token": "eyJhbGciOi..." }
```

### `POST /api/TODO/create`

Cria um TODO. Requer autenticação.

**Body:**

- `description` (obrigatório): string.
- `deadline` (obrigatório): data em formato ISO (ex.: `2026-06-01T00:00:00.000Z`).
- `statusconclusion` (opcional): boolean. Default `false`.

**Resposta (201):**

```json
{ "result": { "status": 201, "message": "TODO created successfully.", "todoId": "..." } }
```

### `PUT /api/TODO/edit`

Edita um TODO ainda aberto. Requer autenticação.

**Body:**

- `todoId` (obrigatório): id do TODO.
- `newDescription` (opcional): string.
- `newDeadline` (opcional): data em formato ISO.

**Resposta (200):**

```json
{ "result": { "status": 200, "message": "TODO item updated successfully." } }
```

### `PUT /api/TODO/close`

Marca um TODO como concluído. Requer autenticação.

**Body:**

- `todoId` (obrigatório): id do TODO.

**Resposta (200):**

```json
{ "result": { "status": 200, "message": "TODO item closed successfully." } }
```

### `GET /api/TODO`

Lista todos os TODOs do usuário autenticado.

**Resposta (200):**

```json
{
  "result": [
    {
      "todoId": "665f...",
      "description": "Estudar para a prova",
      "deadline": "2026-05-20T00:00:00.000Z",
      "statusconclusion": false,
      "isPastDeadline": false,
      "lastmodification": "2026-05-12T02:49:32.263Z"
    }
  ]
}
```
