import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { crawler?: mongoDB.Collection } = {}

export async function connectToDatabase() {
    dotenv.config();
    console.log("DB_CONN_STRING:", process.env.DB_CONN_STRING);
    console.log("DB_NAME:", process.env.DB_NAME);
    console.log("CITYS_COLLECTION_NAME:", process.env.CITYS_COLLECTION_NAME);
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const pingResult = await client.db().command({ ping: 1 });
        console.log(`MongoDB Ping Result: ${pingResult}`);

        const db: mongoDB.Db = client.db(process.env.DB_NAME);
        const citysCollection: mongoDB.Collection = db.collection(process.env.CITYS_COLLECTION_NAME!);
        collections.crawler = citysCollection;

        console.log(`Successfully connected to database: ${db.databaseName} and collection: ${citysCollection.collectionName}`);

    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
    }
}

connectToDatabase()



