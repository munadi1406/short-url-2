import { sequelize } from '@/lib/sequelize';
import { DataTypes } from 'sequelize';
import Post from './post';  // Pastikan untuk mengimpor model 'Post'

const PostView = sequelize.define(
  'post_views',
  {
    id: {
      type: DataTypes.INTEGER, // Ubah tipe data menjadi INTEGER
      primaryKey: true, // Tetap sebagai primary key
      autoIncrement: true, // Aktifkan auto increment
      allowNull: false, // Tidak boleh null
    },

    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'posts', // Menunjukkan bahwa post_id adalah referensi dari model 'posts'
        key: 'id',
      },
      onUpdate: 'CASCADE',  // Update cascading jika ID post diubah
      onDelete: 'CASCADE',  // Delete cascading jika post dihapus
    },
    viewed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,  // Waktu tampilan tercatat
    },
  },
  {
    timestamps:false,
    tableName: 'post_views', // Nama tabel di database
  }
);

PostView.belongsTo(Post, {
  foreignKey: 'post_id', // Relasi dengan post_id
  targetKey: 'id', // Menunjukkan bahwa ini mengacu pada ID dari Post
  as: 'post', // Alias untuk relasi
});

Post.hasMany(PostView, {
  foreignKey: 'post_id', // Menunjukkan bahwa relasi ini terkait dengan 'post_id'
  sourceKey: 'id', // Menunjukkan bahwa ini merujuk pada kolom 'id' di tabel 'posts'
  as: 'views', // Alias untuk relasi
});

export default PostView;
