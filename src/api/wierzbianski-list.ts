import type { RequestHandler } from "express";
import { connectToDatabase } from "../common/mongo-db";


export const getWierzbianskiContentList: RequestHandler = (req, res, next) => {

    connectToDatabase().then(({ database } ) => {
        const collection = database.collection('contents');
        collection.find({}).then((content) => {
            res.status(200).json(content);
        })
        .catch((err) => {
            return res.status(422).send({message: err});
        });
    })
    .catch((err) => {
        return res.status(422).send({message: err});
    });






};
