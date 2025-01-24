import { NextResponse } from 'next/server';
import PostView from "@/models/postView";
import Post from "@/models/post";
import { sequelize } from "@/lib/sequelize";
import { Op } from "sequelize";

// Fungsi untuk mendapatkan top 5 post berdasarkan jumlah tampilan hari ini
async function getTop5PostsByViewsToday() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Awal hari
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Akhir hari

  return await PostView.findAll({
    attributes: [
      'post_id',
      [sequelize.fn('COUNT', sequelize.col('post_id')), 'viewCount'], // Hitung jumlah tampilan berdasarkan post_id
    ],
    where: {
      viewed_at: {
        [Op.between]: [startOfDay, endOfDay], // Filter berdasarkan waktu
      },
    },
    include: [
      {
        model: Post,
        as: 'post', // Alias untuk relasi
        attributes: ['id', 'title', 'slug'], // Ambil detail post
      },
    ],
    group: ['post_id', 'post.id'], // Kelompokkan berdasarkan post_id
    order: [[sequelize.literal('viewCount'), 'DESC']], // Urutkan berdasarkan jumlah tampilan
    limit: 5, // Ambil 5 post teratas
  });
}

// Fungsi untuk mendapatkan top 5 post berdasarkan jumlah tampilan secara keseluruhan
async function getTop5PostsByViewsAllTime() {
  return await PostView.findAll({
    attributes: [
      'post_id',
      [sequelize.fn('COUNT', sequelize.col('post_id')), 'viewCount'], // Hitung jumlah tampilan berdasarkan post_id
    ],
    include: [
      {
        model: Post,
        as: 'post', // Alias untuk relasi
        attributes: ['id', 'title', 'slug'], // Ambil detail post
      },
    ],
    group: ['post_id', 'post.id'], // Kelompokkan berdasarkan post_id
    order: [[sequelize.literal('viewCount'), 'DESC']], // Urutkan berdasarkan jumlah tampilan
    limit: 5, // Ambil 5 post teratas
  });
}

// Endpoint GET untuk menampilkan top 5 post berdasarkan view (hari ini dan secara umum)
export async function GET() {
  try {
    // Mendapatkan 5 post dengan view terbanyak hari ini
    const topPostsToday = await getTop5PostsByViewsToday();

    // Mendapatkan 5 post dengan view terbanyak secara keseluruhan
    const topPostsAllTime = await getTop5PostsByViewsAllTime();

    // Format hasil menjadi array yang lebih rapi
    const formatPosts = (posts) =>
      posts.map((item) => ({
        postId: item.post.id, // ID post dari relasi
        title: item.post.title, // Judul post dari relasi
        slug: item.post.slug, // Slug post dari relasi
        viewCount: item.dataValues.viewCount, // Jumlah tampilan
      }));

    // Return response dalam format JSON menggunakan NextResponse
    return NextResponse.json({
      statusCode: 200,
      msg: 'Top 5 Posts Today and All Time',
      data: {
        today: formatPosts(topPostsToday),
        allTime: formatPosts(topPostsAllTime),
      },
    });
  } catch (error) {
    console.error('Error fetching top posts:', error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan." },
      { status: 500 }
    );
  }
}
