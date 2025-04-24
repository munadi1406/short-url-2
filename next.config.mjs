/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['sequelize','axios'],
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'image.tmdb.org',
            pathname: '/t/p/**', // Mendukung semua path dari TMDb
          },
          {
          protocol: 'https',
          hostname: 'res.cloudinary.com', // Tambahkan domain Cloudinary
         
        },
        ],
        localPatterns: [
            {
              pathname: '/uploads/**',
              search: '',
            },
          ],
      },
    async rewrites() {
        return [
            {
                source: '/k/:slug', // URL pendek yang diakses pengguna
                destination: '/kategori/:slug', // URL asli yang digunakan di aplikasi Anda
            },
            {
                source: '/l/:slug', // URL pendek yang diakses pengguna
                destination: '/link/:slug', // URL asli yang digunakan di aplikasi Anda
            },
            {
                source: '/a/:slug', // URL pendek yang diakses pengguna
                destination: '/article/:slug', // URL asli yang digunakan di aplikasi Anda
            },
        ];
    },
}

export default nextConfig;
