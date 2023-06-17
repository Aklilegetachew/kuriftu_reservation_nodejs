import { DataTypes } from "sequelize";
import database from "../database/database";

const ActivityPrice = database.define("activity_price", {
  name: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  text: {
    type: DataTypes.STRING,
  },
  photo: {
    type: DataTypes.STRING,
  },
});

export default ActivityPrice;
