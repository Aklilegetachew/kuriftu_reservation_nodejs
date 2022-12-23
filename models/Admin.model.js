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

// database.sync().then(()=>{
//     console.log('Admin Table created Successfully!');
// }).catch((error)=>{
//     console.log('Unable to create table: ', error);
// })

export default Admin;