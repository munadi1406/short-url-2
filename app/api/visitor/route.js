import Article from "@/models/article";
import { VisitorStat } from "@/models/visistorStat";

export async function POST(request) {
    try {
      // Ambil data dari request
      const { page, slug } = await request.json();
      
      // Mendapatkan IP address pengunjung
      const forwardedFor = request.headers.get('x-forwarded-for');
      const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : request.socket.remoteAddress;
      const cleanIpAddress = ipAddress.startsWith('::ffff:') ? ipAddress.substring(7) : ipAddress;
  
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
        ipAddress:cleanIpAddress,
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