'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'status', {
      type: Sequelize.ENUM('publish', 'draft'),
      allowNull: false,
      defaultValue: 'draft', // Default value is 'draft'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'status');
    
    // Drop the ENUM type if needed (optional)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_posts_status";');
  }
};
