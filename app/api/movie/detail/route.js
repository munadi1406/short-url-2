import { jsonResponse } from "@/lib/jsonResponse";
import axios from "axios";




export async function GET(req) {
    const { searchParams } = new URL(req.url);
    try {
        const id = searchParams.get('id')
        const type = searchParams.get('type')
        let data

        if (type === "tv") {
            data = await axios.get(`${process.env.ENDPOINT_TMBD}tv/${Number(id)}`, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            })
        } else {
            data = await axios.get(`${process.env.ENDPOINT_TMBD}movie/${Number(id)}`, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            })
        }

        return jsonResponse({ msg: "success", data: data.data }, 200)
    } catch (error) {
        console.log(error)
        return jsonResponse({ msg: "internal server error" }, 500)
    }
}