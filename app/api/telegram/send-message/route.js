import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import fs from "fs";
import path from "path";

const bot = new TelegramBot(process.env.API_KEY_TELEGRAM, { polling: false });

export async function POST(req) {
    try {
        const { message, hyperlinks, channelIds, poster_path } = await req.json();
        

        // Validasi input
        if (!message || !Array.isArray(channelIds) || channelIds.length === 0) {
            return new Response(JSON.stringify({ msg: "Pesan dan daftar channel harus diisi" }), { status: 400 });
        }

        // Tentukan path file lokal hanya jika poster_path ada
        let localImagePath = null;

        // Pastikan folder "images" ada
        const imagesDir = path.resolve("public/uploads/images");
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        let photoBuffer;

        
        if (poster_path) {
            localImagePath = path.resolve("public/uploads/images", path.basename(poster_path));

            if (fs.existsSync(localImagePath)) {
                // Jika file sudah ada, baca dari lokal
                photoBuffer = fs.readFileSync(localImagePath);
            } else {
                // Jika file belum ada, unduh dan simpan ke lokal
                try {
                    const imageResponse = await axios.get(`${process.env.ENDPOINT_TMBD_IMAGE}/original${poster_path}`, {
                        responseType: "arraybuffer",
                    });
                    photoBuffer = Buffer.from(imageResponse.data);
                    fs.writeFileSync(localImagePath, photoBuffer); // Simpan ke lokal
                } catch (error) {
                    console.error("Error downloading image:", error.message);
                    return new Response(JSON.stringify({ msg: "Gagal mengunduh gambar", error: error.message }), {
                        status: 500,
                    });
                }
            }
        }

        // Kirim pesan ke setiap channel yang dipilih
        const responses = await Promise.all(
            channelIds.map(async (chat_id) => {
                try {
                    const options = {
                        caption: message,
                        parse_mode: "HTML", // Mendukung HTML formatting dalam pesan
                    };

                    // Jika ada hyperlink, tambahkan inline keyboard
                    if (hyperlinks) {
                        options.reply_markup = {
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

                    if (localImagePath) {
                        // Jika ada gambar, kirim menggunakan sendPhoto
                        console.log("Sending image to chat:", localImagePath);
                        await bot.sendPhoto(chat_id, localImagePath, options);
                    } else {
                        // Jika tidak ada gambar, kirim menggunakan sendMessage
                        console.log("Sending message without image to chat:", message);
                        await bot.sendMessage(chat_id, message, options);
                    }

                    return { chat_id, success: true };
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
        console.log(error)
        return new Response(JSON.stringify({ msg: "Terjadi kesalahan saat mengirim pesan", error: error.message }), {
            status: 500,
        });
    }
}
