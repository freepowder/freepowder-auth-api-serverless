import {RequestHandler} from "express";

export const signOut: RequestHandler = (req, res) => {
  res.status(200).json({ user: null, token: null });
};
