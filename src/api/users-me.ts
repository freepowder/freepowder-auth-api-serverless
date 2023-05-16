import { verify } from "../common/verify";
import {RequestHandler} from "express";

export const me: RequestHandler = (req, res) => {
  verify(req).then((isValidUser) => {
    if (isValidUser) {
      return res.status(200).json({ auth: true });
    } else {
      return res.status(200).json({ auth: false });
    }
  });
};
