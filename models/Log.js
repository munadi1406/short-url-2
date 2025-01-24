// models/log.js
import { sequelize } from '@/lib/sequelize';  // Pastikan path sequelize sudah benar
import { DataTypes } from 'sequelize';

export const Log = sequelize.define(
  "logs",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // Sudah memiliki indeks unik
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "away"),
      allowNull: true,
    },
    entry_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    referer: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    os: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true, // Otomatis tambahkan `createdAt` dan `updatedAt`
    tableName:'logs',
  }
);

export default Log;
