import { DataTypes } from "sequelize";
import database from "../database/database";

const SuperAppActivityReserv = database.define(
  "activity_reservation_superapp",
  {
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
    package: {
      type: DataTypes.STRING,
    },
  }
);

database
  .sync()
  .then(() => {
    console.log("Table created Successfully!");
  })
  .catch((error) => {
    console.log("Unable to create table: ", error);
  });

export default SuperAppActivityReserv;
