'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'link');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'link', {
      type: Sequelize.STRING(2083),
      allowNull: true,
    });
  }
};
