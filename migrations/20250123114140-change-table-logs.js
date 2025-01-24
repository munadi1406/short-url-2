'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ubah kolom yang ada
    await queryInterface.changeColumn('logs', 'status', {
      type: Sequelize.ENUM('active', 'inactive', 'away'),
      allowNull: true, // Mengubah dari `allowNull: false` menjadi `allowNull: true`
    });

    await queryInterface.changeColumn('logs', 'ip_address', {
      type: Sequelize.STRING(45),
      allowNull: true, // Mengubah dari `allowNull: false` menjadi `allowNull: true`
    });

    await queryInterface.changeColumn('logs', 'user_agent', {
      type: Sequelize.STRING(1024),
      allowNull: true, // Mengubah dari `allowNull: false` menjadi `allowNull: true`
    });

    await queryInterface.changeColumn('logs', 'os', {
      type: Sequelize.STRING(255),
      allowNull: true, // Mengubah dari `allowNull: false` menjadi `allowNull: true`
    });

    // Hapus kolom yang tidak digunakan di model
    await queryInterface.removeColumn('logs', 'last_activity');
    await queryInterface.removeColumn('logs', 'exit_time');

    // Tambahkan properti timestamps jika belum ada
    // Sequelize akan secara otomatis menambahkan `createdAt` dan `updatedAt`
    if (!await queryInterface.describeTable('logs').then(columns => columns.createdAt)) {
      await queryInterface.addColumn('logs', 'createdAt', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
    if (!await queryInterface.describeTable('logs').then(columns => columns.updatedAt)) {
      await queryInterface.addColumn('logs', 'updatedAt', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Balikkan perubahan untuk revert migrasi
    await queryInterface.changeColumn('logs', 'status', {
      type: Sequelize.ENUM('active', 'inactive', 'away'),
      allowNull: false, // Kembali ke `allowNull: false`
    });

    await queryInterface.changeColumn('logs', 'ip_address', {
      type: Sequelize.STRING(45),
      allowNull: false, // Kembali ke `allowNull: false`
    });

    await queryInterface.changeColumn('logs', 'user_agent', {
      type: Sequelize.STRING(1024),
      allowNull: false, // Kembali ke `allowNull: false`
    });

    await queryInterface.changeColumn('logs', 'os', {
      type: Sequelize.STRING(255),
      allowNull: false, // Kembali ke `allowNull: false`
    });

    await queryInterface.addColumn('logs', 'last_activity', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    });


    await queryInterface.addColumn('logs', 'exit_time', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    // Hapus timestamps jika ditambahkan
    await queryInterface.removeColumn('logs', 'createdAt');
    await queryInterface.removeColumn('logs', 'updatedAt');
  }
};
