import { DataTypes } from "sequelize";
import database from "../database/database";

const Currency = database.define("currency", {
  rate: {
    type: DataTypes.STRING,
  },
});

// database
//   .sync()
//   .then(() => {
//     console.log("Table created Successfully!");
//   })
//   .catch((error) => {
//     console.log("Unable to create table: ", error);
//   });

export default Currency;
