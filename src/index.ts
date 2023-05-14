import APP_CONFIG from "./constants/env";
import express from "express";
import { NextFunction, Response, Request } from 'express';
import { connector } from "swagger-routes-express";
import swaggerUi from "swagger-ui-express";
import SwaggerParser from "@apidevtools/swagger-parser";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { expressjwt } from "express-jwt";
import compress from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import type { JwtPayload } from "jsonwebtoken";
import { errorHandler } from "./middleware";
import * as api from "./api";
import mongoose from 'mongoose';
import session from "express-session";
import passport from 'passport';
import helmet from 'helmet';

declare global {
  namespace Express {
    interface Request {
      auth: JwtPayload;
    }
  }
}

const app = express();
const start = async () => {

    try {
        console.log(' start =============================================================');
        const parser = new SwaggerParser();
        const apiDefinition = await parser.validate("./src/docs/api.yml");
        const connect = connector(api, apiDefinition);
        console.log(' connect =============================================================');
        await mongoose.connect(APP_CONFIG.db.uri )
        console.log(' mongo =============================================================');
        const whitelist = APP_CONFIG.whitelist.split(',');
        app.use(cors( {origin: whitelist}))
        app.use((req, res, next) => {
            const origin = req.get('referer');
            const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
            if (isWhitelisted) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
                res.setHeader('Access-Control-Allow-Credentials', 'true');
            }
            // Pass to next layer of middleware
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else { next(); }
        });

        app.use(bodyParser.json());
        app.use(
            expressjwt({
                secret: APP_CONFIG?.Jwt.Secret,
                algorithms: ["HS256"],
                credentialsRequired: false,
            }).unless({
                path: [
                    // public routes that don't require authentication
                    '/api/wierzbianski/content',
                    '/api/auth/signup',
                    '/api/auth/signin',
                    '/api/auth/signout'
                ]
            })
        );

        app.use(compress({
            filter(req: Request, res: Response) {
                return (/json|text|javascript|css|font|svg/)
                    .test(res.getHeader('Content-Type') ? res.getHeader('Content-Type').toString() : '');
            },
            level: 9
        }));
        // body & cookie parser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(methodOverride());
        app.use(cookieParser(APP_CONFIG.CookieProps.Secret));

        // Logs
        app.use(
            morgan(":method :url :status :res[content-length] - :response-time ms")
        )
        // passport
        app.use(session({
            secret: APP_CONFIG.CookieProps.Secret,
            resave: true,
            saveUninitialized: true,
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.use((req, res, next) => {
            res.locals.user = req.auth;
            next();
        });

        app.use(helmet.frameguard());
        app.use(helmet.xssFilter());
        app.use(helmet.noSniff());
        app.use(helmet.ieNoOpen());
        app.use(helmet.hsts({
            maxAge: 15778476000, //SIX_MONTHS,
            includeSubDomains: true,
        }));
        app.disable('x-powered-by');

        // Routes
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDefinition));
        connect(app);

        // Catch all error handler
        app.use(errorHandler);
        if (APP_CONFIG.NodeEnv !== "production") {
            app.listen(APP_CONFIG.port, () => {
                const server = 'https://localhost:' + APP_CONFIG.port;
                console.log('=============================================================');
                console.log(APP_CONFIG.app.title);
                console.log('=============================================================');
                console.log('Environment:     ' +APP_CONFIG.NodeEnv);
                console.log('Server:          ' + server);
                console.log('Database:        ' + APP_CONFIG.db.uri);
                console.log('App version:     ' + '0.0.1');
                console.log('=============================================================');
            });
        }
    } catch(e) {
        console.log('catch =============================================================');

        console.log(e);
    }


};

start().catch((err) => console.log(err));
export default app;
