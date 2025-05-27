import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import user from "./routes/user.js";
import todos from "./routes/todos.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/user", user);
app.use("/todo", todos);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).json(err.error || 500);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/TODO-APP")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
