import type { RequestHandler } from "express";

export const signOut: RequestHandler = (req, res, next) => {
    req.logout(() => {
        req.auth = null;
        res.status(200).json({ user: null, token: null });
    });
};
