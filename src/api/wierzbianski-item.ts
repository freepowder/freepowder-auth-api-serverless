import type { RequestHandler } from "express";
import APP_CONFIG from "../constants/env";
import { connectToDatabase } from "../common/mongo-db";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

const resolveContent = async (id) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("contents");
  const c = await collection.findOne({ '_id': new ObjectId( id )});
  return c;
};

const saveContent = async (query,updatedContent) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("contents");
  const content = await collection.updateOne(query, updatedContent);
    return content;
};

export const setWierzbianskiContent: RequestHandler = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
      console.log('before verify');
      console.log('before verify ==> token ' , req.headers.authorization.split(" ")[1]);
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      APP_CONFIG?.Jwt.Secret,
      (err, decoded) => {
        if (err) {
            console.log('err verify');
          return res.status(401).json({
            site: "https://api.freepowder.com/",
            error: {
              url: req.url,
              message: "Invalid token",
              code: 401,
            },
          });
        }
          console.log('after verify');
        resolveContent(req["body"]._id)
          .then((content) => {
              const query = { '_id': content._id };
              const newvalues = { $set: {
                      updated: new Date(),
                      email:req.body.email,
                      phone:req.body.phone,
                      featured: req.body.featured,
                      videos: req.body.videos,
                      about: req.body.about,
                      workReel: req.body.workReel,
                }
              };
            saveContent(query, newvalues)
              .then((_content) => {
                  console.log('after save', content);
                  res.status(200).json(content);
              })
              .catch((err) => {
                return res.status(422).send({
                  message: "error saving",
                });
              });
          })
          .catch((err) => {
            return res.status(422).send({ message: "error resolving" });
          });
      }
    );
  } else {
    res.status(401).json({ error: "Invalid token" });
  }
};
