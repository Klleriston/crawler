import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;
const apiKey = 'f1cdb1003a7e05c670b29a5aabad3ce1';
let lon = 10.99;
let lat = 44.34;


app.listen(port, () => {
    console.log(`O servidor está rodando em http://localhost:${port}`);
})

app.get('/home', (req, res) => {
    res.status(200).send('Olá, estou usando express com o type');
});
app.get('/teste', async (req, res) => {
    try {
        const apiResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    
        res.json(apiResponse.data);
      } catch (error) {
        console.error('Erro ao chamar a API:', error);
        res.status(500).json({ error: 'Erro ao chamar a API' });
      }
});