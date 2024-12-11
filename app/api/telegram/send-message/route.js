import axios from "axios";


export async function POST(req) {
    try {
        const { message, hyperlinks, channelIds } = await req.json();

        // Validasi input
        if (!message || !Array.isArray(channelIds) || channelIds.length === 0) {
            return new Response(JSON.stringify({ msg: "Pesan dan daftar channel harus diisi" }), { status: 400 });
        }

        // Kirim pesan ke setiap channel yang dipilih
        const responses = await Promise.all(
            channelIds.map(async (chat_id) => {
                const url = `${process.env.ENDPOINT_TELEGRAM_API}${process.env.API_KEY_TELEGRAM}/sendMessage`;

                let payload = {
                    chat_id,
                    text: message,
                    parse_mode: "HTML", // Mendukung HTML formatting dalam pesan
                };

                // Jika ada hyperlink, tambahkan inline keyboard
                if (hyperlinks) {
                    payload.reply_markup = {
                        inline_keyboard: [
                            [
                                {
                                    text: "Open", // Teks tombol
                                    url: hyperlinks, // URL yang akan dibuka saat tombol diklik
                                },
                            ],
                        ],
                    };
                }

                try {
                    const response = await axios.post(url, payload);
                    return { chat_id, success: true, response: response.data };
                } catch (error) {
                    console.error(`Failed to send message to chat_id ${chat_id}:`, error.message);
                    return { chat_id, success: false, error: error.message };
                }
            })
        );

        // Hitung jumlah pesan sukses dan gagal
        const successCount = responses.filter((res) => res.success).length;
        const failedChannels = responses
            .filter((res) => !res.success)
            .map((res) => ({ chat_id: res.chat_id, error: res.error }));

        // Berikan respon berdasarkan hasil
        return new Response(
            JSON.stringify({
                msg: `${successCount} pesan berhasil dikirim.`,
                failedChannels: failedChannels,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in sendMessage API:", error.message);
        return new Response(JSON.stringify({ msg: "Terjadi kesalahan saat mengirim pesan", error: error.message }), {
            status: 500,
        });
    }
}

