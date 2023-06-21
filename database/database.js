import { Sequelize } from "sequelize";
// import config from 'config';
import dotenv from "dotenv";

dotenv.config();
const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "109.70.148.58",
    // host: "127.0.0.1",
    dialect: "mysql",
    timezone: "+03:00",
  }
);

export default database;
