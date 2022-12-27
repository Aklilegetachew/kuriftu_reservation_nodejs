import { DataTypes } from "sequelize";
import database from "../database/database";

const Admin = database.define('admin',{
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number:{
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
    },
    gender:{
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.STRING
    }
});

export default Admin;