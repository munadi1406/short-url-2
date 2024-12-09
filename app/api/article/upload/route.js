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
