import { DataTypes } from 'sequelize';
import Post from './post';
import { sequelize } from '@/lib/sequelize';




const Genre = sequelize.define(
    'genres',
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
        tableName: 'genres',
    }
);

const PostGenre = sequelize.define(
    'post_genres',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        post_id: {  // Nama kolom di database
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            field: 'post_id', // Pastikan sesuai dengan nama kolom di database
        },
        genre_id: { // Nama kolom di database
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'genres',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            field: 'genre_id', // Pastikan sesuai dengan nama kolom di database
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
        tableName: 'post_genres',
    }
);

// Relasi dengan Post
PostGenre.belongsTo(Post, {
    foreignKey: 'post_id',
    as: 'post',
});
Post.hasMany(PostGenre, {
    foreignKey: 'post_id',
    as: 'postGenres',
});

// Relasi dengan Genre
PostGenre.belongsTo(Genre, {
    foreignKey: 'genre_id',
    as: 'genre',
});
Genre.hasMany(PostGenre, {
    foreignKey: 'genre_id',
    as: 'genrePosts',
});
Post.belongsToMany(Genre, {
    through: PostGenre,
    foreignKey: 'post_id',  // Kolom di tabel 'post_genres' yang mengarah ke 'posts'
    otherKey: 'genre_id',  // Kolom di tabel 'post_genres' yang mengarah ke 'genres'
    as: 'genres'           // Alias untuk asosiasi ini
});
Genre.belongsToMany(Post, {
    through: PostGenre,
    foreignKey: 'genre_id',  // Kolom di tabel 'post_genres' yang mengarah ke 'genres'
    otherKey: 'post_id',     // Kolom di tabel 'post_genres' yang mengarah ke 'posts'
    as: 'posts'              // Alias untuk asosiasi ini
});


export {Genre,PostGenre}
