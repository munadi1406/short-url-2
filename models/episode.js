import { DataTypes } from 'sequelize';
import Post from './post';
import { sequelize } from '@/lib/sequelize';





const Episode = sequelize.define(
    'episodes',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        post_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        tableName: 'episodes',
    }
);



Post.hasMany(Episode, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

export default Episode