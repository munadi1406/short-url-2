'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('urls', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // UUIDv4 otomatis
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      short_url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Menjamin bahwa setiap short URL bersifat unik
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,  // Jika tidak semua URL harus dimiliki oleh user, boleh diatur sebagai nullable
        references: {
          model: 'users',  // Nama tabel yang menjadi referensi
          key: 'id',       // Kolom yang menjadi foreign key
        },
        onDelete: 'CASCADE', // Menjaga referensial integritas, jika user dihapus, maka URL terkait akan dihapus
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('urls');
  },
};
