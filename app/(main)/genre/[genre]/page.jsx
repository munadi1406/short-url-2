import MainCard from '@/components/main/MainCard';
import { Genre } from '@/models/genre';
import Post from '@/models/post';
import { Tag } from '@/models/tag';
import Link from 'next/link';
import React from 'react';

const getData = async (genre) => {
    const data = await Genre.findOne({
        where: {
            name: genre,
        },
        include: [
            {
                model: Post,
                as: 'posts',
                through: { attributes: [] },
                include: [
                    {
                        model: Genre,
                        as: 'genres',
                        attributes: ['name'],
                    },
                    {
                        model: Tag,
                        as: 'tags',
                        attributes: ['name'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            },
        ],
    });
    return data;
};
export async function generateMetadata({ params }) {
    const genre = decodeURIComponent(params.genre);
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL || 'http://localhost:3000';
    const title = `Drama Korea ${genre} - Drakoran `;
    const description = `Drama Korea ${genre} - Drakoran - Download Drama Korea Subtitle Indonesia `;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${endpoint}/genre/${genre}`,
            type: 'website',
            siteName: 'Drakoran',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            site: '@Drakoran',
        },
    };
}

export default async function Page({ params, searchParams }) {
    const param = await params;
    const genre = decodeURIComponent(param.genre)
    const limit = 10; // Menentukan batasan data per halaman

    const searchParamsResolved = await searchParams; // Awaiting searchParams
    const page = parseInt(searchParamsResolved.page || '1', 10); // Getting the page number or default to 1

    // Ambil data berdasarkan genre
    const genreData = await getData(genre);

    if (!genreData || genreData.posts.length === 0) {
        // Jika tidak ada data ditemukan
        return (
            <div className="py-4">
                <h3 className="text-lg font-semibold text-gray-700">
                    {genre}
                </h3>
                <p className="text-gray-500">Tidak ada postingan yang ditemukan untuk kategori ini.</p>
            </div>
        );
    }

    const { posts } = genreData;
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / limit); // Menghitung total halaman
    const startPage = Math.max(1, page - 2); // Menentukan halaman awal yang ditampilkan
    const endPage = Math.min(totalPages, page + 2); // Menentukan halaman akhir yang ditampilkan

    return (
        <>
            <h3 className="text-2xl font-semibold text-gray-700 capitalize">
                {genre}
            </h3>

            <div
                className="py-4 grid md:grid-cols-4 grid-cols-2 gap-4 w-full"
                itemScope
                itemType="https://schema.org/ItemList"
            >
                {posts.slice((page - 1) * limit, page * limit).map((post, i) => (
                    <MainCard post={post} key={i} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2">
                    {page > 1 && (
                        <Link
                            href={`/?page=${page - 1}`}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Previous
                        </Link>
                    )}

                    {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                        const pageNumber = startPage + index;
                        return (
                            <Link
                                key={pageNumber}
                                href={`/?page=${pageNumber}`}
                                className={`px-4 py-2 rounded-md ${pageNumber === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {pageNumber}
                            </Link>
                        );
                    })}

                    {page < totalPages && (
                        <Link
                            href={`/?page=${page + 1}`}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}
        </>
    );
}
