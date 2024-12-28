import { jsonResponse } from "@/lib/jsonResponse";
import { Genre } from "@/models/genre";
import Post from "@/models/post";
import { Tag } from "@/models/tag";
import { Op } from "sequelize";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    try {

        const searchQuery = searchParams.get('search') || ''; // Query pencarian

        

        // Ambil data dengan kondisi dan urutan DESC berdasarkan createdAt
        const posts = await Post.findAll({
            where: {
                [Op.or]: [
                  { title: { [Op.like]: `%${searchQuery}%` } }, // Pencarian di kolom title
                  { description: { [Op.like]: `%${searchQuery}%` } }, // Pencarian di kolom description
                ],
              },
            attributes: [ 'title', 'description',  'image', 'slug','createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 8,
            include: [
                {
                    model: Genre,
                    as: 'genres',
                    attributes: [ 'name'],
                    through: { attributes: [] },
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: [ 'name'],
                    through: { attributes: [] },
                },
            ],
        });

        return jsonResponse(
            {
                data: posts,
               
            },
            200
        );
    } catch (error) {
        console.log(error);
        return jsonResponse(
            {
                statusCode: 500,
                msg: "Failed to fetch data",
            },
            500
        );
    }
}
