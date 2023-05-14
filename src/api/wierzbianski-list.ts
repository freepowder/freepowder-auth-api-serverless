import type { RequestHandler } from "express";
import { connectToDatabase } from "../common/mongo-db";


export const getWierzbianskiContentList: RequestHandler = async (req, res, next) => {

    const { database } = await connectToDatabase();
    const collection = database.collection('contents');
    collection.find({}).then((content) => {
        res.status(200).json(content);
    })
    .catch((err) => {
        return res.status(422).send({message: err});
    });
};
