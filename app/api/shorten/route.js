import { NextResponse } from 'next/server';
import axios from 'axios';
import { load } from 'cheerio';
import { sequelize } from '@/lib/sequelize'; // Pastikan jalur ini benar
import { Url } from '@/models/urls';
import { Link } from '@/models/links';
import { nanoid } from 'nanoid';
import { getUser } from '@/lib/dal';
import { Op } from "sequelize";  // Operator Sequelize untuk query kondisi
import validator from 'validator';
import { jsonResponse } from '@/lib/jsonResponse';


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
    const { title, link } = await req.json();
    const { id } = await getUser();
    try {
        // Ambil data dari body request
        const userId = id;

        // Pisahkan semua link ke dalam array
        const links = link.split(/[\n,]+/).map((l) => l.trim()).filter(Boolean);

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

        return jsonResponse({
            data: {
                url: urlEntry,
                links: savedLinks,
            },
        }, 200)
    } catch (error) {
        // Rollback transaksi jika terjadi kesalahan
        await transaction.rollback();
        console.error('Error processing POST request:', error.message);
        return jsonResponse({ error: 'Failed to process request' }, 500)

    }
}



export async function GET(req) {
    const { searchParams } = new URL(req.url);

    try {
        const page = parseInt(searchParams.get('page')) || 1;  // Default halaman 1
        const pageSize = parseInt(searchParams.get('pageSize')) || 10;  // Default 10 item per halaman
        const { id } = await getUser();  // ID user yang ingin difilter
        const idUser = id;

        const lastCreatedAt = searchParams.get('lastCreatedAt') || null;  // Mendapatkan createdAt dari item terakhir yang dimuat sebelumnya
        const category = searchParams.get('category');  // Mendapatkan kategori (null atau true)
        
        const whereCondition = {};

        // Menentukan filter berdasarkan kategori dan apakah itu berasal dari Url atau Link
        if (category === 'true') {
            // Jika kategori adalah 'true', kita query Url dengan menggunakan userId
            whereCondition.userId = idUser;  // Filter berdasarkan userId pada Url model
        } else {
            // Jika kategori bukan 'true', kita query Link dengan menggunakan idUsers
            whereCondition.idUsers = idUser;  // Filter berdasarkan idUsers pada Link model
            whereCondition.idurls = {
                [Op.is]: null,  
            };
        }

        // Jika lastCreatedAt diberikan, filter untuk mendapatkan data yang lebih baru dari 'lastCreatedAt'
        if (lastCreatedAt) {
            whereCondition.createdAt = {
                [Op.lt]: new Date(lastCreatedAt),  // Mengambil data yang createdAt-nya lebih kecil dari 'lastCreatedAt'
            };
        }

        let queryOptions = {
            where: whereCondition,
            order: [['createdAt', 'DESC']],  // Urutkan berdasarkan createdAt secara descending
            limit: pageSize,  // Batasi jumlah item yang diambil per halaman
        };
     

        if (category === 'true') {
            // Jika kategori adalah 'true', kita query Url dan include Link
            queryOptions.include = {
                model: Link,
                as: 'links',
                required: true,  // Optional, tapi jika ingin memastikan ada Link, bisa menambahkannya
            };
            const urls = await Url.findAll(queryOptions);  // Mengambil data dari Url
            return jsonResponse({
                data: urls,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalItems: urls.length,
                    lastCreatedAt: urls.length > 0 ? urls[urls.length - 1].createdAt : null,  // Kirimkan createdAt item terakhir
                }
            }, 200);
        } else {
            // Jika kategori bukan 'true', kita query hanya Link
            const links = await Link.findAll(queryOptions);  // Mengambil data dari Link
            const lastLink = links.length > 0 ? links[links.length - 1] : null;  // Mendapatkan item terakhir untuk pagination

            return jsonResponse({
                data: links,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalItems: links.length,
                    lastCreatedAt: lastLink ? lastLink.createdAt : null,  // Kirimkan createdAt item terakhir
                }
            }, 200);
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return NextResponse.json({
            statusCode: 500,
            message: "Failed to fetch data",
        }, { status: 500 });
    }
}






// Helper function for sending JSON responses

// Helper function for validation
const validateFields = ({ title, link, id }) => {
    const errors = [
        { condition: !title || !link || !id, message: "All fields are required." },
        { condition: !validator.isLength(title, { min: 3 }), message: "Title must be at least 3 characters long." },
        { condition: !validator.isURL(link), message: "Invalid URL format." },
        { condition: !validator.isUUID(id), message: "Invalid ID format. Must be a valid UUID." },
    ];

    const error = errors.find(err => err.condition);
    return error ? error.message : null;
};

export async function PUT(req) {
    const { title, link, id } = await req.json();
    try {


        // Validate input fields
        const validationError = validateFields({ title, link, id });
        if (validationError) {
            return jsonResponse({ msg: validationError }, 400);
        }
        await Link.update(
            { title, link },
            { where: { id } }
        );

        return jsonResponse({ msg: "Link Berhasil Diupdate" }, 200);
    } catch (error) {
        return jsonResponse({ msg: "Internal Server Error." }, 500);
    }
}


export async function DELETE(req) {
    const { id } = await getUser();
    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get('id')
    try {

        let idUsers
        const checkOwnerLink = await Link.findByPk(linkId, { attributes: ['idUsers'] })
        if (checkOwnerLink) {
            idUsers = checkOwnerLink.idUsers
        }
        const checkOwnerUrls = await Url.findByPk(linkId, { attributes: ['userid'] })
    
        if (checkOwnerUrls) {
            idUsers = checkOwnerUrls.userid
        }
        

        const checkIsUrl = await Url.findByPk(linkId);
        if (checkIsUrl) {
            await Url.destroy({ where: { id: linkId } })
        }
        await Link.destroy({ where: { id: linkId } });

        return jsonResponse({ msg: "Link Berhasil Dihapus" }, 200);
    } catch (error) {
        console.log(error)
        return jsonResponse({ msg: "Internal Server Error" }, 500);
    }
}
