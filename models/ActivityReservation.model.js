import { DataTypes } from "sequelize";
import database from '../database/database';

const ActivityReserv = database.define('activity_reservation', {
  location: {
    type: DataTypes.STRING,
  },
  fname: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
  },
  confirmation_code: {
    type: DataTypes.STRING
  },
  reservation_date: {
    type: DataTypes.DATE,
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  adult: {
    type: DataTypes.INTEGER,
  },
  kids: {
    type: DataTypes.INTEGER
  },
  price: {
    type: DataTypes.DOUBLE
  },
  order_status: {
    type: DataTypes.STRING,
  },
  addons: {
    type: DataTypes.STRING,
    allowNull: true
  },

});

// database.sync().then(() => {
//   console.log('Admin Table created Successfully!');
// }).catch((error) => {
//   console.log('Unable to create table: ', error);
// });

export default ActivityReserv;