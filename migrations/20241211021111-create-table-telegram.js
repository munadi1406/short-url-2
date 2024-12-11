'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membuat tabel 'telegram'
    await queryInterface.createTable('telegram', {
      id: {
        type: Sequelize.UUID, // Tipe UUID untuk 'id'
        defaultValue: Sequelize.UUIDV4, // Otomatis menghasilkan UUID v4
        primaryKey: true, // Menjadikan kolom id sebagai primary key
      },
      title: {
        type: Sequelize.STRING, // Tipe string untuk 'title'
        allowNull: false, // Kolom 'title' tidak boleh null
      },
      id_chanel: {
        type: Sequelize.STRING, // Tipe string untuk 'channel_telegram'
        allowNull: false, // Kolom 'channel_telegram' tidak boleh null
        unique:true,
      },
      createdAt: {
        type: Sequelize.DATE, // Kolom 'createdAt' untuk menyimpan waktu pembuatan
        allowNull: false,
        defaultValue: Sequelize.NOW, // Waktu sekarang sebagai default
      },
      updatedAt: {
        type: Sequelize.DATE, // Kolom 'updatedAt' untuk menyimpan waktu pembaruan
        allowNull: false,
        defaultValue: Sequelize.NOW, // Waktu sekarang sebagai default
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus tabel 'telegram' jika migrasi dibatalkan
    await queryInterface.dropTable('telegram');
  }
};
