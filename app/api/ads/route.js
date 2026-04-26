// app/api/ads/route.js
import { jsonResponse } from "@/lib/jsonResponse";
import Ads from "@/models/ads";

// ── GET ───────────────────────────────────────────────────────
export const GET = async () => {
    try {
        const ads = await Ads.findOne({
            order: [['createdAt', 'DESC']],
        })

        if (!ads) {
            return jsonResponse({ msg: "Data ads tidak ditemukan", data: null }, 404)
        }

        return jsonResponse({ msg: "Berhasil", data: ads }, 200)
    } catch (error) {
        console.error('Error fetching ads:', error)
        return jsonResponse({ msg: "Error fetching ads" }, 500)
    }
}

// ── POST ──────────────────────────────────────────────────────
export const POST = async (req) => {
    try {
        const body = await req.json()

        const { header, sidebar, inContent, footer, directLink } = body

        const transaction = await Ads.sequelize.transaction()

        try {
            const newAds = await Ads.create(
                {
                    header:     header     || null,
                    sidebar:    sidebar    || null,
                    inContent:  inContent  || null,
                    footer:     footer     || null,
                    directLink: directLink || null,
                },
                { transaction }
            )

            await transaction.commit()

            return jsonResponse(
                { msg: "Ads berhasil disimpan", data: { id: newAds.id } },
                201
            )
        } catch (error) {
            await transaction.rollback()
            console.error('Error creating ads:', error)
            return jsonResponse({ msg: "Error creating ads" }, 500)
        }
    } catch (error) {
        console.error('Error processing request:', error)
        return jsonResponse({ msg: "Error processing request" }, 500)
    }
}