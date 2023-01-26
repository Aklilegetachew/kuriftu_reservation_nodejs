import { DataTypes } from "sequelize";
import database from "../database/database";

const entotoPackage = database.define("entoto_package_price", {
  name: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DOUBLE,
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

export default entotoPackage;