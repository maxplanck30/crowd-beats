import "dotenv/config";

import { Redis } from "ioredis";
let redis: Redis;
const isProduction = process.env.NODE_Env === "production";
if (!isProduction) {
  redis = new Redis();
} else {
  redis = new Redis({
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_PASSWORD!,
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
  });
}

export { redis };
