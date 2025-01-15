'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'release_date');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'release_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  }
};
