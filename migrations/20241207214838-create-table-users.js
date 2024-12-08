'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,  // Tipe data UUID
        allowNull: false,
        primaryKey: true,      // Tentukan ID sebagai primary key
        defaultValue: Sequelize.UUIDV4, // Gunakan UUIDV4 untuk default value
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,  // Bisa disesuaikan apakah null dibolehkan atau tidak
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,  // Biasanya email tidak boleh null
        unique: true,      // Tambahkan constraint unik untuk email
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,  // Password biasanya tidak boleh null
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Set default value ke waktu saat pembuatan
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Set default value ke waktu saat pembuatan
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
    */
    await queryInterface.dropTable('users');
  }
};
