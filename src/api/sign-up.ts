import type { RequestHandler } from "express";
import APP_CONFIG  from "../constants/env";
import jwt from "jsonwebtoken";
import {hashPassword} from "../common/auth";
import crypto from "crypto";
import User from '../common/user.model';
import {connectToDatabase} from "../common/mongo-db";

export const signUp: RequestHandler = (req, res, next) => {

    connectToDatabase().then(({ database } ) => {
        const collection = database.collection('users');
        collection.find({}).then((content) => {
            delete req.body.roles;
            const user = new User(req.body);
            user['provider'] = 'local';
            user['salt'] = crypto.randomBytes(16).toString('base64');
            user['password'] = hashPassword(req.body.password, user['salt']);
            collection.save(user)
                .then((_user) => {
                    _user['salt'] = undefined;
                    _user['password'] = undefined;
                    const token = jwt.sign(_user.toObject(), APP_CONFIG.Jwt.Secret, { expiresIn: 15778476000 });
                    req.logIn(_user, (err) => {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.status(200).json({ user: _user, token: token });
                        }
                    });
                })
                .catch((err) => {
                    let message = 'Error creating a new user';
                    if (err.code === 11000) {
                        message = message + ': duplicated Email : ' + req.body.email;
                    }
                    return res.status(422).send({
                        message: message
                    });
                });
        })
        .catch((err) => {
            return res.status(422).send({message: err});
        });
    })
    .catch((err) => {
        return res.status(422).send({message: err});
    });




};
