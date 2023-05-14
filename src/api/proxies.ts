// import type { RequestHandler } from "express";
// import axios from "axios";
// import { Env } from "../../constants";
//
// export const striveProxy: RequestHandler = (req, res, next) => {
//   const url =
//     Env.STRIVE_HOST + req.originalUrl.replace("/api/strive-proxy", "");
//
//   const cookie = req.auth?.striveCookie;
//   const headers = {
//     Accept: "*/*",
//   };
//   if (cookie) {
//     headers["cookie"] = cookie;
//   }
//
//   axios
//     .request({
//       method: req.method,
//       url,
//       headers,
//       data: req.body,
//     })
//     .then((response) => {
//       res.status(response.status).json(response.data);
//     })
//     .catch((err) => {
//       res.status(err.response.status).json(err.response.data);
//     });
// };
//
// export const rgsProxy: RequestHandler = (req, res, next) => {
//   const url = Env.RGS_HOST + req.originalUrl.replace("/api/rgs-proxy", "");
//   const token = req.auth;
//   let headers: any = {
//     Accept: "*/*",
//     "x-player-id": token.auth.playerId,
//     "x-gpn-pam-player-id": token.auth.playerId,
//     "x-session-id": token.session.sessionId,
//     "x-gpn-pam-session-token": token.session.playerSessionToken,
//   };
//
//   if (req.headers["x-gpn-latitude"] && req.headers["x-gpn-longitude"]){
//     headers = {
//       ...headers,
//       "x-gpn-latitude": req.headers["x-gpn-latitude"],
//       "x-gpn-longitude": req.headers["x-gpn-longitude"],
//     };
//   }
//
//   if (req.headers["x-gpn-latitude"] && req.headers["x-gpn-longitude"]){
//     headers["x-gpn-latitude"] = req.headers["x-gpn-latitude"];
//     headers["x-gpn-longitude"] = req.headers["x-gpn-longitude"]
//   }
//
//   if (req.headers["x-gpn-latitude"] && req.headers["x-gpn-longitude"]){
//     const extraheaders = {
//       "x-gpn-latitude": req.headers["x-gpn-latitude"],
//       "x-gpn-longitude": req.headers["x-gpn-longitude"],
//     };
//       Object.assign(headers, extraheaders)
//     }
//
//
//
//
//   axios
//     .request({
//       method: req.method,
//       url,
//       headers,
//       data: req.body,
//     })
//     .then((response) => {
//       res.status(response.status).json(response.data);
//     })
//     .catch((err) => {
//       res.status(err.response.status).json(err.response.data);
//     });
// };
