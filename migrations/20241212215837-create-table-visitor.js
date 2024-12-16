'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membuat tabel 'telegram'
    await queryInterface.createTable('visitors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      page: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      visitedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      articleId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "articles", // Nama tabel Articles
          key: "id", // Kolom primary key di tabel Articles
        },
        onUpdate: "CASCADE", // Perbarui relasi jika id artikel berubah
        onDelete: "SET NULL", // Set NULL jika artikel dihapus
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus tabel 'telegram' jika migrasi dibatalkan
    await queryInterface.dropTable('visitors');
  }
};
