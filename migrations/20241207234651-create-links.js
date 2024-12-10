'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('links', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      idurls: {
        type: Sequelize.UUID,
        allowNull: true,  // Kolom ini bersifat opsional
        references: {
          model: 'urls', // Mengacu pada model 'urls'
          key: 'id',     // Menghubungkan dengan kolom 'id' di tabel 'urls'
        },
        onDelete: 'CASCADE', // Jika URL yang terkait dihapus, maka idurls akan diset null
      },
      link: {
        type: Sequelize.STRING,
        allowNull: false, // Link harus ada
      },
      short_url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,  // Pastikan short_url unik
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false, // Title harus ada
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
    await queryInterface.dropTable('links');
  }
};
