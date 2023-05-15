import type { RequestHandler } from "express";
import { connectToDatabase } from "../common/mongo-db";

export const config = {
  runtime: "edge",
};

const resolveData = async () => {
  const { database } = await connectToDatabase();
  const collection = database.collection("contents");
  const content = await collection.find({}).toArray();
  return content;
};

export const getWierzbianskiContentList: RequestHandler = (req, res, next) => {
  resolveData()
    .then((content) => {
      res.status(200).json(content);
    })
    .catch((err) => {
      return res.status(422).send({ message: err });
    });
};
