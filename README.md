# LEI022 — TP1 — Primeira API REST

## Identificação

- Unidade curricular: LEI022 — Laboratório de Desenvolvimento de Software
- Trabalho: TP1 — Primeira API REST
- Estudante: Gabriel Alexandre Costa Ribeiro
- Número: 230000982
- Ano letivo: 2026/27
- Node.js: v22.11.0

## Instalação

A partir da pasta `backend/`:

```bash
npm install
```

## Execução

```bash
node server.js
```

API: `http://localhost:3000`

Os dados são mantidos apenas em memória.

## Recurso adicional

Foi escolhido o domínio **livros (`books`)**.

Campos:

- `id`: inteiro positivo, gerado pelo servidor.
- `title`: texto não vazio.
- `author`: texto não vazio.
- `status`: `disponivel`, `emprestado` ou `avariado`.
- `createdEm`: gerado pelo servidor em ISO 8601.

`createdEm` não pode ser definido pelo cliente e mantém-se num PUT.

Não podem existir dois livros com o mesmo título, ignorando maiúsculas/minúsculas. A duplicação produz `409`.

## Endpoints

| Método | Endpoint | Parâmetros / corpo | Sucesso | Erros |
| ------ | -------- | ------------------ | ------- | ----- |
| GET | `/api/items` | — | 200 | — |
| GET | `/api/items?name=...` | query `name` | 200 | — |
| GET | `/api/items/:id` | id inteiro positivo | 200 | 400, 404 |
| POST | `/api/items` | `{ "name": "..." }` | 201 + Location | 400 |
| PUT | `/api/items/:id` | id + `{ "name": "..." }` | 200 | 400, 404 |
| DELETE | `/api/items/:id` | id inteiro positivo | 204 | 400, 404 |
| GET | `/api/books` | — | 200 | — |
| GET | `/api/books/:id` | id inteiro positivo | 200 | 400, 404 |
| POST | `/api/books` | title, author, status | 201 + Location | 400, 409 |
| PUT | `/api/books/:id` | id + title, author, status | 200 | 400, 404, 409 |
| DELETE | `/api/books/:id` | id inteiro positivo | 204 | 400, 404 |

## Testes

Os testes serão realizados no Postman.

| Pedido | Esperado | Obtido |
| ------ | -------- | ------ |
| GET `/api/items` | 200 | [PREENCHER] |
| GET `/api/items/1` | 200 | [PREENCHER] |
| GET `/api/items/999` | 404 | [PREENCHER] |
| GET `/api/items/abc` | 400 | [PREENCHER] |
| GET `/api/items?name=...` | 200 | [PREENCHER] |
| GET `/api/items?name=xyz` | 200 + [] | [PREENCHER] |
| POST `/api/items` válido | 201 + Location | [PREENCHER] |
| POST `/api/items` inválido | 400 | [PREENCHER] |
| POST `/api/items` sem corpo | 400 | [PREENCHER] |
| POST `/api/items` JSON malformado | 400 | [PREENCHER] |
| PUT `/api/items/1` válido | 200 | [PREENCHER] |
| PUT `/api/items/999` | 404 | [PREENCHER] |
| PUT `/api/items/1` inválido | 400 | [PREENCHER] |
| DELETE `/api/items/1` | 204 | [PREENCHER] |
| DELETE `/api/items/999` | 404 | [PREENCHER] |
| GET `/api/xpto` | 404 | [PREENCHER] |
| POST `/api/books` válido | 201 | [PREENCHER] |
| POST `/api/books` status inválido | 400 | [PREENCHER] |
| POST `/api/books` título duplicado | 409 | [PREENCHER] |
| PUT `/api/books/1` válido | 200 | [PREENCHER] |
| DELETE `/api/books/1` | 204 | [PREENCHER] |

## Utilização de IA

Foi utilizada a ferramenta **ChatGPT** como apoio.

Finalidade: duvidas pontuais e estrutura `README.md`.

## Git

```bash
git add .
git commit -m "Implementa TP1 API REST"
git push
git rev-parse HEAD
```

Opcional:

```bash
git tag tp1-entrega
git push --tags
```