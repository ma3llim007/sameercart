/* eslint-disable no-console */
/* eslint-disable no-process-exit */
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`🛠️  MONGODB Connected! DB HOST: ${connectionInstance.connection.host} DB NAME: ${connectionInstance.connection.db.databaseName}`);
    } catch (error) {
        console.error("💀  MONGODB CONNECTION ERROR ", error.message);
        process.exit(1);
    }
};

export default connectDB;
