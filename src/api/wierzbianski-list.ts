import type { RequestHandler } from "express";
import { connectToDatabase } from "../common/mongo-db";


export const getWierzbianskiContentList: RequestHandler = (req, res, next) => {


    console.log(' ==> getWierzbianskiContentList');

    connectToDatabase().then(({ database } ) => {

        console.log(' ==> connected to Mongo');

        const collection = database.collection('contents');
        collection.find({}).then((content) => {
            console.log(' ==>  collection find content');
            res.status(200).json(content);
        })
        .catch((err) => {
            console.log(' ==> error collection find content');
            console.log(err);
            return res.status(422).send({message: err});
        });
    })
    .catch((err) => {
        console.log(' ==> error connecting to Mongo');
        console.log(err);
        return res.status(422).send({message: err});
    });






};
