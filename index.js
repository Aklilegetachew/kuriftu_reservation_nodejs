import express from "express";
import dotenv from "dotenv";
// import config from "config";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import database from "./database/database";
import router from "./routes/router";
import moment from 'moment-timezone';

moment.tz.setDefault('Africa/Addis_Ababa')

// console.log(moment().format('YYYY-MM-DD hh:mm A'));

dotenv.config();
const app = express();
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     optionsSuccessStatus: 200,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

app.use(cors());

// app.options("*", cors());
app.use(bodyParser.json());
app.use(cookieParser());



app.use(router);

if (process.env.NODE_ENV === "development") {
  app.listen(8000, () => {
    console.log(
      `Server Started on Port: 8000 - ${process.env.NODE_ENV}`
    );
  });
} else if (process.env.NODE_ENV === "production") {
  app.listen(8000, () => {
    console.log(
      `Server Started on Port: 8000 - ${process.env.NODE_ENV}`
    );
  });
}
