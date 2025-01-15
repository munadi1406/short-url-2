import { convertTitleToSlug } from "@/lib/converUrl";
import { getUser } from "@/lib/dal";
import { jsonResponse } from "@/lib/jsonResponse";
import Article from "@/models/article";
import { Op, Sequelize } from "sequelize";
import path from "path";
import fs from "fs";
import { VisitorStat } from "@/models/visistorStat";
import cloudinary from "@/lib/cloudinary";

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

        return jsonResponse({ msg: "internal server error" }, 500);
    }
}
export async function PUT(request) {
    const { content, title, articleId } = await request.json();
    const { id } = await getUser();
    try {



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

        await Article.update(data, { where: { id: articleId } });
        return jsonResponse({ msg: "article berhasil dipublish" }, 200);
    } catch (error) {
        return jsonResponse({ msg: "internal server error" }, 500);
    }
}


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    try {
        const page = parseInt(searchParams.get('page')) || 1;  // Default to page 1
        const pageSize = parseInt(searchParams.get('pageSize')) || 10;  // Default 10 items per page
        const { id } = await getUser();  // ID of the user to filter
        const idUser = id;

        const lastCreatedAt = searchParams.get('lastCreatedAt') || null;  // Get lastCreatedAt from query params
        const articleIds = searchParams.getAll('articleIds') || []; // Assuming you can provide a list of article IDs if needed

        const whereCondition = {
            id_user: idUser,  // Filter based on user ID
        };

        // If lastCreatedAt is provided, filter to get data created before the provided timestamp
        if (lastCreatedAt) {
            whereCondition.createdAt = {
                [Op.lt]: new Date(lastCreatedAt),  // Get data created before 'lastCreatedAt'
            };
        }

        // If articleIds are provided, filter the articles by those IDs
        if (articleIds.length > 0) {
            whereCondition.id = {
                [Op.in]: articleIds,  // Filter based on provided article IDs
            };
        }

        // Retrieve articles with conditions and order them by createdAt in descending order
        const articles = await Article.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],  // Order by createdAt in descending order
            limit: pageSize,  // Limit number of items per page
        });

        // Get the IDs of the articles fetched
        const articleIdsList = articles.map(article => article.id);

        // Fetch the visitor count for each article using the 'in' operator
        const visitorStats = await VisitorStat.findAll({
            where: {
                articleId: {
                    [Op.in]: articleIdsList,  // Get visitors for articles in the list
                }
            },
            attributes: [
                'articleId',
                [Sequelize.fn('COUNT', Sequelize.col('visitors.id')), 'visitorCount']
            ],
            group: ['articleId']  // Group by articleId to count visitors for each article
        });

        // Map the visitor count to each article
        const articlesWithVisitorCount = articles.map(article => {
            const visitorStat = visitorStats.find(stat => stat.articleId === article.id);
            return {
                ...article.toJSON(),
                visitorCount: visitorStat ? visitorStat.get('visitorCount') : 0  // Add visitor count
            };
        });

        // Get the last createdAt item as a reference for the next page
        const lastArticle = articlesWithVisitorCount.length > 0 ? articlesWithVisitorCount[articlesWithVisitorCount.length - 1] : null;

        // Return the response with articles, pagination info, and visitor count
        return jsonResponse({
            data: articlesWithVisitorCount,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalItems: articlesWithVisitorCount.length,
                lastCreatedAt: lastArticle ? lastArticle.createdAt : null,  // Send the createdAt of the last item
            },
        }, 200);
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return jsonResponse({
            statusCode: 500,
            message: "Failed to fetch data",
        }, 500);
    }
}



export const detectImageDeletion = (json) => {
    // Jika json adalah string JSON, lakukan parsing terlebih dahulu
    const parsedJson = typeof json === 'string' ? JSON.parse(json) : json;

    // Periksa apakah parsedJson adalah array atau objek dan akses kontennya
    const content = Array.isArray(parsedJson) ? parsedJson : parsedJson.content || [];

    // Ekstrak node gambar dari JSON
    const currentImages = content.filter(node => node.type === 'img' && node.attributes && node.attributes.src); // Memastikan ada 'src' di dalam attrs

    // Mendapatkan src gambar
    const currentImageSet = currentImages.map(image => image.attributes.src);

    return currentImageSet;
};
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");
// Fungsi untuk menghapus gambar dari sistem file
const deleteImagesFromFileSystem = async (images) => {
    for (const imagePath of images) {
        const imageUrlParts = imagePath.split('/');
        const publicIdWithExtension = imageUrlParts.slice(-2).join('/'); // Ambil 2 segmen terakhir dari URL
        const publicId = publicIdWithExtension.split('.').slice(0, -1).join('.');

        await cloudinary.uploader.destroy(publicId); // Tunggu setiap penghapusan selesai

    }
};


// Fungsi untuk menangani permintaan DELETE
export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const session = await getUser()

    try {
        const id = searchParams.get('id');
        const checkOwnerArticle = await Article.findByPk(id, { attributes: ['id_user', 'content'] });

        if (checkOwnerArticle.id_user !== session.id) {
            return jsonResponse({ msg: "unauthorized" }, 401);
        }

        // Deteksi gambar yang akan dihapus
        const imagenames = detectImageDeletion(checkOwnerArticle.content);


        deleteImagesFromFileSystem(imagenames);


        await Article.destroy({ where: { id } })

        return jsonResponse({ msg: `Artikel dan gambar berhasil dihapus` });

    } catch (error) {

        return jsonResponse({ msg: "internal server error" }, 500);
    }
}