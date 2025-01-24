
import { jsonResponse } from "@/lib/jsonResponse";
import { Link } from "@/models/links";
import Post from "@/models/post";
import { Url } from "@/models/urls";

export async function GET(req) {
    try {
        // Hitung jumlah URL
        const urlCount = await Url.count();

        // Hitung jumlah total link
        const linkCount = await Link.count();
        const postCount = await Post.count();

        return jsonResponse({
            msg: 'Statistik berhasil diambil',
            data: {
                totalUrls: urlCount,
                totalLinks: linkCount,
                totalPosts: postCount,
            },
        }, 200);
    } catch (error) {
        console.error('Error fetching statistics:', error.message);
        return jsonResponse({ error: 'Failed to fetch statistics' }, 500);
    }
}
