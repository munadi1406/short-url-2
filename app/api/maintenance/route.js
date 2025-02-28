import { jsonResponse } from "@/lib/jsonResponse";
import { Maintenance } from "@/models/maintenance";

// Fungsi untuk menangani permintaan PUT untuk memperbarui status maintenance
export async function PUT(request) {
  try {
    const { id, status } = await request.json();

    // Validasi jika data yang diperlukan tidak ada
    if (!id || !status) {
      return new Response("ID and status are required", { status: 400 });
    }

    // Mencari maintenance berdasarkan ID
    const maintenance = await Maintenance.findByPk(id);

    if (!maintenance) {
      return new Response("Maintenance not found", { status: 404 });
    }

    // Mengupdate status maintenance
    maintenance.status = status;
    await maintenance.save();

    // Mengembalikan response sukses
    return new Response(JSON.stringify(maintenance), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response("Failed to update maintenance", { status: 500 });
  }
}


export async function GET(request) {
  try {
    // Mencari satu data maintenance (karena hanya ada satu baris)
    const maintenance = await Maintenance.findOne();

    // Jika tidak ada data maintenance ditemukan
    if (!maintenance) {
      return new Response("Maintenance status not found", { status: 404 });
    }

    
    return jsonResponse({data:maintenance},200)
  } catch (error) {
    console.error(error);
    return new Response("Failed to retrieve maintenance status", { status: 500 });
  }
}
