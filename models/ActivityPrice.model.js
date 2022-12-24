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
});

// database
//   .sync()
//   .then(() => {
//     console.log("Activity Price Table created Successfully!");
//   })
//   .catch((error) => {
//     console.log("Unable to create table: ", error);
//   });

export default ActivityPrice;
