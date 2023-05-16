import jwt from "jsonwebtoken";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../common/mongo-db";
import APP_CONFIG from "../constants/env";

const hasToken = (req) => {
  return (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  );
};

const resolveUser = async (id) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("users");
  const c = await collection.findOne({ _id: new ObjectId(id) });
  return c;
};

export const verify = (req: Request): Promise<boolean> => {
  return new Promise<any>((resolve, reject) => {
    if (hasToken(req)) {
      jwt.verify(
        req.headers.authorization.split(" ")[1],
        APP_CONFIG?.Jwt.Secret,
        (err, decoded) => {
          if (err) {
            reject(false);
          }
          resolveUser(decoded["_id"]).then((u) => {
            if (u) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        }
      );
    } else {
      reject(false);
    }
  });
};
