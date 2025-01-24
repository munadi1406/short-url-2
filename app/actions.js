
'use server'
import { isAdmin } from "@/lib/dal";
import axios from "axios";
import { cookies } from "next/headers";

export const createCookie = async (asd) => {
    try {
        // Ambil cookieStore snapshot
        const cookieStore = await cookies();

        // Periksa apakah user adalah admin
        const userCheck = await isAdmin();
      
        if (userCheck) return;

        // Ambil accessToken dari cookieStore snapshot
        let accessToken = cookieStore.get("accessToken")?.value;
    

        // Kirim accessToken ke API untuk membuat sesi
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/create-session`, {
            accessToken, // Kirim token saat ini
        });

        // Dapatkan token baru dari response
        const newAccessToken = response.data.data.accessToken || "";
       

        // Simpan token baru di cookie
        await cookies().set("accessToken", newAccessToken, {
            path: "/", // Berlaku untuk seluruh situs
            httpOnly: true, // Tidak dapat diakses via JavaScript
            secure: process.env.NODE_ENV === "production", // Hanya dikirim melalui HTTPS jika production
            sameSite: "Strict", // Cookie hanya dikirim untuk domain yang sama
        });

        // Gunakan token baru untuk return atau keperluan berikutnya
        return { 
            sessionId: response.data.data.sessionId, 
            accessToken: newAccessToken // Pastikan selalu menggunakan token terbaru
        };
    } catch (error) {
       
        throw error; // Throw error agar error bisa di-handle di tempat lain
    }
};
