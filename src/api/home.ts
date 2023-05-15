import type { RequestHandler } from "express";

export const home: RequestHandler = (req, res, next) => {
  res.status(200).json({
    site: "https://api.freepowder.io/",
    version: "1.0",
    description: "serverless express api",
  });
};
