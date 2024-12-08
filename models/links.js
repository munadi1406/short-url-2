import { sequelize } from '@/lib/sequelize';
import { DataTypes } from 'sequelize';
import User from './users';  // Impor model User
import Url from './urls';

const Link = sequelize.define('links', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  idurls: {
    type: DataTypes.UUID,
    allowNull: true,  // Kolom ini opsional
    references: {
      model: 'urls',  // Mengacu pada model 'urls'
      key: 'id',      // Menghubungkan dengan kolom 'id' di tabel 'urls'
    },
    onDelete: 'SET NULL',  // Jika URL yang terkait dihapus, maka idurls akan diset null
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,  // Link harus ada
  },
  short_url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Pastikan short_url unik
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,  // Title harus ada
  },
  idUsers: {
    type: DataTypes.UUID,
    allowNull: false,  // Kolom ini opsional
    references: {
      model: 'users',  // Mengacu pada model 'users'
      key: 'id',       // Menghubungkan dengan kolom 'id' di tabel 'users'
    },
    onDelete: 'S',  // Jika user yang terkait dihapus, maka idUsers akan diset null
  },
}, {
  timestamps: true,  // Menambahkan kolom createdAt dan updatedAt
});


Link.belongsTo(User, { foreignKey: 'idUsers', onDelete: 'SET NULL' });
Link.belongsTo(Url, { foreignKey: 'idurls', onDelete: 'SET NULL' });


export default Link;
