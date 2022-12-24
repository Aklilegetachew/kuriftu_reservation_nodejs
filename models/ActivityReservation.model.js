import { DataTypes } from "sequelize";
import database from "../database/database";

const ActivityReserv = database.define("activity_reservation", {
  location: {
    type: DataTypes.STRING,
  },
  fname: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  phone_number: {
    type: DataTypes.STRING,
  },
  confirmation_code: {
    type: DataTypes.STRING,
  },
  reservation_date: {
    type: DataTypes.DATE,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  adult: {
    type: DataTypes.INTEGER,
  },
  kids: {
    type: DataTypes.INTEGER,
  },
  currecnty: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  payment_method: {
    type: DataTypes.STRING,
  },
  payment_status: {
    type: DataTypes.STRING,
  },
  order_status: {
    type: DataTypes.STRING,
  },
  addons: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// database
//   .sync()
//   .then(() => {
//     console.log("Activity Reservation Table created Successfully!");
//   })
//   .catch((error) => {
//     console.log("Unable to create table: ", error);
//   });

export default ActivityReserv;
