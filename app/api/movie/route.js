import { jsonResponse } from "@/lib/jsonResponse";
import axios from "axios";




export async function GET(req){
    const { searchParams } = new URL(req.url);
    try {
        const search = searchParams.get('search')
      
        const data = await axios.get(`${process.env.ENDPOINT_TMBD}search/multi?query=${encodeURIComponent(search)}&language=id-ID`,{
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        })
     
        return jsonResponse({msg:"success",data:data.data},200)
    } catch (error) {
        console.log(error)
        return jsonResponse({msg:"internal server error"},500)
    }
}