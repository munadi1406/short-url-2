import { sequelize } from "@/lib/sequelize";
import { DataTypes } from "sequelize";
import Post from "./post";

const Tag = sequelize.define(
    'tags',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: true,
        tableName: 'tags',
    }
);

const PostTag = sequelize.define(
    'post_tags',
    {
        post_id: {
            type: DataTypes.INTEGER, // Menyesuaikan dengan tipe data pada tabel 'posts'
            allowNull: false,
            references: {
                model: 'posts', // Nama tabel 'posts'
                key: 'id', // Merujuk ke kolom 'id' di tabel posts
            },
            onDelete: 'CASCADE', // Hapus relasi jika post dihapus
            onUpdate: 'CASCADE', // Update relasi jika post diperbarui
        },
        tag_id: {
            type: DataTypes.UUID, // Merujuk ke kolom 'id' pada tabel tags
            allowNull: false,
            references: {
                model: 'tags', // Nama tabel 'tags'
                key: 'id', // Merujuk ke kolom 'id' di tabel tags
            },
            onDelete: 'CASCADE', // Hapus relasi jika tag dihapus
            onUpdate: 'CASCADE', // Update relasi jika tag diperbarui
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: true,
        tableName: 'post_tags',
        primaryKey: true, // Menetapkan primary key ganda
    }
);


PostTag.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post',
});
Post.hasMany(PostTag, {
    foreignKey: 'post_id',
    as: 'postTag',
});

// Relasi dengan Genre
PostTag.belongsTo(Tag, {
    foreignKey: 'tag_id',
    as: 'tag',
});
Tag.hasMany(PostTag, {
    foreignKey: 'tag_id',
    as: 'tagPosts',
});
Post.belongsToMany(Tag, {
    through: PostTag,
    foreignKey: 'post_id',  // Kolom di tabel 'post_genres' yang mengarah ke 'posts'
    otherKey: 'tag_id',  // Kolom di tabel 'post_genres' yang mengarah ke 'genres'
    as: 'tags'           // Alias untuk asosiasi ini
});
Tag.belongsToMany(Post, {
    through: PostTag,
    foreignKey: 'tag_id',  // Kolom di tabel 'post_genres' yang mengarah ke 'genres'
    otherKey: 'post_id',     // Kolom di tabel 'post_genres' yang mengarah ke 'posts'
    as: 'posts'              // Alias untuk asosiasi ini
});

export {Tag,PostTag}