import { jsonResponse } from "@/lib/jsonResponse";
import { Telegram } from "@/models/telegram";
import axios from "axios";


export async function GET() {
    try {
        // URL untuk memanggil API getUpdates
        const response = await axios.get(`${process.env.ENDPOINT_TELEGRAM_API}${process.env.API_KEY_TELEGRAM}/getUpdates`);

        // Ambil hasil data dari API
        const updates = response.data.result;

        // Filter hanya yang memiliki 'chat' dengan type 'channel'
        const channels = updates
            .filter(update => update.channel_post && update.channel_post.chat && update.channel_post.chat.type === 'channel')
            .map(update => ({
                title: update.channel_post.chat.title,
                id_chanel: update.channel_post.chat.id
            }));

        // Hapus duplikasi berdasarkan id_chanel menggunakan Map
        const uniqueChannels = Array.from(
            new Map(channels.map(channel => [channel.id_chanel, channel])).values()
        );

        // Ambil id_chanel yang sudah ada di database
        const existingChannels = await Telegram.findAll({ attributes: ['id_chanel'] });
        const existingIds = new Set(existingChannels.map(channel => Number(channel.id_chanel))); // Konversi ke number
        

        // Filter channel baru yang belum ada di database
        const newChannels = uniqueChannels.filter(channel => !existingIds.has(Number(channel.id_chanel)));

        // Bulk insert hanya channel baru
        if (newChannels.length > 0) {
            await Telegram.bulkCreate(newChannels, {
                ignoreDuplicates: true
            });
        }

        // Membuat response dengan jumlah dan detail channel baru
        const newChannelInfo = newChannels.map(channel => `Title: ${channel.title}`).join("\n");
        const message = newChannels.length > 0
            ? `Sinkronisasi berhasil, ${newChannels.length} channel baru ditambahkan:\n${newChannelInfo}`
            : "Sinkronisasi berhasil, tidak ada channel baru.";

        return jsonResponse({ msg: message }, 200);
    } catch (error) {
        console.error("Error during synchronization:", error);
        return jsonResponse({ msg: "Sinkronisasi gagal" }, 500);
    }
}

