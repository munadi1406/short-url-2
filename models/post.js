import { sequelize } from '@/lib/sequelize';
import { DataTypes } from 'sequelize';

const Post = sequelize.define(
  'posts',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('movie', 'series'),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    trailer: {
      type: DataTypes.STRING(255),
      allowNull: true,
      
    },
    air_time: {
      type: DataTypes.STRING(255),
      allowNull: true,
      
    },
    total_episode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    status: {
      type: DataTypes.ENUM('publish', 'draft'),
      allowNull: false,
      defaultValue: 'draft',
    },
    image: {  // New column for image
      type: DataTypes.STRING(2083), // To store the URL/path of the image
      allowNull: true, // Allowing the column to be nullable
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
    tableName: 'posts',
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
    ],
  }
);

export default Post;
