import Article from "@/models/article";
import { VisitorStat } from "@/models/visistorStat";

export async function POST(request) {
    try {
      // Ambil data dari request
      const { page, slug } = await request.json();
      
      // Mendapatkan IP address pengunjung
      const ipAddress = request.headers.get('x-forwarded-for') || request.socket.remoteAddress;
  
      // Mendapatkan userAgent dari request header
      const userAgent = request.headers.get('user-agent');
  
      // Validasi data
      if (!page) {
        return new Response("Page is required", { status: 400 });
      }
  
      // Jika slug diberikan, cari artikel berdasarkan slug
      let articleId = null;
      if (slug) {
        const article = await Article.findOne({ where: { slug } });
  
        // Jika artikel ditemukan, ambil articleId
        if (article) {
          articleId = article.id;
        }
      }
  
      // Menyimpan data visitor di database
      const visitorStat = await VisitorStat.create({
        page,
        ipAddress,
        userAgent,
        visitedAt: new Date(),  // Waktu sekarang
        articleId,  // Menyimpan articleId, bisa null jika tidak ditemukan
      });
  
      // Mengembalikan response sukses
      return new Response(JSON.stringify(visitorStat), {
        status: 201,
      });
    } catch (error) {
      console.error({error});
      return new Response("Failed to record visitor", { status: 500 });
    }
  }