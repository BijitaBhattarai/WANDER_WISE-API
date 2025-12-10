import express from "express";
import connectDB from "./config/database.js";
import HANDLERS from "./handlers/index.js";
import errorMiddleware from "./middlewares/error.js";

const SERVER = express();

const PORT = process.env.PORT;

connectDB();

SERVER.use(express.json());
SERVER.use("/", HANDLERS);
SERVER.use(errorMiddleware);

SERVER.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
