import type { RequestHandler } from "express";
import { connectToDatabase } from "../common/mongo-db";


const resolveData = async () => {
    const { database } = await connectToDatabase()
    const collection = database.collection('contents');
    const content = await collection.find({}).toArray();
    return content;
}

export const getWierzbianskiContentList: RequestHandler = (req, res, next) => {

    console.log(' ==> getWierzbianskiContentList');
    resolveData().then((content) => {
        console.log(' ==>  collection find content');
        res.status(200).json(content);
    })
    .catch((err) => {
        return res.status(422).send({message: err});
    });
};
