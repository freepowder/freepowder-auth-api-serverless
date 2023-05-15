import type { RequestHandler } from "express";

export const signOut: RequestHandler = (req, res, next) => {
    res.status(200).json({ user: null, token: null });
};
