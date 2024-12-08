'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan kolom 'idUsers' ke tabel 'links'
    await queryInterface.addColumn('links', 'idUsers', {
      type: Sequelize.UUID,
      allowNull: true, // Kolom ini bersifat opsional
      references: {
        model: 'users', // Mengacu pada model 'users'
        key: 'id',      // Menghubungkan dengan kolom 'id' di tabel 'users'
      },
      onDelete: 'CASCADE', // Jika user yang terkait dihapus, maka idUsers akan diset null
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus kolom 'idUsers' jika rollback
    await queryInterface.removeColumn('links', 'idUsers');
  }
};
