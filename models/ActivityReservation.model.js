import { DataTypes } from "sequelize";
import database from "../database/database";

const ActivityReserv = database.define("activity_reservation", {
  location: {
    type: DataTypes.STRING,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  email_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phone_number: {
    type: DataTypes.STRING,
  },
  confirmation_code: {
    type: DataTypes.STRING,
  },
  reservation_date: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  amt: {
    type: DataTypes.JSON,
  },
  adult: {
    type: DataTypes.INTEGER,
  },
  kids: {
    type: DataTypes.INTEGER,
  },
  redeemed_adult_ticket: {
    type: DataTypes.INTEGER,
  },
  redeemed_kids_ticket: {
    type: DataTypes.INTEGER,
  },
  currency: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  tx_ref: {
    type: DataTypes.STRING,
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
//     console.log("Table created Successfully!");
//   })
//   .catch((error) => {
//     console.log("Unable to create table: ", error);
//   });


export default ActivityReserv;
