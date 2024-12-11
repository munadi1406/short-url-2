import { jsonResponse } from "@/lib/jsonResponse";
import { Telegram } from "@/models/telegram";

// Menangani berbagai metode HTTP untuk CRUD
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  try {

    const page = parseInt(searchParams.get('page')) || 1;  // Default halaman 1
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;  // Default 10 item per halaman


    const lastCreatedAt = searchParams.get('lastCreatedAt') || null;  // Mendapatkan createdAt dari item terakhir yang dimuat sebelumnya
    const all = searchParams.get('all');  
    if(all){
      const allData = await Telegram.findAll({attributes:['id_chanel','title'],order:[['createdAt','desc']]})
      return jsonResponse({msg:"success",data:allData},200)
    }

    const whereCondition = {};

    // Jika lastCreatedAt diberikan, filter untuk mendapatkan data yang lebih baru dari 'lastCreatedAt'
    if (lastCreatedAt) {
      whereCondition.createdAt = {
        [Op.lt]: new Date(lastCreatedAt),  // Mengambil data yang createdAt-nya lebih kecil dari 'lastCreatedAt'
      };
    }

    // Ambil data dengan kondisi dan urutan DESC berdasarkan createdAt
    const telegrams = await Telegram.findAll({
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
        lastCreatedAt: lastLink ? lastLink.createdAt : null,  // Kirimkan createdAt item terakhir
      }
    }, 200)
  } catch (error) {
    console.error("Error fetching data:", error.msg);
    return jsonResponse({
      statusCode: 500,
      msg: "Failed to fetch data",
    }, 500);
  }
}

export async function POST(req) {
  try {
    const { title, idChanel } = await req.json();

    if (!title || !idChanel) {
      return new Response(
        JSON.stringify({ success: false, msg: "Title and id_chanel are required" }),
        { status: 400 }
      );
    }

    await Telegram.create({
      title,
      id_chanel: idChanel,
    });


    return jsonResponse({ msg: "Data Berhasil Disimpan" }, 200)
  } catch (error) {
    console.error("Error in POST:", error);
    return jsonResponse({ msg: "Internal Server Error" }, 500);
  }
}

export async function PUT(req) {
  try {
    const { id, title, id_chanel } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, msg: "ID is required to update" }),
        { status: 400 }
      );
    }

    const updatedTelegram = await Telegram.update(
      { title, id_chanel },
      { where: { id } }
    );

    if (updatedTelegram[0] === 0) {
      return new Response(
        JSON.stringify({ success: false, msg: "Telegram not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, msg: "Telegram updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT:", error);
    return jsonResponse({ msg: "Internal Server Error" }, 500);
  }
}

export async function DELETE(req) {

  const { searchParams } = new URL(req.url);
  const chanelId = searchParams.get('id')
  try {
    await Telegram.destroy({ where: { id: chanelId } });

    return jsonResponse({ msg: "Data Berhasil Dihapus" }, 200);
  } catch (error) {
    console.log(error)
    return jsonResponse({ msg: "Internal Server Error" }, 500);
  }
}
