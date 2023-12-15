import express from 'express';

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`O servidor está rodando em http://localhost:${port}`);
})

app.get('/home', (req, res) => {
    res.status(200).send('Olá, estou usando express com o type');
});