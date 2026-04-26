'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ads', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      header: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Script atau iframe iklan header',
      },
      sidebar: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Script atau iframe iklan sidebar',
      },
      inContent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Script atau iframe iklan in-content',
      },
      footer: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Script atau iframe iklan footer',
      },
      directLink: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL direct link iklan',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ads');
  },
};