/* eslint-disable no-process-exit */
import { createClient } from "redis";

const redisClient = await createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.error("❌ REDIS CLIENT CONNECTION ERROR:", err);
    process.exit(1);
});

redisClient.connect();

export default redisClient;
