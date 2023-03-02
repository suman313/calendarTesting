// const express = require("express");
import express from "express";
// const createError = require("http-errors");
import createHttpError from "http-errors";
// const morgan = require("morgan");
import morgan from "morgan";
// const cors = require("cors");
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/api.route.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

app.use("/api", apiRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
