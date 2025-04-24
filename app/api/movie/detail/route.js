

import { jsonResponse } from "@/lib/jsonResponse";





export async function GET(req) {
  const { searchParams } = new URL(req.url);
  try {
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    let data

    if (type === "tv") {
      const response = await fetch(`${process.env.ENDPOINT_TMBD}tv/${Number(id)}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`

        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TV data');
      }

      data = await response.json();
    } else {
      const response = await fetch(`${process.env.ENDPOINT_TMBD}movie/${Number(id)}`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch Movie data');
      }

      data = await response.json();
    }
    console.log({data})
    return jsonResponse({ msg: "success", data: data }, 200)
  } catch (error) {
    console.log(error)
    return jsonResponse({ msg: "internal server error" }, 500)
  }
}