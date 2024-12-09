import { sequelize } from '@/lib/sequelize'; // Adjust the path to your sequelize instance
import { DataTypes } from 'sequelize';
import User from './users';

// Define the 'Article' model with sequelize
const Article = sequelize.define('articles', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Use UUIDV4 as the default value
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Title cannot be null
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false, // Slug cannot be null
    unique: true, // Add unique constraint to slug
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false, // Content cannot be null
  },
  id_user: {
    type: DataTypes.UUID,
    allowNull: false, // Foreign key to users cannot be null
    references: {
      model: 'users', // Reference the 'users' table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true, // Add createdAt and updatedAt
});
Article.belongsTo(User, { foreignKey: 'id_user', onDelete: 'CASCADE',onUpdate:'cascade' });
// Export the Article model
export default Article;
