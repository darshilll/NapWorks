import express from "express";
import dbConnection from "./dbConnection.js";
import morgan from "morgan";
import router from "./routes/index.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import logger from "./logger.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(helmet());

app.set("trust proxy", 1); 

const logStream = fs.createWriteStream(path.join("logs", "requests.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: logStream }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
  headers: true,
});

app.use(limiter);

app.get("/", (req, res) => {
  return res.send("Hii from server");
});


app.use("/api", router);

dbConnection();

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
