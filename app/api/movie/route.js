

import { jsonResponse } from "@/lib/jsonResponse";





export async function GET(req){
    const { searchParams } = new URL(req.url);
    try {
        const search = searchParams.get('search')
      
        const response = await fetch(
            `${process.env.ENDPOINT_TMBD}search/multi?query=${encodeURIComponent(search)}&language=id-ID`,
            {
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
              },
              cache: 'no-store', // untuk mastiin fetch gak nge-cache
            }
          );
      
          if (!response.ok) {
            throw new Error('Failed to fetch from TMDB');
          }
      
          const data = await response.json();
          console.log({data:data.results})
     
        return jsonResponse({msg:"success",data:data.results},200)
    } catch (error) {
        console.log(error)
        return jsonResponse({msg:"internal server error"},500)
    }
}