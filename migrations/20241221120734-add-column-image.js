'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'image', {
      type: Sequelize.STRING(2083), // Length to store the URL path
      allowNull: true, // This field is optional; adjust as needed
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'image');
  }
};
