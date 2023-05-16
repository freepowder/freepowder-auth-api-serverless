import { connectToDatabase } from "../common/mongo-db";

const resolveData = async () => {
  const { database } = await connectToDatabase();
  const collection = database.collection("contents");
  const content = await collection.find({}).toArray();
  return content;
};

export default function getWierzbianskiContentList(req, res) {
  resolveData()
    .then((content) => {
      res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
      res.status(200).json(content);
    })
    .catch((err) => {
      return res.status(422).send({ message: err });
    });
};
