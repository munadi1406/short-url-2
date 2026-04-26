import MainCard from '@/components/main/MainCard';
import { Genre } from '@/models/genre';
import Post from '@/models/post';
import { Tag } from '@/models/tag';
import Setting from '@/models/settings';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const getData = async (tag) => {
    const data = await Tag.findOne({
        where: { name: tag },
        include: [
            {
                model: Post,
                as: 'posts',
                through: { attributes: [] },
                where: { status: "publish" },
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
            },
        ],
        order: [[{ model: Post, as: 'posts' }, 'updatedAt', 'DESC']],
    });
    return data;
};

const getSetting = async () => {
    try {
        const setting = await Setting.findOne({
            order: [['createdAt', 'DESC']],
        })
        return setting || null
    } catch (error) {
        return null
    }
}

export async function generateMetadata({ params }) {
    const param = await params
    const tag = decodeURIComponent(param.tag);
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;

    const setting = await getSetting()

    const siteName    = setting?.namaWebsite || 'Lyco'
    const favicon     = setting?.favicon     || '/favicon.ico'
    const logo        = setting?.logo        || null

    const title       = `${tag} - ${siteName}`
    const description = `Kumpulan drama dengan tag ${tag} - ${siteName}`
    const canonicalUrl = `${endpoint}tag/${tag}`

    return {
        title,
        description,
        icons: {
            icon:     favicon,
            shortcut: favicon,
            apple:    favicon,
        },
        openGraph: {
            title,
            description,
            url:      canonicalUrl,
            type:     'website',
            siteName,
            images:   logo ? [{ url: logo }] : [],
        },
        twitter: {
            card:        'summary_large_image',
            title,
            description,
            site:        `@${siteName.toLowerCase()}`,
            images:      logo ? [logo] : [],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export default async function TagPage({ params, searchParams }) {
    const param = await params;
    const tag = decodeURIComponent(param.tag);
    const limit = 12;

    const searchParamsResolved = await searchParams || {};
    const page = parseInt(searchParamsResolved.page || 1);

    const [data, setting] = await Promise.all([
        getData(tag),
        getSetting(),
    ])

    const siteName = setting?.namaWebsite || 'Lyco'
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL || 'http://localhost:3000'

    if (!data || data.posts.length === 0) {
        return (
            <div className="py-8">
                <h3 className="text-2xl font-bold text-center">{tag}</h3>
                <p className="text-center text-gray-500">Tidak ada postingan yang ditemukan untuk tag ini.</p>
            </div>
        );
    }

    const posts      = data.posts.slice((page - 1) * limit, page * limit);
    const totalPosts = data.posts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startPage  = Math.max(1, page - 2);
    const endPage    = Math.min(totalPages, page + 2);

    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: posts.map((post, index) => ({
            "@type":    "ListItem",
            position:   index + 1,
            url:        `${endpoint}/${post.slug}`,
            name:       post.title,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />
            <h3 className="text-2xl font-semibold text-gray-700 capitalize">{tag}</h3>
            <div
                className="py-4 grid md:grid-cols-5 grid-cols-2 gap-4 w-full"
                itemScope
                itemType="https://schema.org/ItemList"
            >
                {posts.map((post, i) => (
                    <MainCard post={post} key={i} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2">
                    {page > 1 && (
                        <Link
                            href={`/tag/${tag}?page=${page - 1}`}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            <ChevronLeft />
                        </Link>
                    )}
                    {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                        const pageNumber = startPage + index;
                        return (
                            <Link
                                key={pageNumber}
                                href={`/tag/${tag}?page=${pageNumber}`}
                                className={`px-4 py-2 rounded-md ${
                                    pageNumber === page
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
                            href={`/tag/${tag}?page=${page + 1}`}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            <ChevronRight />
                        </Link>
                    )}
                </div>
            )}
        </>
    );
}