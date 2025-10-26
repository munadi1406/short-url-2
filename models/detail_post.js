import { sequelize } from '@/lib/sequelize'; // Adjust the path to your sequelize instance
import { DataTypes } from 'sequelize';
import Post from './post';

const DetailPost = sequelize.define('detail_post', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    post_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'detail_post',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'

})

DetailPost.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

export default DetailPost;