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
import { v4 as uuidv4 } from "uuid";
import cloudinary from '@/lib/cloudinary';
const uploadDir = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");;


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
          slug,
          air_time: airTime,
          total_episode: totalEpisode,
          trailer,
        },
        { transaction }
      );

      // If a file is uploaded, upload it to Cloudinary
      if (file) {
        const fileBuffer = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileBuffer).toString('base64');

        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.type};base64,${fileBase64}`,
          {
            folder: 'posts', // Folder di Cloudinary
            public_id: `post_${newPost.id}`, // Public ID unik untuk file
          }
        );

        // Update post with the Cloudinary image URL
        await Post.update(
          { image: uploadResult.secure_url }, // Menggunakan secure_url dari hasil upload
          { where: { id: newPost.id }, transaction }
        );
      }

      // Add genres if provided
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

      // Add tags if provided
      if (tags && tags.length > 0) {
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
      return jsonResponse({ statusCode: 201, msg: "Data berhasil disimpan", data: { id: newPost.id } }, 201);
    } catch (error) {
      // Roll back the transaction in case of error
      await transaction.rollback();
      console.error('Error creating post:', error);

      return jsonResponse({ msg: "Error creating post" }, 500);
    }
  } catch (error) {
    console.error('Error processing form data:', error);
    return jsonResponse({ msg: "Error processing form data" }, 500);
  }
};


export const PUT = async (req, res) => {
  try {
    

    // Parse the form data
    const formData = await req.formData();

    // Extract fields from the form data
    const id = formData.get('id');
    const title = formData.get('title');
    const description = formData.get('desc');
    const airTime = formData.get('airTime');
    const totalEpisode = formData.get('totalEpisode');
    const trailer = formData.get('trailer');
    const type = formData.get('type');
   
    const genres = formData.getAll('genres[]');
    const tags = formData.getAll('tags[]');
    const file = formData.get('file');

    // Begin transaction for updating the post
    const transaction = await Post.sequelize.transaction();

    try {
      // Find the existing post
      const existingPost = await Post.findByPk(id);
      if (!existingPost) {
        return jsonResponse({ msg: "Post not found" }, 404);
      }

      // Update the post details

      await existingPost.update(
        {
          title,
          description,
          type,
         
          air_time: airTime,
          total_episode: totalEpisode,
          trailer,
        },
        { transaction }
      );

      // If a file is uploaded, handle Cloudinary upload and deletion
      if (file) {
        // Delete the old photo from Cloudinary if it exists
        if (existingPost.image) {
          
          const imageUrlParts = existingPost.image.split('/');
          const publicIdWithExtension = imageUrlParts.slice(-2).join('/'); // Ambil 2 segmen terakhir dari URL
          const publicId = publicIdWithExtension.split('.').slice(0, -1).join('.'); // Hilangkan ekstensi file
          console.log({publicId})
          try {
            const test = await cloudinary.uploader.destroy(publicId);
            console.log(test)
          } catch (error) {
            console.error(`Error deleting old Cloudinary image: ${error}`);
          }
        }

        const tempFilePath = `/tmp/${file.name}`; // Temporary file path
        const buffer = Buffer.from(await file.arrayBuffer()); // Convert File to Buffer

        // Write buffer to a temporary file
        fs.writeFileSync(tempFilePath, buffer);

        // Upload file to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(tempFilePath, {
          folder: 'posts',
          public_id: `post_${id}_${Date.now()}`,
          overwrite: true,
        });
        console.log({uploadedImage})

        // Update the post image URL
        await existingPost.update(
          { image: uploadedImage.secure_url },
          { transaction }
        );
      }

      // Update genres
      if (genres && genres.length > 0) {
        await PostGenre.destroy({ where: { post_id: id }, transaction });
        for (let genreId of genres) {
          await PostGenre.create({ post_id: id, genre_id: genreId }, { transaction });
        }
      }

      // Update tags
      if (tags && tags.length > 0) {
        await PostTag.destroy({ where: { post_id: id }, transaction });
        for (let tagId of tags) {
          await PostTag.create({ post_id: id, tag_id: tagId }, { transaction });
        }
      }

      // Commit the transaction
      await transaction.commit();
      return jsonResponse({ statusCode: 200, msg: "Data berhasil diperbarui" }, 200);
    } catch (error) {
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

    const search = searchParams.get('search') || '';
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
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };  
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
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: Episode,
          attributes: ['id', 'title', 'createdAt'],
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
    const id = searchParams.get('id');

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

    // Jika ada gambar terkait, hapus gambar dari Cloudinary
    if (post.image) {
      // Ambil `public_id` dari URL Cloudinary
      const imageUrlParts = post.image.split('/');
      const publicIdWithExtension = imageUrlParts.slice(-2).join('/'); // Ambil 2 segmen terakhir dari URL
      const publicId = publicIdWithExtension.split('.').slice(0, -1).join('.'); // Hilangkan ekstensi file

      try {
        // Hapus gambar dari Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      } catch (err) {
        console.warn('Error deleting image from Cloudinary:', err.message);
      }
    }

    // Hapus post dari database
    await Post.destroy({ where: { id } });

    return jsonResponse({ msg: "Post deleted successfully" }, 200);
  } catch (error) {
    console.error('Error processing delete request:', error);
    return jsonResponse({ msg: "Error processing delete request" }, 500);
  }
};