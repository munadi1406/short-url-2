import { jsonResponse } from "@/lib/jsonResponse";
import Episode from "@/models/episode";

export const DELETE = async (req, res) => {
    const { searchParams } = new URL(req.url);
    try {
      // Ambil ID dari query params
      const id = searchParams.get('id')
  
      // Validasi jika ID tidak diberikan
      if (!id) {
        return jsonResponse({ msg: "Post ID is required" }, 400);
      }
      // Cari post berdasarkan ID
      const post = await Episode.findOne({ where: { id } });
  
      // Jika post tidak ditemukan
      if (!post) {
        return jsonResponse({ msg: "Post not found" }, 404);
      }
  
    
     
  
      await Episode.destroy({ where: { id } });
  
  
  
      return jsonResponse({ msg: "Episode deleted successfully" }, 200);
  
    } catch (error) {
      console.error('Error processing delete request:', error);
      return jsonResponse({ msg: "Error processing delete request" }, 500);
    }
  };