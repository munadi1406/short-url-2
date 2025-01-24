
import Links from '@/components/post/Links';
import Episode from '@/models/episode';
import { Genre } from '@/models/genre';
import Post from '@/models/post';
import PostLink from '@/models/postLinks';
import { Tag } from '@/models/tag';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Op, Sequelize } from 'sequelize';
import SkeletonLoading from './loading';
import dynamic from 'next/dynamic';
import PostView from '@/models/postView';
const GradientCard = dynamic(() => import('@/components/main/GradientColorImage'), {
    loading: () => <SkeletonLoading />, // Skeleton loading sebagai fallback
});
const getDetail = async (slug) => {
    const data = await Post.findOne({
        where: {
            slug
        },
        include: [
            {
                model: Genre,
                as: 'genres',
                attributes: ['name'],
                through: {
                    attributes: []
                }
            },
            {
                model: Tag,
                as: 'tags',
                attributes: ['name'],
                through: {
                    attributes: []
                }
            },
            {
                model: Episode,
                include: {
                    model: PostLink,
                },
                separate: true,
                order: [['title', 'asc']]
            }
        ]
    });
    return data;
};
export async function generateMetadata({ params }) {
    const { title } = await params;
    const data = await getDetail(title);  // Ambil detail post berdasarkan slug

    if (!data) {
        return {
            title: 'Post Not Found',
            description: 'This post was not found.',
        };
    }

    const metaTitle = `Drama Korea ${data.title} - Lyco`;
    const metaDescription = `Drama Korea ${data.title}-${data.description}` || 'No description available for this post.';
    const postUrl = `${process.env.NEXT_PUBLIC_ENDPOINT_URL || 'http://localhost:3000'}${data.slug}`;
    const imageUrl = data.image || `${process.env.NEXT_PUBLIC_ENDPOINT_URL || 'http://localhost:3000'}/default-image.jpg`;
    return {
        title: metaTitle,
        description: metaDescription,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: postUrl,
            type: 'article',
            image: imageUrl,
            siteName: 'Lyco',
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            image: imageUrl,
            site: '@Lyco',
        },
        alternates: {
            canonical: postUrl, // Menambahkan canonical di sini
        },
    };
}
const getRelatedPosts = async (genres, excludePostId) => {
    // Attempt to fetch related posts
    let relatedPosts = await Post.findAll({
        where: { id: { [Op.ne]: excludePostId } },
        include: [
            {
                model: Genre,
                as: 'genres',
                where: { name: genres.map((g) => g.name) },
                through: { attributes: [] }
            }
        ],
        limit: 5
    });

    // If no related posts found, fetch random posts
    if (relatedPosts.length === 0) {
        relatedPosts = await Post.findAll({
            where: { id: { [Op.ne]: excludePostId } },
            include: [{ model: Genre, as: 'genres', through: { attributes: [] } }],
            order: Sequelize.literal('RAND()'),
            limit: 5
        });
    }

    return relatedPosts;
};

export default async function page({ params }) {
    const { title } = await params;
    const data = await getDetail(title);
    if (!data) {
        return <h3 className='text-center text-3xl'>Not Found</h3>
    }
    try {
        await PostView.create({
            post_id: data.id,
        });

    } catch (error) {


    }
    const episodes = JSON.parse(JSON.stringify(data.episodes));
    const relatedPosts = await getRelatedPosts(data.genres, data.id);



    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${process.env.NEXT_PUBLIC_ENDPOINT_URL}`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Ongoing",
                "item": `${process.env.NEXT_PUBLIC_ENDPOINT_URL}tag/ongoing`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Completed",
                "item": `${process.env.NEXT_PUBLIC_ENDPOINT_URL}tag/completed`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": data.title,
                "item": `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${data.slug}`
            }
        ]
    };



    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>

            <div className="w-full flex flex-col gap-2 items-start">
                <div className="w-full space-y-6">
                    <GradientCard data={data.toJSON()} className="px-4 shadow-md rounded-md py-2 " />
                    <div className="text-gray-700 border-2 w-full p-2 rounded-md">
                        <Links data={episodes} />
                    </div>
                </div>
                <div className="w-full space-y-4 mt-4">
                    <h3 className="text-lg font-semibold">Related Posts</h3>
                    <div className="space-y-4">
                        {relatedPosts.length > 0 ? (
                            relatedPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/${post.slug}`}
                                    className="block bg-gray-100 hover:bg-gray-200 p-3 rounded-md shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 relative">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                quality={70}
                                                loading='lazy'
                                                className="rounded-md"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"  // Menyesuaikan dengan lebar viewport
                                            />

                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold">
                                                {post.title}
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                {post.genres.map((g) => g.name).join(', ')}
                                            </p>
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
