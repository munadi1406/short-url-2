import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: 'dznumpskt', // Ganti dengan Cloudinary Cloud Name Anda
    api_key: '917881947716683', // Ganti dengan API Key Anda
    api_secret: process.env.CLOUDINARY_API_SECRET, // Pastikan menggunakan environment variable
});

export default cloudinary;