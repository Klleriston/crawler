"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000 || process.env.PORT;
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const mongodbURL = process.env.DB_CONN_STRING;
let defaultlon = 13.404954;
let defaultlan = 52.520008;
const client = new mongodb_1.MongoClient(mongodbURL);
app.listen(port, () => {
    console.log(`O servidor está rodando em http://localhost:${port}`);
});
app.get('/home', (req, res) => {
    res.status(200).send('Olá, estou usando express com o type');
});
app.get(`/teste`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lon = defaultlon, lat = defaultlan, cidade } = req.query;
    try {
        const apiResponse = yield axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const weatherData = apiResponse.data;
        const tempCelsius = weatherData.main.temp - 273.15;
        const tempFormat = parseFloat(tempCelsius.toFixed(1));
        const respMod = {
            cidade: cidade || weatherData.name,
            temperatura: tempFormat,
        };
        yield client.connect();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(process.env.CITYS_COLLECTION_NAME);
        const result = yield collection.insertOne(respMod);
        console.log(`Inserindo cidade no banco de dados. ID: ${result.insertedId}`);
        res.json(respMod);
    }
    catch (error) {
        console.error('Erro ao chamar a API:', error);
        res.status(500).json({ error: 'Erro ao chamar a API' });
    }
    finally {
        yield client.close();
    }
}));
