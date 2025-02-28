'use server'
import { isAdmin } from "@/lib/dal";
import axios from "axios";
import { cookies } from "next/headers";
import Article from "@/models/article";
import { VisitorStat } from "@/models/visistorStat";
export const createCookie = async () => {
    try {
        // Ambil cookieStore snapshot
        const cookieStore = await cookies();

        // Periksa apakah user adalah admin
        const userCheck = await isAdmin();
        if (userCheck) return;

        // Ambil accessToken dari cookieStore snapshot
        let accessToken = cookieStore.get("accessToken")?.value;

        // Kirim accessToken ke API untuk membuat sesi
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/create-session`, {
            accessToken, // Kirim token saat ini
        });

        // Dapatkan token baru dari response
        const newAccessToken = response.data.data.accessToken || "";

        // Simpan token baru di cookie dengan menunggu cookies().set() secara asinkron
        const cookieStoreUpdated = await cookies();
        cookieStoreUpdated.set("accessToken", newAccessToken, {
            path: "/", // Berlaku untuk seluruh situs
            httpOnly: true, // Tidak dapat diakses via JavaScript
            secure: process.env.NODE_ENV === "production", // Hanya dikirim melalui HTTPS jika production
            sameSite: "Strict", // Cookie hanya dikirim untuk domain yang sama
        });

        // Gunakan token baru untuk return atau keperluan berikutnya
        return { 
            sessionId: response.data.data.sessionId, 
            accessToken: newAccessToken // Pastikan selalu menggunakan token terbaru
        };
    } catch (error) {
        throw error; // Throw error agar error bisa di-handle di tempat lain
    }
};



export const recordVisitor = async ({ page, slug, ipAddress, userAgent }) => {
  try {
    // Menangani alamat IP
    const cleanIpAddress = ipAddress.startsWith('::ffff:') ? ipAddress.substring(7) : ipAddress;

    // Validasi data
    if (!page) {
      throw new Error("Page is required");
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
   await VisitorStat.create({
      page,
      ipAddress: cleanIpAddress,
      userAgent,
      visitedAt: new Date(), // Waktu sekarang
      articleId, // Menyimpan articleId, bisa null jika tidak ditemukan
    });
    return true;

  } catch (error) {
    console.error("Error recording visitor:", error);
  }
};




export const sendLogToApi = async (data) => {
  if (!data) return;
  console.log("fungsi jalan-----------------------")
  try {
   await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      } 
    );
    return true;
  } catch (error) {
    console.error('❌ Error sending log to API:', error);
    return false;
  }
};


