import express, { response } from 'express';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000 || process.env.PORT;
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const mongodbURL = process.env.DB_CONN_STRING;

let defaultlon = 13.404954;
let defaultlan = 52.520008;

const client = new MongoClient(mongodbURL!)

app.listen(port, () => {
    console.log(`O servidor está rodando em http://localhost:${port}`);
})

app.get('/home', (req, res) => {
    res.status(200).send('Olá, estou usando express com o type');
});
app.get(`/teste`, async (req, res) => {
    const { lon = defaultlon, lat = defaultlan, cidade} = req.query;
    try {
        const apiResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);

        const weatherData = apiResponse.data;
        const tempCelsius = weatherData.main.temp - 273.15;
        const tempFormat = parseFloat(tempCelsius.toFixed(1))
        const respMod = {
            cidade: cidade || weatherData.name,
            temperatura: tempFormat, 
        }

        await client.connect();
        const db= client.db(process.env.DB_NAME);
        const collection = db.collection(process.env.CITYS_COLLECTION_NAME!);

        const result = await collection.insertOne(respMod);
        console.log(`Inserindo cidade no banco de dados. ID: ${result.insertedId}`)

        res.json(respMod);
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        res.status(500).json({ error: 'Erro ao chamar a API' });
    } finally {
        await client.close();
    }
});