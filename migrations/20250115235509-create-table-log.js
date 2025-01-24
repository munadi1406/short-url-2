'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('logs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      session_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,  // Menyimpan ID sesi unik pengunjung
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'away'),
        allowNull: false,
      },
      entry_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      exit_time: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      last_activity: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },
      referer: {  // Menambahkan kolom referer
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      user_agent: {  // Menambahkan kolom user-agent
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      os: {  // Menambahkan kolom OS
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
    */
    // * await queryInterface.dropTable('users');
  }
};
