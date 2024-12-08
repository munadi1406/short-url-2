import { sequelize } from '@/lib/sequelize'; // Sesuaikan dengan path ke file sequelize Anda
import { DataTypes } from 'sequelize';

// Definisikan model 'User' dengan sequelize
const User = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Gunakan UUIDV4 untuk default value
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true, // Bisa disesuaikan apakah null dibolehkan atau tidak
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,  // Email tidak boleh null
    unique: true,      // Tambahkan constraint unik untuk email
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,  // Password tidak boleh null
  },
}, {
  timestamps: true, // Menambahkan createdAt dan updatedAt
});

// Export model User
export default User;
