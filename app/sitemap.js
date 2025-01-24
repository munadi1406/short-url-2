const dynamic = 'force-dynamic'
import Post from '@/models/post'

export default async function sitemap() {
  // Ambil semua artikel dari database
  const articles = await Post.findAll({where:{status:"publish"}})
 
  // Tentukan URL dasar situs Anda
  const baseUrl = process.env.NEXTAUTH_URL || 'https://example.com'

  // Buat array URL dengan informasi yang dibutuhkan untuk sitemap
  const urls = articles.map((article) => {
    return {
      url: `${baseUrl}${article.slug}`,
      lastModified: article.updatedAt, // Menggunakan updatedAt artikel
      changeFrequency: 'weekly', // Misalnya, perbarui mingguan
      priority: 0.9, // Nilai prioritas untuk artikel
    }
  })

  // Menambahkan URL dasar (home page)
  const sitemap= [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}tag/completed`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}tag/ongoing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...urls, 
  ]

  return sitemap
}
