import crypto from "crypto";
import { connectToDatabase } from "../common/mongo-db";


const resolveUser = async (email) => {
    const { database } = await connectToDatabase();
    const collection = database.collection("contents");
    const user = await collection.findOne({ email: email }).toArray();
    return user[0];
};


/**
 * Authenticate users
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 */
export const authenticate = (email: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
      resolveUser(email)
      .then((user) => {
        if (
          !user ||
          !comparePassword(password, user["password"], user["salt"])
        ) {
          return reject({
            message: "Invalid username or password ", // (' + (new Date()).toLocaleTimeString() + ')'
          });
        }
        return resolve(user);
      })
      .catch((err) => {
        return reject(err);
      });
  })

};
/**
 * Hash user password
 */
export const hashPassword = (password, salt) => {
  if (salt && password) {
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, "SHA512")
      .toString("base64");
  } else {
    return password;
  }
};
/**
 * Check user password
 */
const comparePassword = (requestPassword, password, salt) => {
  return password === hashPassword(requestPassword, salt);
};
