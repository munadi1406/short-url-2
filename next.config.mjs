/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['sequelize'],
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
        ];
    },
}

export default nextConfig;
