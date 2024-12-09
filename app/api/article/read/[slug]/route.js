import { jsonResponse } from "@/lib/jsonResponse";
import Article from "@/models/article";

export async function GET(req, { params }) {
  const { slug } = params; // Ambil slug dari params
  try {


    // Cek apakah slug ada
    const article = await Article.findOne({ where: { slug } });

    if (!article) {
      // Jika artikel tidak ditemukan
      return jsonResponse({ msg: "Article not found" }, 404);
    }

    // Jika artikel ditemukan, kembalikan data artikel
    return jsonResponse({ data:article }, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ msg: "Internal server error" }, 500);
  }
}
