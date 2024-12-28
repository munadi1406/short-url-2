import { Genre, PostGenre } from '@/models/genre';
import Post from '@/models/post';
import path from 'path';
import fs from 'fs';
import slugify from 'slugify';
import { jsonResponse } from '@/lib/jsonResponse';
import { PostTag, Tag } from '@/models/tag';
import { Op } from 'sequelize';
import Episode from '@/models/episode';
import PostLink from '@/models/postLinks';


const moveFile = async (file) => {
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  console.log(file.stream())
  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filePath;
};

// Helper function to generate a unique slug
const generateUniqueSlug = async (title) => {
  let slug = slugify(title, { lower: true, strict: true });
  let uniqueSlug = slug;

  let postWithSlug = await Post.findOne({ where: { slug: uniqueSlug } });
  let counter = 2;

  while (postWithSlug) {
    uniqueSlug = `${slug}-${counter}`;
    postWithSlug = await Post.findOne({ where: { slug: uniqueSlug } });
    counter++;
  }

  return uniqueSlug;
};

export const POST = async (req, res) => {
  try {
    // Parse the form data
    const formData = await req.formData();

    // Extract fields from the form data
    const title = formData.get('title');
    const description = formData.get('desc');
    const type = formData.get('type');
    const airTime = formData.get('airTime');
    const totalEpisode = formData.get('totalEpisode');
    const trailer = formData.get('trailer');
    const release_date = formData.get('release_date');
    const genres = formData.getAll('genres[]'); // 'genres' is expected to be an array of genre IDs
    const tags = formData.getAll('tags[]');

    // Extract the file (if present)
    const file = formData.get('file'); // This should be the file input field in the form

    // Create a new post transaction
    const transaction = await Post.sequelize.transaction();

    try {
      // Generate a unique slug
      const slug = await generateUniqueSlug(title);

      // Create a new post record
      const newPost = await Post.create(
        {
          title,
          description,
          type,
          release_date,
          slug,
          air_time:airTime,
          total_episode:totalEpisode,
          trailer,
        },
        { transaction }
      );

      // If a file is uploaded, move it to the uploads directory
      let photoPath = null;
      if (file) {
        photoPath = await moveFile(file);

        await Post.update(
          { image: `/uploads/${path.basename(photoPath)}` },
          { where: { id: newPost.id }, transaction }
        );

      }


      if (genres && genres.length > 0) {
        for (let genreId of genres) {
          await PostGenre.create(
            {
              post_id: newPost.id,
              genre_id: genreId,
            },
            { transaction }
          );
        }
      }
      if (tags && tags.length > 0) {
        console.log({ tags })
        for (let tagId of tags) {
          await PostTag.create(
            {
              post_id: newPost.id,
              tag_id: tagId,
            },
            { transaction }
          );
        }
      }

      // Commit the transaction
      await transaction.commit();

      // Return the new post record as a response
      return jsonResponse({ statusCode: 201, msg: "data berhasil disimpan",data:{id:newPost.id} }, 201);
    } catch (error) {
      // Roll back the transaction in case of error
      await transaction.rollback();
      console.error('Error creating post:', error);

      return jsonResponse({ msg: "Error creating post" }, 500)
    }
  } catch (error) {
    console.error('Error processing form data:', error);
    return jsonResponse({ msg: "Error processing form data" }, 500)

  }
};


