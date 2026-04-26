import Links from '@/components/post/Links';
import Episode from '@/models/episode';
import { Genre } from '@/models/genre';
import Post from '@/models/post';
import PostLink from '@/models/postLinks';
import { Tag } from '@/models/tag';
import Setting from '@/models/settings';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Op, Sequelize } from 'sequelize';
import SkeletonLoading from './loading';
import dynamic from 'next/dynamic';
import PostView from '@/models/postView';
const GradientCard = dynamic(() => import('@/components/main/GradientColorImage'), {
    loading: () => <SkeletonLoading />,
});
import { AspectRatio } from "@/components/ui/aspect-ratio"

const getDetail = async (slug) => {
    const data = await Post.findOne({
        where: {
            slug,
            status: 'publish',
        },
        include: [
            {
                model: Genre,
                as: 'genres',
                attributes: ['name'],
                through: { attributes: [] }
            },
            {
                model: Tag,
                as: 'tags',
                attributes: ['name'],
                through: { attributes: [] }
            },
            {
                model: Episode,
                include: { model: PostLink },
                separate: true,
                order: [['title', 'asc']]
            }
        ]
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
    const { title } = await params;

    const [data, setting] = await Promise.all([
        getDetail(title),
        getSetting(),
    ])

    if (!data) {
        return {
            title: 'Post Not Found',
            description: 'This post was not found.',
        };
    }

    const siteName = setting?.namaWebsite || 'Lyco'
   
    const favicon  = setting?.favicon     || '/favicon.ico'
    const logo     = setting?.logo        || null
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL || 'http://localhost:3000'

    const metaTitle       = `${data.title} - ${siteName}`
    const metaDescription = `${data.title} - ${data.description}` || 'No description available.'
    const postUrl         = `${endpoint}/${data.slug}`
    const imageUrl        = data.image || logo || `${endpoint}/default-image.jpg`

    return {
        title: metaTitle,
        description: metaDescription,
        icons: {
            icon:     favicon,
            shortcut: favicon,
            apple:    favicon,
        },
        openGraph: {
            title:       metaTitle,
            description: metaDescription,
            url:         postUrl,
            type:        'article',
            images:      [{ url: imageUrl }],
            siteName,
        },
        twitter: {
            card:        'summary_large_image',
            title:       metaTitle,
            description: metaDescription,
            images:      [imageUrl],
            site:        `@${siteName.toLowerCase()}`,
        },
        alternates: {
            canonical: postUrl,
        },
    };
}

const getRelatedPosts = async (genres, excludePostId) => {
    let relatedPosts = await Post.findAll({
        where: {
            id: { [Op.ne]: excludePostId },
            status: 'publish',
        },
        include: [
            {
                model: Genre,
                as: 'genres',
                where: { name: genres.map((g) => g.name) },
                through: { attributes: [] },
            },
        ],
        limit: 6,
    });

    if (relatedPosts.length === 0) {
        relatedPosts = await Post.findAll({
            where: { id: { [Op.ne]: excludePostId }, status: 'publish' },
            include: [{ model: Genre, as: 'genres', through: { attributes: [] } }],
            order: Sequelize.literal('RAND()'),
            limit: 5,
        });
    }

    return relatedPosts.sort(() => Math.random() - 0.5);
};

export default async function page({ params }) {
    const { title } = await params;

    const [data, setting] = await Promise.all([
        getDetail(title),
        getSetting(),
    ])

    if (!data) {
        return <h3 className='text-center text-3xl'>Not Found</h3>
    }

    try {
        await PostView.create({ post_id: data.id });
    } catch (error) {}

   
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL

    const episodes     = JSON.parse(JSON.stringify(data.episodes));
    const relatedPosts = await getRelatedPosts(data.genres, data.id);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${endpoint}`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Ongoing",
                "item": `${endpoint}tag/ongoing`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Completed",
                "item": `${endpoint}tag/completed`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": data.title,
                "item": `${endpoint}${data.slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="w-full flex flex-col gap-2 items-start">
                <div className="w-full space-y-6">
                    <GradientCard data={data.toJSON()} className="px-4 shadow-md rounded-md py-2" />
                    <div className="text-gray-700 border-2 w-full p-2 rounded-md">
                        <Links data={episodes} />
                    </div>
                </div>
                <div className="w-full space-y-4 mt-4">
                    <h3 className="text-lg font-semibold">Related Posts</h3>
                    <div className="w-full gap-2 grid grid-cols-3 md:grid-cols-6">
                        {relatedPosts.length > 0 ? (
                            relatedPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/${post.slug}`}
                                    className="block bg-gray-100 hover:bg-gray-200 p-3 rounded-md shadow"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <AspectRatio ratio={1 / 1} className="rounded-lg">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className='object-cover h-full w-full'
                                                quality={70}
                                                loading='lazy'
                                                sizes="(max-width: 768px) 100vw, 60vw"
                                            />
                                        </AspectRatio>
                                        <div className='w-full'>
                                            <h4 className="text-xs font-semibold text-gray-600 text-left">
                                                {post.title}
                                            </h4>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500">No related posts found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}