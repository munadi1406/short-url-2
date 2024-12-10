import { jsonResponse } from "@/lib/jsonResponse"
import {Link} from "@/models/links"
import {Url} from "@/models/urls"


export async function GET(req,{params}) {
    const {slug} = await params
    try {
        const fromKategori = await Url.findOne({where:{short_url:slug}})
        if(fromKategori){
            return jsonResponse({url:`${process.env.ENDPOINT_URL}/k/${slug}`},200)
        }
        const fromLink = await Link.findOne({
            attributes:['link'],
            where:{
                short_url:slug
            },
            
        })
        if(fromLink){
            return jsonResponse({url:fromLink.link},200)
        }
        return jsonResponse({msg:"Link tidak ditemukan"},404)
        
       
    } catch (error) {
        console.log(error);
        return jsonResponse({msg:"internal server error"},500)
        
    }
}