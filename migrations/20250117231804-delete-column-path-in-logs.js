'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('logs', 'path');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('logs', 'path', {
      type: Sequelize.STRING(2048),
      allowNull: false,
    });
  }
};
