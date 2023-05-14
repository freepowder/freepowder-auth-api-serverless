import { MongoClient } from "mongodb";
import APP_CONFIG from "constants/env";

const uri = APP_CONFIG.db.uri;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

let mongoClient = null;
let database = null;

if (!APP_CONFIG.db.uri) {
    throw new Error('Please add your Mongo URI to .env.local')
}

export async function connectToDatabase() {
    try {
        if (mongoClient && database) {
            return { mongoClient, database };
        }
        if (process.env.NODE_ENV === "development") {
            if (!global._mongoClient) {
                mongoClient = await (new MongoClient(uri)).connect();
                global._mongoClient = mongoClient;
            } else {
                mongoClient = global._mongoClient;
            }
        } else {
            mongoClient = await (new MongoClient(uri)).connect();
        }
        database = await mongoClient.db(APP_CONFIG.db.table);
        return { mongoClient, database };
    } catch (e) {
        console.error(e);
    }
}
