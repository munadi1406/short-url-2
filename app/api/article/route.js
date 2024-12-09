import { convertTitleToSlug } from "@/lib/converUrl";
import { getUser } from "@/lib/dal";
import { jsonResponse } from "@/lib/jsonResponse";
import Article from "@/models/article";

export async function POST(request) {
    const { content, title } = await request.json();
    const { id } = await getUser();
    try {

        if (!title) return jsonResponse({ msg: "title tidak boleh kosong" }, 400);
        if (!content) return jsonResponse({ msg: "content tidak boleh kosong" }, 400);

        let slug = convertTitleToSlug(title);

        // Ensure unique slug
        let existingSlug = await Article.findOne({ where: { slug } });
        let slugSuffix = 1;
        while (existingSlug) {
            slug = `${convertTitleToSlug(title)}-${slugSuffix++}`;
            existingSlug = await Article.findOne({ where: { slug } });
        }

        const data = {
            content,
            title,
            slug,
            id_user: id,
        };

        await Article.create(data);
        return jsonResponse({ msg: "article berhasil dipublish" }, 200);
    } catch (error) {
        console.error(error);
        return jsonResponse({ msg: "internal server error" }, 500);
    }
}


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    try {

        const page = parseInt(searchParams.get('page')) || 1;  // Default halaman 1
        const pageSize = parseInt(searchParams.get('pageSize')) || 10;  // Default 10 item per halaman
        const { id } = await getUser();  // ID user yang ingin difilter
        const idUser = id

        const lastCreatedAt = searchParams.get('lastCreatedAt') || null;  // Mendapatkan createdAt dari item terakhir yang dimuat sebelumnya

        const whereCondition = {
            id_user: idUser,  // Menyaring berdasarkan ID User
        };

        // Jika lastCreatedAt diberikan, filter untuk mendapatkan data yang lebih baru dari 'lastCreatedAt'
        if (lastCreatedAt) {
            whereCondition.createdAt = {
                [Op.lt]: new Date(lastCreatedAt),  // Mengambil data yang createdAt-nya lebih kecil dari 'lastCreatedAt'
            };
        }

        // Ambil data dengan kondisi dan urutan DESC berdasarkan createdAt
        const links = await Article.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],  // Urutkan berdasarkan createdAt secara descending
            limit: pageSize,  // Batasi jumlah item yang diambil per halaman
        });

        // Jika ada data yang ditemukan, ambil createdAt item terakhir sebagai referensi untuk page berikutnya
        const lastLink = links.length > 0 ? links[links.length - 1] : null;


        return jsonResponse({
            data: links,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalItems: links.length,
                lastCreatedAt: lastLink ? lastLink.createdAt : null,  // Kirimkan createdAt item terakhir
            }
        }, 200)
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return jsonResponse({
            statusCode: 500,
            message: "Failed to fetch data",
        }, 500);
    }
}