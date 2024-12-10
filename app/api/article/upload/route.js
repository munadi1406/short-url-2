import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { jsonResponse } from "@/lib/jsonResponse";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

export const POST = async (req) => {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = body.file || null;

    if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR);
        }

        // Generate a unique name using UUID
        const uniqueFileName = uuidv4() + path.extname(file.name);

        fs.writeFileSync(
            path.resolve(UPLOAD_DIR, uniqueFileName),
            buffer
        );


        return jsonResponse({
            success: true,
            url: '/uploads/' + uniqueFileName,
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

    const filePath = path.resolve(UPLOAD_DIR, fileName);

    try {
        // Cek apakah file ada
        if (fs.existsSync(filePath)) {
            // Hapus file
            fs.unlinkSync(filePath);
            return jsonResponse({ success: true, msg: "File deleted successfully" }, 200);
        } else {
            return jsonResponse({ msg: "File not found" }, 404);
        }
    } catch (error) {
        console.error(error);
        return jsonResponse({ msg: "Failed to delete file" }, 500);
    }
};