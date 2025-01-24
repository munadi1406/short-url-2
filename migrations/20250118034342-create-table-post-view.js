'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('post_views', {
      id: {
        type: Sequelize.INTEGER, // Ubah tipe menjadi INTEGER
        primaryKey: true,
        autoIncrement: true, // Tambahkan auto increment
        allowNull: false,
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'posts', // Referensi ke tabel 'posts'
          key: 'id',
        },
        onUpdate: 'CASCADE', // Update cascading jika ID post diubah
        onDelete: 'CASCADE', // Delete cascading jika post dihapus
      },
      viewed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Waktu ketika tampilan tercatat
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('post_views');
  }
};
