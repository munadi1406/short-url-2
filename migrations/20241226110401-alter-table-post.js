'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add the `total_episode` and `air_time` columns to the `posts` table.
     */
    await queryInterface.addColumn('posts', 'total_episode', {
      type: Sequelize.INTEGER, // Ubah tipe data jika perlu, misalnya INTEGER atau FLOAT
      allowNull: true, // Kolom ini boleh null, bisa diubah menjadi false jika diperlukan
      defaultValue: 0, // Nilai default
    });

    await queryInterface.addColumn('posts', 'air_time', {
      type: Sequelize.STRING, // Ubah tipe data jika diperlukan, misalnya INTEGER atau FLOAT
      allowNull: true, // Kolom ini boleh null, bisa diubah menjadi false jika diperlukan
      defaultValue: 0, // Nilai default
    });
    await queryInterface.addColumn('posts', 'trailer', {
      type: Sequelize.STRING, // Ubah tipe data jika diperlukan, misalnya INTEGER atau FLOAT
      allowNull: true, // Kolom ini boleh null, bisa diubah menjadi false jika diperlukan
      defaultValue: 0, // Nilai default
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Remove the `total_episode` and `air_time` columns from the `posts` table.
     */
    await queryInterface.removeColumn('posts', 'total_episode');
    await queryInterface.removeColumn('posts', 'air_time');
    await queryInterface.removeColumn('posts', 'trailer');
  }
};
