import { NextResponse } from 'next/server';
import PostView from "@/models/postView";
import Post from "@/models/post";
import { sequelize } from "@/lib/sequelize";
import { Op } from "sequelize";

// Fungsi untuk mendapatkan top posts berdasarkan jumlah tampilan hari ini
async function getTopPostsByViewsToday(limit = 5) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Awal hari
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Akhir hari

  return await PostView.findAll({
    attributes: [
      'post_id',
      [sequelize.fn('COUNT', sequelize.col('post_id')), 'viewCount'],
    ],
    where: {
      viewed_at: {
        [Op.between]: [startOfDay, endOfDay],
      },
    },
    include: [
      {
        model: Post,
        as: 'post',
        attributes: ['id', 'title', 'slug'],
      },
    ],
    group: ['post_id', 'post.id'],
    order: [[sequelize.literal('viewCount'), 'DESC']],
    limit,
  });
}

// Fungsi untuk mendapatkan top posts berdasarkan jumlah tampilan secara keseluruhan
async function getTopPostsByViewsAllTime(limit = 5) {
  return await PostView.findAll({
    attributes: [
      'post_id',
      [sequelize.fn('COUNT', sequelize.col('post_id')), 'viewCount'],
    ],
    include: [
      {
        model: Post,
        as: 'post',
        attributes: ['id', 'title', 'slug'],
      },
    ],
    group: ['post_id', 'post.id'],
    order: [[sequelize.literal('viewCount'), 'DESC']],
    limit,
  });
}

// Endpoint GET untuk menampilkan top posts dengan limit dinamis
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get('limit'), 10);

    // Gunakan default 5, batasi maksimum 100 agar aman
    const limit = !isNaN(limitParam) && limitParam > 0
      ? Math.min(limitParam, 100)
      : 5;

    // Dapatkan data
    const [topPostsToday, topPostsAllTime] = await Promise.all([
      getTopPostsByViewsToday(limit),
      getTopPostsByViewsAllTime(limit),
    ]);

    // Format hasil
    const formatPosts = (posts) =>
      posts.map((item) => ({
        postId: item.post.id,
        title: item.post.title,
        slug: item.post.slug,
        viewCount: Number(item.dataValues.viewCount),
      }));

    return NextResponse.json({
      statusCode: 200,
      msg: `Top ${limit} Posts (Today & All Time)`,
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
