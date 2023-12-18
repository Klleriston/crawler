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
    let city = "Guarulhos"

    const client = new MongoClient(mongodbURL!)

    app.listen(port, () => {
        console.log(`O servidor está rodando em http://localhost:${port}`);
    })

    app.get(`/`, async (req, res) => {
        const { lon = defaultlon, lat = defaultlan, cidade} = req.query;
        try {
        // const apiResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
            const apiResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

            const weatherData = apiResponse.data;

            const tempCelsius = weatherData.main.temp - 273.15;
            const tempCelsiusMAX = weatherData.main.temp_max - 273.15;
            const tempCelsiusMIN = weatherData.main.temp_min - 273.15;

            const tempFormat = parseFloat(tempCelsius.toFixed(1));
            const temp_MAX_Format = parseFloat(tempCelsiusMAX.toFixed(1))
            const temp_MIN_Format = parseFloat(tempCelsiusMIN.toFixed(1))


            const respMod = {
                cidade: cidade || weatherData.name,
                temperatura: tempFormat, 
                temperatura_max: temp_MAX_Format,
                temperatura_min: temp_MIN_Format,
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

    app.get('/data', async (req, res) => {
        const { dataMin, dataMax } = req.query;

        try {
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            const collection = db.collection(process.env.CITYS_COLLECTION_NAME!);

            function formatToISO(dateString: string) {
                // Converte a string para uma data e depois para uma string ISO 8601
                return new Date(dateString).toISOString();
            }

            const dateFilter = dataMin && dataMax ? {
                timestamp: {
                    $gte: formatToISO(dataMin.toString()),
                    $lte: formatToISO(dataMax.toString())
                }
            } : {};

            const dataFromDB = await collection.find(dateFilter).toArray();
            console.log('Dados do banco de dados com filtro de data:', dataFromDB);

            res.json(dataFromDB);
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
        } finally {
            await client.close();
        }
    });

