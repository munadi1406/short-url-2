
import { jsonResponse } from "@/lib/jsonResponse";
import { getUser } from "@/lib/dal";
import Article from "@/models/article";

export async function GET(req, { params }) {
    const paramsData = await params
    try {
        const articleId = paramsData.id
        const { id } = await getUser(); 
        const idUser = id;

        if (!articleId) {
            return jsonResponse(
                { message: "articleId parameter is required" },
                400
            ); // 400 jika tidak ada ID yang diberikan
        }

        // Cari artikel berdasarkan ID dan user ID (jika perlu filter berdasarkan user)
        const article = await Article.findOne({
            where: {
                id: articleId,
                id_user: idUser, // Opsional: filter berdasarkan user jika autentikasi diaktifkan
            },
        });

        // Jika artikel tidak ditemukan
        if (!article) {
            return jsonResponse(
                { msg: `Article with ID ${articleId} not found` },
                404
            );
        }






        // Kirim respons dengan data artikel dan visitor count
        return jsonResponse({ data: article }, 200);
    } catch (error) {
        console.error("Error fetching article by ID:", error.message);
        return jsonResponse(
            { msg: "Failed to fetch article data", error: error.message },
            500
        );
    }
}
