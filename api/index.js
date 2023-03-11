//alt shift f de format lai code


import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
const app = express();
import { userRouter } from "./routes/users.js";
import { authRouter } from "./routes/auth.js";
import { postRouter } from "./routes/posts.js";

dotenv.config();
try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("successful");
} catch (error) {
  console.log("fail");
}

//midleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//định hướng người dùng, nếu đường dẫn này sẽ vào..
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.listen(7172, () => {
  console.log("HelloWorld");
});
