import { jsonResponse } from "@/lib/jsonResponse";
import { Tag } from "@/models/tag";

// Menangani berbagai metode HTTP untuk CRUD
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    try {

        const page = parseInt(searchParams.get('page')) || 1;  // Default halaman 1
        const pageSize = parseInt(searchParams.get('pageSize')) || 10;  // Default 10 item per halaman


        const lastCreatedAt = searchParams.get('lastCreatedAt') || null;  // Mendapatkan createdAt dari item terakhir yang dimuat sebelumnya
        const all = searchParams.get('all');
        if (all) {
            const allData = await Tag.findAll({ attributes: ['id', 'name'], order: [['name', 'asc']] })
            return jsonResponse({ msg: "success", data: allData }, 200)
        }

        const whereCondition = {};

        // Jika lastCreatedAt diberikan, filter untuk mendapatkan data yang lebih baru dari 'lastCreatedAt'
        if (lastCreatedAt) {
            whereCondition.createdAt = {
                [Op.lt]: new Date(lastCreatedAt),  // Mengambil data yang createdAt-nya lebih kecil dari 'lastCreatedAt'
            };
        }

       
        const telegrams = await Tag.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],  // Urutkan berdasarkan createdAt secara descending
            limit: pageSize,  // Batasi jumlah item yang diambil per halaman
        });

        // Jika ada data yang ditemukan, ambil createdAt item terakhir sebagai referensi untuk page berikutnya
        const lastLink = telegrams.length > 0 ? telegrams[telegrams.length - 1] : null;


        return jsonResponse({
            data: telegrams,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalItems: telegrams.length,
                lastCreatedAt: lastLink ? lastLink.createdAt : null,
            }
        }, 200)
    } catch (error) {

        return jsonResponse({
            statusCode: 500,
            msg: "Failed to fetch data",
        }, 500);
    }
}

export async function POST(req) {
    try {
        const { name } = await req.json();

        if (!name) {

            return jsonResponse({ success: false, msg: "nama tag masih kosong" }, 400)
        }

        await Tag.create({
            name
        });
        return jsonResponse({ msg: "Data Berhasil Disimpan" }, 200)
    } catch (error) {
        return jsonResponse({ msg: "Internal Server Error" }, 500);
    }
}