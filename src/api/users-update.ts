import { verify } from "../common/verify";
import { connectToDatabase } from "../common/mongo-db";
import { ObjectId } from "mongodb";

const resolveUser = async (id) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("users");
  const c = await collection.findOne({ _id: new ObjectId(id) });
  return c;
};

const saveUser = async (query, updatedContent) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("users");
  const u = await collection.updateOne(query, updatedContent);
  return u;
};

export const setUser = (req, res) => {
  verify(req).then((isValidUser) => {
    if (isValidUser) {
      resolveUser(req["body"]._id)
        .then((content) => {
          const query = { _id: content._id };
          const newValues = {
            $set: {
              updated: new Date(),
              email: req.body.email,
              firstName: req.body.featured,
              lastName: req.body.videos,
            },
          };
          saveUser(query, newValues)
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
      return res.status(200).json({ auth: false });
    }
  });
};
