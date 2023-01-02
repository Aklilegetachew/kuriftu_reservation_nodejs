import { Sequelize } from "sequelize";
import config from 'config';

const database = new Sequelize(
    config.get('database.database'),
    config.get('database.username'),
    config.get('database.password'),
    {
        host: config.get('database.host'),
        dialect: config.get('database.dialect')
    }
)

export default database;
