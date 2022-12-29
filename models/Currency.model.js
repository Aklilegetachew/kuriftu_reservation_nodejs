import { DataTypes } from "sequelize";
import database from "../database/database";

const Currency = database.define("currency", {
  rate: {
    type: DataTypes.STRING,
  },
});


export default Currency;
