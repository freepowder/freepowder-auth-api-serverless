import type { RequestHandler } from "express";
import APP_CONFIG  from "../../constants/env";
import jwt from "jsonwebtoken";
import {authenticate} from "common/auth";

export const signOut: RequestHandler = (req, res, next) => {
    req.logout(() => {
        req.auth = null;
        res.status(200).json({ user: null, token: null });
    });
};
