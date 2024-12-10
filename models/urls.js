import { sequelize } from '@/lib/sequelize';
import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import User from './users';
import {Link} from './links';

export const Url = sequelize.define('urls', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_url: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => nanoid(10), // Menggunakan nanoid untuk generate short URL dengan panjang 10 karakter
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,  // Bisa null jika tidak ada user yang memiliki URL
    references: {
      model: 'users', // Mengacu pada model 'users'
      key: 'id',      // Kolom 'id' di model users
    },
    onDelete: 'CASCADE', // Jika user dihapus, maka URL terkait juga akan dihapus
  },
}, {
  timestamps: true, // Secara otomatis menambahkan createdAt dan updatedAt
});

Url.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
 