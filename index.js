import express from "express";
import dotenv from "dotenv";
// import config from "config";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./routes/router";
import moment from "moment-timezone";

moment.tz.setDefault("Africa/Addis_Ababa");

dotenv.config();
const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(router);

app.listen(port, () => {
  console.log(`Server Started on Port: ${port} - ${env}`);
});
