import type { RequestHandler } from "express";
import APP_CONFIG from "../constants/env";
import { connectToDatabase } from "../common/mongo-db";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

const resolveContent = async (id) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("contents");
  const c = await collection.findOne({ '_id': new ObjectId( id )});
    console.log('resolveContent', c);
    return c;
};

const saveContent = async (updatedContent) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("contents");
  const content = await collection.updateOne(updatedContent);
    console.log('saveContent', content);
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
              console.log('after resolve', content);

            content["updated"] = new Date();
            content["email"] = req.body.email;
            content["phone"] = req.body.phone;
            content["featured"] = req.body.featured;
            content["videos"] = req.body.videos;
            content["about"] = req.body.about;
            content["workReel"] = req.body.workReel;

            saveContent(content)
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
