import { DataTypes } from 'sequelize';
import Episode from './episode';
import { sequelize } from '@/lib/sequelize';


const PostLink = sequelize.define(
    'post_links',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        episode_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'episodes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        quality: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING(2083),
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
        tableName: 'post_links',
    }
);


PostLink.belongsTo(Episode, {
    foreignKey: 'episode_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Episode.hasMany(PostLink, {
    foreignKey: 'episode_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

export default PostLink


