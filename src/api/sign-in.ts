import type { RequestHandler } from "express";
import APP_CONFIG  from "constants/env";
import jwt from "jsonwebtoken";
import {authenticate} from "../common/auth";

export const signIn: RequestHandler = (req, res, next) => {

    authenticate(req.body.email, req.body.password)
        .then((user) => {
            user.password = undefined;
            user.salt = undefined;
            const token = jwt.sign(user.toObject(), APP_CONFIG.Jwt.Secret, { expiresIn: 15778476000 });
            req.logIn(user, (err) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).json({ user: user, token: token });
                }
            });
        })
        .catch((info) => {
            res.status(422).send(info);
        });
};
