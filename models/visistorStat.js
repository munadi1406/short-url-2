import { sequelize } from "@/lib/sequelize";
import { DataTypes } from "sequelize";
import Article from "./article";

const VisitorStat = sequelize.define(
    "visitors",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        page: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        visitedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        articleId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "articles", // Nama tabel yang dirujuk
                key: "id",
            },
        },
    },
    {
        tableName: "visitors", // Nama tabel di database
        timestamps: true, // Otomatis menambahkan kolom createdAt dan updatedAt
    }
);

VisitorStat.belongsTo(Article, {
    foreignKey: "articleId",
    as: "article",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
});
Article.hasMany(VisitorStat, {
    foreignKey: "articleId",
    as: "visitorStats",
});

export {VisitorStat};