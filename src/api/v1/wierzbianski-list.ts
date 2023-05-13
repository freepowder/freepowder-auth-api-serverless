import type { RequestHandler } from "express";
import Content from '../../common/content.model';

export const getWierzbianskiContentList: RequestHandler = (req, res, next) => {

    Content.find({}).then((content) => {
        res.status(200).json(content);
    })
    .catch((err) => {
        return res.status(422).send({message: err});
    });
};
