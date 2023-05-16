import { connectToDatabase } from "../common/mongo-db";
import { ObjectId } from "mongodb";
import { verify } from "../common/verify";
import {RequestHandler} from "express";

const resolveContent = async (id) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("contents");
  const c = await collection.findOne({ _id: new ObjectId(id) });
  return c;
};

const saveContent = async (query, updatedContent) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("contents");
  const content = await collection.updateOne(query, updatedContent);
  return content;
};

export const setWierzbianskiContent: RequestHandler = (req, res) => {
  verify(req).then((isValidUser) => {
    if (isValidUser) {
      resolveContent(req["body"]._id)
        .then((content) => {
          const query = { _id: content._id };
          const newValues = {
            $set: {
              updated: new Date(),
              email: req.body.email,
              phone: req.body.phone,
              featured: req.body.featured,
              videos: req.body.videos,
              about: req.body.about,
              workReel: req.body.workReel,
            },
          };
          saveContent(query, newValues)
            .then((_content) => {
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
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  });
};
