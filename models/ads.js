import { DataTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

const Ads = sequelize.define(
    'Ads',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        header: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sidebar: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        inContent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        footer: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        directLink: {
            type: DataTypes.STRING,
            allowNull: true,
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
        },
    },
    {
        timestamps: true,
        tableName: 'Ads',
    }
);

export default Ads;