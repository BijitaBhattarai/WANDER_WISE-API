import express from "express";
import connectDB from "./config/database.js";
import HANDLERS from "./handlers/index.js";
import errorMiddleware from "./middlewares/error.js";
import { authMiddleware } from "./middlewares/auth.js";
import cors from "cors";

const SERVER = express();

const PORT = process.env.PORT;

connectDB();

SERVER.use(
  cors({
    origin: process.env.BASE_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
SERVER.use(express.json());
SERVER.use(authMiddleware);
SERVER.use("/", HANDLERS);
SERVER.use(errorMiddleware);

SERVER.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
