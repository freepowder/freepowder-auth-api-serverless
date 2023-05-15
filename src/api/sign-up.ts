import type { RequestHandler } from "express";
import APP_CONFIG from "../constants/env";
import jwt from "jsonwebtoken";
import { hashPassword } from "../common/auth";
import crypto from "crypto";
import User from "../common/user.model";
import { connectToDatabase } from "../common/mongo-db";

const saveUser = async (user) => {
  const { database } = await connectToDatabase();
  const collection = database.collection("users");
  const content = await collection.save(user);
  return content;
};

export const signUp: RequestHandler = (req, res, next) => {
  delete req.body.roles;
  const user = new User(req.body);
  user["provider"] = "local";
  user["salt"] = crypto.randomBytes(16).toString("base64");
  user["password"] = hashPassword(req.body.password, user["salt"]);
  saveUser(user)
    .then((_user) => {
      _user["salt"] = undefined;
      _user["password"] = undefined;
      const token = jwt.sign(_user.toObject(), APP_CONFIG.Jwt.Secret, {
        expiresIn: 15778476000,
      });
      res.status(200).json({ user: _user, token: token });
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
