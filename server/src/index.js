import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            // eslint-disable-next-line no-console
            console.log("🚀 Server Is Running");
        });
    })
    .catch((error) => {
        console.error("💀 MONGODB CONNECTION FAILED !!! ", error.message);
    });
