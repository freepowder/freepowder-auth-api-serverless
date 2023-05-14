import dotenv from "dotenv";
const env = process.env.NODE_ENV || 'development';
if (env !== "production") {
  dotenv.config({path: `env/${env}.env`});
}
export default {
  app: {
    title: 'FP',
    description: 'FP REST API - TYPESCRIPT NODEJS JWT',
    keywords: 'Nodejs, Typescript, JWT, MongoDB',
  },
  whitelist:  process.env.WHITELIST,
  db: {
    uri: process.env.MONGO,
    table: process.env.DB
  },
  secure: {
    ssl: false,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt'
  },
  NodeEnv: (process.env.NODE_ENV ?? ''),
  port: (process.env.PORT ?? 0),
  CookieProps: {
    Key: 'ExpressGeneratorTs',
    Secret: (process.env.COOKIE_SECRET ?? ''),
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: (process.env.COOKIE_PATH ?? ''),
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: (process.env.COOKIE_DOMAIN ?? ''),
      secure: (process.env.SECURE_COOKIE === 'true'),
    },
  },
  Jwt: {
    Secret: (process.env.JWT_SECRET ??  ''),
    Exp: (process.env.COOKIE_EXP ?? ''), // exp at the same time as the cookie
  },
} as const;
