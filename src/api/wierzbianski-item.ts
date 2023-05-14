import type { RequestHandler } from "express";
import Content from 'common/content.model';

export const setWierzbianskiContent: RequestHandler = (req, res, next) => {

    Content.findById(req['body']._id)
        .then((content) => {
            // content = _.extend(content, req.body);
            content['updated'] = new Date() ;
            content['email'] = req.body.email;
            content['phone'] =  req.body.phone;
            content['featured'] =  req.body.featured;
            content['videos'] =  req.body.videos;
            content['about'] =  req.body.about;
            content['workReel'] =  req.body.workReel;
            content.save()
                .then((_content) => {
                    res.status(200).json(_content);
                })
                .catch((err) => {
                    return res.status(422).send({
                        message: err
                    });
                });
        })
        .catch((err) => {
            res.status(422).send(err);
        });
};
