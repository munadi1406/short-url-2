import { sequelize } from "@/lib/sequelize";
import { DataTypes } from "sequelize";


export const Telegram = sequelize.define('Telegram', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_chanel: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'telegram', 
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });