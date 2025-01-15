import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { jsonResponse } from "@/lib/jsonResponse";
import  cloudinary  from '@/lib/cloudinary';
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/");

export const POST = async (req) => {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = body.file || null;

    if (file) {
        const fileBuffer = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileBuffer).toString('base64');

        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.type};base64,${fileBase64}`,
          {
            folder: 'posts', // Folder di Cloudinary
            public_id: `post_${uuidv4()}`, // Public ID unik untuk file
          } 
        );
        console.log(uploadResult)
       


        return jsonResponse({
            success: true,
            url: uploadResult.secure_url,
        }, 200)
    } else {
        return jsonResponse({ msg: "Upload image failed" }, 404);
    }
};


export const DELETE = async (req) => {
    // Mendapatkan nama file dari URL parameter (misalnya /uploads/filename.jpg)
    const { searchParams } = new URL(req.url);
  
    const fileName = searchParams.get('path')
    
    if (!fileName) {
        return jsonResponse({ msg: "File name not provided" }, 400);
    }
 
    

    try {
        // Cek apakah file ada
        
            // Hapus file
           c
            return jsonResponse({ success: true, msg: "File deleted successfully" }, 200);
      
    } catch (error) {
        console.error(error);
        return jsonResponse({ msg: "Failed to delete file" }, 500);
    }
};