import { verify } from "../common/verify";

export const me = (req, res) => {
  verify(req).then((isValidUser) => {
    if (isValidUser) {
      return res.status(200).json({ auth: true });
    } else {
      return res.status(200).json({ auth: false });
    }
  });
};
