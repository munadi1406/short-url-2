'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membuat tabel pivot post_tags
    await queryInterface.createTable('post_tags', {
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'posts', // Tabel yang direferensikan
          key: 'id',
        },
        onUpdate: 'CASCADE', // Jika data di posts diperbarui
        onDelete: 'CASCADE', // Jika data di posts dihapus
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tags', // Tabel yang direferensikan
          key: 'id',
        },
        onUpdate: 'CASCADE', // Jika data di tags diperbarui
        onDelete: 'CASCADE', // Jika data di tags dihapus
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
     
      
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus tabel pivot post_tags jika rollback
    await queryInterface.dropTable('post_tags');
  },
};
