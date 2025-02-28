import { sequelize } from '@/lib/sequelize';
import { DataTypes } from 'sequelize';

export const Maintenance = sequelize.define(
    'Maintenance',
    {
     id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
     },
      status: {
        type: DataTypes.STRING(20), // Kolom status dengan panjang maksimal 20 karakter
        allowNull: false,
        defaultValue: 'inactive', // Nilai default 'inactive'
      },
    },
    {
      // Pengaturan tambahan untuk model
      tableName: 'maintenances', // Nama tabel yang akan digunakan di database
      timestamps: true, // Menambahkan `createdAt` dan `updatedAt` secara otomatis
      createdAt: 'createdAt', // Kolom `createdAt`
      updatedAt: 'updatedAt', // Kolom `updatedAt`
    }
  );