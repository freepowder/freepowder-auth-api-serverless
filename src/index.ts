import APP_CONFIG from "./constants/env";
import express from "express";
import { connector } from "swagger-routes-express";
import swaggerUi from "swagger-ui-express";
import SwaggerParser from "@apidevtools/swagger-parser";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { expressjwt } from "express-jwt";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware";
import * as api from "./api";
import helmet from "helmet";

const app = express();
const start = async () => {
  try {
    const parser = new SwaggerParser();
    const apiDefinition = await parser.validate("./src/docs/api.yml");
    const connect = connector(api, apiDefinition);

    // app.use(cors({ origin: "*" }));

    app.use(bodyParser.json());
    app.use(
      expressjwt({
        secret: APP_CONFIG?.Jwt.Secret,
        algorithms: ["HS256"],
        credentialsRequired: false,
      }).unless({
        path: [
          // public routes that don't require authentication
          "/api/wierzbianski/content",
          "/api/auth/signup",
          "/api/auth/signin",
          "/api/auth/signout",
        ],
      })
    );

    // body & cookie parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(methodOverride());
    app.use(cookieParser(APP_CONFIG.CookieProps.Secret));

    // Logs
    app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    );

    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(
      helmet.hsts({
        maxAge: 15778476000, //SIX_MONTHS,
        includeSubDomains: true,
      })
    );
    app.disable("x-powered-by");
    // Routes
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDefinition));
    connect(app);

    // Catch all error handler
    app.use(errorHandler);
    if (APP_CONFIG.NodeEnv !== "production") {
      app.listen(APP_CONFIG.port, () => {
        const server = "https://localhost:" + APP_CONFIG.port;
        console.log(
          "============================================================="
        );
        console.log(APP_CONFIG.app.title);
        console.log(
          "============================================================="
        );
        console.log("Environment:     " + APP_CONFIG.NodeEnv);
        console.log("Server:          " + server);
        console.log("Database:        " + APP_CONFIG.db.uri);
        console.log("App version:     " + "0.0.1");
        console.log(
          "============================================================="
        );
      });
    }
  } catch (e) {
    console.log(
      "catch ============================================================="
    );
    console.log(e);
  }
};

start().catch((err) => console.log(err));
export default app;