export const PUT = async (req, res) => {
  try {
    // Parse the form data
    const formData = await req.formData();

    // Extract fields from the form data
    const id = formData.get('id'); // ID of the post to update
    const title = formData.get('title');
    const description = formData.get('desc');
    const airTime = formData.get('airTime');
    const totalEpisode = formData.get('totalEpisode');
    const trailer = formData.get('trailer');
    const type = formData.get('type');
    const release_date = formData.get('release_date');
    const genres = formData.getAll('genres[]'); // 'genres' is expected to be an array of genre IDs
    const tags = formData.getAll('tags[]');

    // Extract the file (if present)
    const file = formData.get('file'); // This should be the file input field in the form

    // Begin transaction for updating the post
    const transaction = await Post.sequelize.transaction();

    try {
      // Find the existing post
      const existingPost = await Post.findByPk(id);
      if (!existingPost) {
        return jsonResponse({ msg: "Post not found" }, 404);
      }

      // Update the post details
      const slug = await generateUniqueSlug(title, id); // Generate a unique slug
      await existingPost.update(
        {
          title,
          description,
          type,
          release_date,
          slug,
          air_time:airTime,
          total_episode:totalEpisode,
          trailer,
        },
        { transaction }
      );

      // If a file is uploaded, remove the old photo and move the new one
      let photoPath = null;
      if (file) {
        // Remove the old photo if it exists
        if (existingPost.image) {
          const oldPhotoPath = path.join(process.cwd(), existingPost.image);
          try {
            await fs.promises.unlink(oldPhotoPath); // Delete the old photo
          } catch (error) {
            console.error(`Error deleting old photo: ${error}`);
          }
        }

        // Upload the new photo
        photoPath = await moveFile(file);
        await existingPost.update(
          { image: `/uploads/${path.basename(photoPath)}` },
          { transaction }
        );
      }

      // Update genres
      if (genres && genres.length > 0) {
        // Remove existing genres
        await PostGenre.destroy({
          where: { post_id: id },
          transaction,
        });

        // Add new genres
        for (let genreId of genres) {
          await PostGenre.create(
            {
              post_id: id,
              genre_id: genreId,
            },
            { transaction }
          );
        }
      }

      // Update tags
      if (tags && tags.length > 0) {
        // Remove existing tags
        await PostTag.destroy({
          where: { post_id: id },
          transaction,
        });

        // Add new tags
        for (let tagId of tags) {
          await PostTag.create(
            {
              post_id: id,
              tag_id: tagId,
            },
            { transaction }
          );
        }
      }

      // Commit the transaction
      await transaction.commit();

      // Return the updated post record as a response
      return jsonResponse({ statusCode: 200, msg: "Data berhasil diperbarui" }, 200);
    } catch (error) {
      // Roll back the transaction in case of error
      await transaction.rollback();
      console.error('Error updating post:', error);
      return jsonResponse({ msg: "Error updating post" }, 500);
    }
  } catch (error) {
    console.error('Error processing form data:', error);
    return jsonResponse({ msg: "Error processing form data" }, 500);
  }
};


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  try {

    const page = parseInt(searchParams.get('page')) || 1;  // Default halaman 1
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;  // Default 10 item per halaman


    const lastCreatedAt = searchParams.get('lastCreatedAt') || null;  // Mendapatkan createdAt dari item terakhir yang dimuat sebelumnya
    const all = searchParams.get('all');
    if (all) {
      const allData = await Post.findAll({ attributes: ['id', 'title'], order: [['title', 'asc']] })
      return jsonResponse({ msg: "success", data: allData }, 200)
    }

    const whereCondition = {};


    if (lastCreatedAt) {
      whereCondition.createdAt = {
        [Op.lt]: new Date(lastCreatedAt),
      };
    }

    // Ambil data dengan kondisi dan urutan DESC berdasarkan createdAt
    const posts = await Post.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      include: [
        {
          model: Genre,
          as: 'genres',
          attributes: ['id','name'],
          through: { attributes: [] },
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id','name'],
          through: { attributes: [] },
        },
        {
          model: Episode,
          attributes: ['id','title','createdAt'],
          include: {
              model: PostLink,
              separate: true, // Mengaktifkan pemisahan pengurutan
              order: [['quality', 'asc']], // Urutan yang benar
          },
          separate: true, // Mengaktifkan pemisahan pengurutan
          order: [['title', 'asc']], // Urutan yang benar

      }
      ],
    });


    // Jika ada data yang ditemukan, ambil createdAt item terakhir sebagai referensi untuk page berikutnya
    const lastLink = posts.length > 0 ? posts[posts.length - 1] : null;


    return jsonResponse({
      data: posts,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: posts.length,
        lastCreatedAt: lastLink ? lastLink.createdAt : null,
      }
    }, 200)
  } catch (error) {
    console.log(error)
    return jsonResponse({
      statusCode: 500,
      msg: "Failed to fetch data",
    }, 500);
  }
}


export const DELETE = async (req, res) => {
  const { searchParams } = new URL(req.url);
  try {
    // Ambil ID dari query params
    const id = searchParams.get('id')

    // Validasi jika ID tidak diberikan
    if (!id) {
      return jsonResponse({ msg: "Post ID is required" }, 400);
    }
    // Cari post berdasarkan ID
    const post = await Post.findOne({ where: { id } });

    // Jika post tidak ditemukan
    if (!post) {
      return jsonResponse({ msg: "Post not found" }, 404);
    }

    // Jika ada gambar terkait, hapus file gambar dari server
    if (post.image) {
      const imagePath = path.join(process.cwd(), 'public', post.image);
      try {
        fs.unlinkSync(imagePath); // Hapus file
      } catch (err) {
        console.warn('Error deleting image file:', err.message);
      }
    }


    await Post.destroy({ where: { id } });



    return jsonResponse({ msg: "Post deleted successfully" }, 200);

  } catch (error) {
    console.error('Error processing delete request:', error);
    return jsonResponse({ msg: "Error processing delete request" }, 500);
  }
};