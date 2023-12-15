"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.listen(port, () => {
    console.log(`O servidor está rodando em http://localhost:${port}`);
});
app.get('/home', (req, res) => {
    res.status(200).send('Olá, estou usando express com o type');
});
