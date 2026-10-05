const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let nextItemId = 1;
let nextBookId = 1;
const items = [];
const books = [];

function problem(res, status, title, detail) {
    return res.status(status).type("application/problem+json").json({
        status,
        title,
        detail
    });
}

function parsePositiveIntegerId(value) {
    if (!/^[1-9]\d*$/.test(value)) return null;
    return Number(value);
}

function validNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

// =========================
// ITEMS
// =========================

app.get("/api/items", (req, res) => {
    const { name } = req.query;

    if (name === undefined) return res.status(200).json(items);

    const term = String(name).trim().toLowerCase();
    const result = items.filter(item =>
        item.name.toLowerCase().includes(term)
    );

    return res.status(200).json(result);
});

app.get("/api/items/:id", (req, res) => {
    const id = parsePositiveIntegerId(req.params.id);

    if (id === null)
        return problem(res, 400, "Pedido inválido", "O id deve ser um inteiro positivo");

    const item = items.find(item => item.id === id);

    if (!item)
        return problem(res, 404, "Não encontrado", `Não existe item com id ${id}`);

    return res.status(200).json(item);
});

app.post("/api/items", (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
        return problem(res, 400, "Pedido inválido", "O corpo JSON é obrigatório");

    if (!validNonEmptyString(req.body.name))
        return problem(res, 400, "Pedido inválido", "O campo name é obrigatório e deve ser texto não vazio");

    const item = {
        id: nextItemId++,
        name: req.body.name.trim()
    };

    items.push(item);

    return res.status(201)
        .location(`/api/items/${item.id}`)
        .json(item);
});

app.put("/api/items/:id", (req, res) => {
    const id = parsePositiveIntegerId(req.params.id);

    if (id === null)
        return problem(res, 400, "Pedido inválido", "O id deve ser um inteiro positivo");

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
        return problem(res, 400, "Pedido inválido", "O corpo JSON é obrigatório");

    if (!validNonEmptyString(req.body.name))
        return problem(res, 400, "Pedido inválido", "O campo name é obrigatório e deve ser texto não vazio");

    const item = items.find(item => item.id === id);

    if (!item)
        return problem(res, 404, "Não encontrado", `Não existe item com id ${id}`);

    item.name = req.body.name.trim();

    return res.status(200).json(item);
});

app.delete("/api/items/:id", (req, res) => {
    const id = parsePositiveIntegerId(req.params.id);

    if (id === null)
        return problem(res, 400, "Pedido inválido", "O id deve ser um inteiro positivo");

    const index = items.findIndex(item => item.id === id);

    if (index === -1)
        return problem(res, 404, "Não encontrado", `Não existe item com id ${id}`);

    items.splice(index, 1);
    return res.status(204).send();
});

// =========================
// BOOKS - recurso adicional
// =========================

const allowedBookStatuses = ["disponivel", "emprestado", "avariado"];

function validateBookBody(body) {
    if (!body || typeof body !== "object" || Array.isArray(body))
        return "O corpo JSON é obrigatório";

    if (!validNonEmptyString(body.title))
        return "O campo title é obrigatório e deve ser texto não vazio";

    if (!validNonEmptyString(body.author))
        return "O campo author é obrigatório e deve ser texto não vazio";

    if (!allowedBookStatuses.includes(body.status))
        return "O campo status deve ser disponivel, emprestado ou avariado";

    return null;
}

function hasDuplicateBookTitle(title, ignoredId = null) {
    const normalized = title.trim().toLowerCase();

    return books.some(book =>
        book.id !== ignoredId &&
        book.title.toLowerCase() === normalized
    );
}

app.get("/api/books", (req, res) => {
    return res.status(200).json(books);
});

app.get("/api/books/:id", (req, res) => {
    const id = parsePositiveIntegerId(req.params.id);

    if (id === null)
        return problem(res, 400, "Pedido inválido", "O id deve ser um inteiro positivo");

    const book = books.find(book => book.id === id);

    if (!book)
        return problem(res, 404, "Não encontrado", `Não existe livro com id ${id}`);

    return res.status(200).json(book);
});

app.post("/api/books", (req, res) => {
    const validationError = validateBookBody(req.body);

    if (validationError)
        return problem(res, 400, "Pedido inválido", validationError);

    if (hasDuplicateBookTitle(req.body.title))
        return problem(res, 409, "Conflito", "Já existe um livro com esse título");

    const book = {
        id: nextBookId++,
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        status: req.body.status,
        createdEm: new Date().toISOString()
    };

    books.push(book);

    return res.status(201)
        .location(`/api/books/${book.id}`)
        .json(book);
});

app.put("/api/books/:id", (req, res) => {
    const id = parsePositiveIntegerId(req.params.id);

    if (id === null)
        return problem(res, 400, "Pedido inválido", "O id deve ser um inteiro positivo");

    const validationError = validateBookBody(req.body);

    if (validationError)
        return problem(res, 400, "Pedido inválido", validationError);

    const book = books.find(book => book.id === id);

    if (!book)
        return problem(res, 404, "Não encontrado", `Não existe livro com id ${id}`);

    if (hasDuplicateBookTitle(req.body.title, id))
        return problem(res, 409, "Conflito", "Já existe um livro com esse título");

    book.title = req.body.title.trim();
    book.author = req.body.author.trim();
    book.status = req.body.status;

    return res.status(200).json(book);
});

app.delete("/api/books/:id", (req, res) => {
    const id = parsePositiveIntegerId(req.params.id);

    if (id === null)
        return problem(res, 400, "Pedido inválido", "O id deve ser um inteiro positivo");

    const index = books.findIndex(book => book.id === id);

    if (index === -1)
        return problem(res, 404, "Não encontrado", `Não existe livro com id ${id}`);

    books.splice(index, 1);
    return res.status(204).send();
});

// JSON malformado
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err)
        return problem(res, 400, "Pedido inválido", "O corpo contém JSON malformado");

    return next(err);
});

// Rota desconhecida
app.use((req, res) => {
    return problem(res, 404, "Não encontrado", "A rota solicitada não existe");
});

// Erros inesperados
app.use((err, req, res, next) => {
    console.error(err);
    return problem(res, 500, "Erro interno", "Ocorreu um erro inesperado");
});

app.listen(PORT, () => {
    console.log(`API a correr em http://localhost:${PORT}`);
});
