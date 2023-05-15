import type { RequestHandler } from "express";
import APP_CONFIG from "../constants/env";
import jwt from "jsonwebtoken";
import { hashPassword } from "../common/auth";
import crypto from "crypto";
import { connectToDatabase } from "../common/mongo-db";

const saveUser = async (user) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("users");
  const emailExist = await collection.findOne({ email: user.email });
  if (emailExist) {
      return null;
  }
  const content = await collection.insertOne(user);
  return content;
};

export const signUp: RequestHandler = (req, res, next) => {
  delete req.body.roles;
  const user = req.body;
  user["provider"] = "local";
  user["salt"] = crypto.randomBytes(16).toString("base64");
  user["password"] = hashPassword(req.body.password, user["salt"]);
  saveUser(user)
    .then((data) => {
        if(data === null) {
            const  message = "Error creating a new user : duplicated Email : " + req.body.email;
            return res.status(422).send({
                message: message,
            });
        }
      user["salt"] = undefined;
      user["password"] = undefined;
      const token = jwt.sign(user, APP_CONFIG.Jwt.Secret, {
        expiresIn: 15778476000,
      });
      res.status(200).json({ user: user, token: token });
    })
    .catch((err) => {
      let message = "Error creating a new user";
      if (err.code === 11000) {
        message = message + ": duplicated Email : " + req.body.email;
      }
      return res.status(422).send({
        message: message,
      });
    });
};
