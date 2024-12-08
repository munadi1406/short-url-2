import { NextResponse } from 'next/server';
import axios from 'axios';
import { load } from 'cheerio';
import { sequelize } from '@/lib/sequelize'; // Pastikan jalur ini benar
import Url from '@/models/urls';
import Link from '@/models/links';
import { nanoid } from 'nanoid';
import { getUser } from '@/lib/dal';
import { Op } from "sequelize";  // Operator Sequelize untuk query kondisi


// Fungsi untuk mengambil title dari metadata link
async function getTitleFromUrl(url) {
    try {
        const response = await axios.get(url, { timeout: 10000 });
        const $ = load(response.data);
        const title = $('title').text().trim() || 'No title found';
        return title;
    } catch (error) {
        console.error(`Error fetching title for ${url}:`, error.message);
        return 'Error fetching title';
    }
}

export async function POST(req) {
    const transaction = await sequelize.transaction(); // Mulai transaksi
    try {
        // Ambil data dari body request
        const { title, link } = await req.json();
        const { id } = await getUser();
        const userId = id;

        // Pisahkan semua link ke dalam array
        const links = link.split(/[\n,]+/).map((l) => l.trim()).filter(Boolean);
        console.log(links.length)
        // Jika hanya satu link, langsung masukkan ke tabel `links`
        if (links.length === 1) {
            const singleLink = links[0];
 
            try {
                new URL(singleLink); // Validasi URL
                const linkTitle = await getTitleFromUrl(singleLink); // Ambil title dari link
                const shortUrl = nanoid(10); // Generate short_url untuk link

                // Simpan link ke tabel 'links'
                const linkEntry = await Link.create(
                    {
                        idurls: null, // Tidak terkait dengan URL utama
                        link: singleLink,
                        title: linkTitle,
                        short_url: shortUrl,
                        idUsers: userId || null, // Hubungkan ke user jika ada
                    },
                    { transaction }
                );

                // Commit transaksi
                await transaction.commit();

                return NextResponse.json({
                    message: 'Success',
                    data: {
                        links: [linkEntry],
                    }, 
                });
            } catch (error) {
                console.error(`Invalid URL: ${singleLink}`, error.message);
                throw new Error('Invalid single link');
            }
        }

        // Jika ada lebih dari satu link, simpan ke tabel `urls` dan `links`
        const urlEntry = await Url.create(
            {
                title,
                short_url: nanoid(10), // Generate short_url secara otomatis
                userId: userId || null, // Jika tidak ada userId, biarkan null
            },
            { transaction }
        );

        const linkEntries = await Promise.all(
            links.map(async (singleLink) => {
                try {
                    new URL(singleLink); // Validasi URL
                    const linkTitle = await getTitleFromUrl(singleLink); // Ambil title dari link
                    const shortUrl = nanoid(10); // Generate short_url untuk link

                    // Simpan setiap link ke tabel 'links'
                    return await Link.create(
                        {
                            idurls: urlEntry.id, // Hubungkan dengan id di tabel 'urls'
                            link: singleLink,
                            title: linkTitle,
                            short_url: shortUrl,
                            idUsers: userId || null, // Hubungkan ke user jika ada
                        },
                        { transaction }
                    );
                } catch (error) {
                    console.error(`Invalid URL: ${singleLink}`, error.message);
                    return null; // Abaikan link yang tidak valid
                }
            })
        );

        // Filter link yang berhasil disimpan
        const savedLinks = linkEntries.filter(Boolean);

        // Commit transaksi
        await transaction.commit();

        return NextResponse.json({
            message: 'Success',
            data: {
                url: urlEntry,
                links: savedLinks,
            },
        });
    } catch (error) {
        // Rollback transaksi jika terjadi kesalahan
        await transaction.rollback();
        console.error('Error processing POST request:', error.message);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}



export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get('page')) || 1;  // Default halaman 1
        const pageSize = parseInt(searchParams.get('pageSize')) || 10;  // Default 10 item per halaman
        const {id} = await getUser();  // ID user yang ingin difilter
        const idUser = id

        const lastCreatedAt = searchParams.get('lastCreatedAt') || null;  // Mendapatkan createdAt dari item terakhir yang dimuat sebelumnya

        const whereCondition = {
            idUsers: idUser,  // Menyaring berdasarkan ID User
        };

        // Jika lastCreatedAt diberikan, filter untuk mendapatkan data yang lebih baru dari 'lastCreatedAt'
        if (lastCreatedAt) {
            whereCondition.createdAt = {
                [Op.lt]: new Date(lastCreatedAt),  // Mengambil data yang createdAt-nya lebih kecil dari 'lastCreatedAt'
            };
        }

        // Ambil data dengan kondisi dan urutan DESC berdasarkan createdAt
        const links = await Link.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']],  // Urutkan berdasarkan createdAt secara descending
            limit: pageSize,  // Batasi jumlah item yang diambil per halaman
        });

        // Jika ada data yang ditemukan, ambil createdAt item terakhir sebagai referensi untuk page berikutnya
        const lastLink = links.length > 0 ? links[links.length - 1] : null;

        return NextResponse.json({
            statusCode: 200,
            data: links,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalItems: links.length,
                lastCreatedAt: lastLink ? lastLink.createdAt : null,  // Kirimkan createdAt item terakhir
            },
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return NextResponse.json({
            statusCode: 500,
            message: "Failed to fetch data",
        }, { status: 500 });
    }
}