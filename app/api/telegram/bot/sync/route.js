import { jsonResponse } from "@/lib/jsonResponse";
import { Telegram } from "@/models/telegram";
import axios from "axios";


export async function GET() {
    try {
        const response = await axios.get(`${process.env.ENDPOINT_TELEGRAM_API}${process.env.API_KEY_TELEGRAM}/getUpdates`);
        const updates = response.data.result;
        console.log({updates})

        const channels = updates
            .filter(update => update.channel_post && update.channel_post.chat?.type === 'channel')
            .map(update => ({
                title: update.channel_post.chat.title,
                id_chanel: update.channel_post.chat.id
            }));
        console.log({channels})
        const uniqueChannels = Array.from(
            new Map(channels.map(channel => [channel.id_chanel, channel])).values()
        );

        // Fetch all existing channels from DB
        const existingChannels = await Telegram.findAll({ attributes: ['id_chanel', 'title'] });
        const existingMap = new Map(existingChannels.map(c => [Number(c.id_chanel), c.title]));

        const newChannels = [];
        const channelsToUpdate = [];

        uniqueChannels.forEach(channel => {
            const existingTitle = existingMap.get(Number(channel.id_chanel));

            if (existingTitle === undefined) {
                // New channel
                newChannels.push(channel);
            } else if (existingTitle !== channel.title) {
                // Title changed → update needed
                channelsToUpdate.push(channel);
            }
        });

        // Insert new
        if (newChannels.length > 0) {
            await Telegram.bulkCreate(newChannels, {
                ignoreDuplicates: true
            });
        }

        // Update existing title if changed
        for (const channel of channelsToUpdate) {
            await Telegram.update(
                { title: channel.title },
                { where: { id_chanel: channel.id_chanel } }
            );
        }

        // Build response message
        const newChannelInfo = newChannels.map(c => `+ ${c.title}`).join("\n");
        const updatedChannelInfo = channelsToUpdate.map(c => `~ ${c.title}`).join("\n");

        const message = 
            `${newChannels.length > 0 ? `✅ ${newChannels.length} channel baru:\n${newChannelInfo}\n` : ''}` +
            `${channelsToUpdate.length > 0 ? `✏️ ${channelsToUpdate.length} channel diupdate:\n${updatedChannelInfo}` : ''}` ||
            "Tidak ada perubahan.";

        return jsonResponse({ msg: `Sinkronisasi selesai.\n\n${message}` }, 200);

    } catch (error) {
        console.error("Error during synchronization:", error);
        return jsonResponse({ msg: "Sinkronisasi gagal" }, 500);
    }
}


