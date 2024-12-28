import { jsonResponse } from "@/lib/jsonResponse";
import Post from "@/models/post";

export async function POST(req) {
    try {
        const { postId, status } = await req.json();

        if (!postId || !status) {
            return jsonResponse(
                { msg: 'Post ID and episodes are required' },
                400
            );
        }
        await Post.update({ status }, { where: { id: postId } })


        return jsonResponse({ msg: `Status berhasil dirubah ke ${status}` }, 200);

    } catch (error) {
        console.error(error);
        return jsonResponse({ msg: 'Error processing the request' }, 500);
    }
}