import { connectToDatabase } from "../common/mongo-db";
import { verify } from "../common/verify";
import {RequestHandler} from "express";

const resolveData = async () => {
  const { database } = await connectToDatabase();
  const collection = database.collection("users");
  const projection = { firstName: 1, lastName: 1, email: 1, roles: 1 };
  const users = await collection.find({}).project(projection).toArray();
  return users;
};

export const getUserList: RequestHandler = (req, res) => {
  verify(req).then((isValidUser) => {
    if (isValidUser) {
      resolveData()
        .then((content) => {
          res.status(200).json(content);
        })
        .catch((err) => {
          res.status(422).send({ message: err });
        });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  });
};
