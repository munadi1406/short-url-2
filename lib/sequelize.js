import { Sequelize } from "sequelize";
import * as mysql2 from 'mysql2';

export const sequelize = new Sequelize(
    process.env.DB_NAME,       // Nama database
    process.env.DB_USER,       // Username
    process.env.DB_PASSWORD,   // Password
    {
        host: process.env.DB_HOST,      // Host database
        dialect: process.env.DB_DIALECT, // Dialek (mysql)
        dialectModule: mysql2,          // Gunakan mysql2 sebagai driver
    }
);


