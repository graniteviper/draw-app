import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

export const prismaClient = new PrismaClient();
// let redisClient;

// async function connectToRedis() {
//   const client = createClient();
//   client.on("error", (err) => console.log("Redis Client Error", err));
//   await client.connect();
//   console.log("Connected to redis");
//   return;
// }

// connectToRedis();