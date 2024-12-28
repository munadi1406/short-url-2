import Links from '@/components/post/Links';
import { badgeVariants } from '@/components/ui/badge';
import Episode from '@/models/episode';
import { Genre } from '@/models/genre';
import Post from '@/models/post';
import PostLink from '@/models/postLinks';
import { Tag } from '@/models/tag';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Op, Sequelize } from 'sequelize';

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

    const metaTitle = `${data.title} - Drakoran`;
    const metaDescription = data.description || 'No description available for this post.';
    const postUrl = `${process.env.NEXT_PUBLIC_ENDPOINT_URL || 'http://localhost:3000'}/post/${data.slug}`;
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
            siteName: 'Drakoran',
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            image: imageUrl,
            site: '@Drakoran',
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
    const episodes = JSON.parse(JSON.stringify(data.episodes));
    const relatedPosts = await getRelatedPosts(data.genres, data.id);
    if (!data) {
        return <h3 className='text-center text-3xl'>Not Found</h3>
    }

    const postUrl = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${data.slug}`;

    // JSON-LD yang sudah dihasilkan dari generateMetadata
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        "name": data.title,
        "description": data.description,
        "url": postUrl,
        "image": data.image,
        "genre": data.genres.map(genre => genre.name).join(', '),
        "keywords": data.tags.map(tag => tag.name).join(', '),
        "totalEpisodes": data.total_episode,
        "trailer": data.trailer,
        "datePublished": data.createdAt,
        "sameAs": postUrl,
        "publisher": {
            "@type": "Organization",
            "name": "Hobbba",
            "url": `${process.env.NEXT_PUBLIC_ENDPOINT_URL}`,
        },
        "author": {
            "@type": "Person",
            "name": "Hobbba",
        },
        "episode": data.episodes.map(episode => ({
            "@type": "Episode",
            "name": episode.title,
            "url": `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${data.slug}`,
           
        })),
    };

    return (
        <>
        <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
        <div className="w-full flex flex-col gap-2 items-start">
            <div className="w-full space-y-6">
                <div className="px-4 bg-[#6482AD] text-white shadow-md rounded-md py-2 ">
                    <div className='flex flex-wrap gap-2 md:justify-start justify-center'>
                        <div className="w-max ">
                            <Image
                                src={`${data.image}`}
                                alt={data.title}
                                height="300"
                                width="300"
                                className="rounded-md"
                            />
                        </div>
                        <div className="px-4 ">
                            <h2 className="text-lg font-semibold capitalize">title : {data.title}</h2>
                            <div className="flex gap-2">
                                <h3>Genre : </h3>
                                <div className="flex gap-2 capitalize">
                                    {data.genres.map((e, i) => (
                                        <Link href={`/genre/${e.name}`} key={i} className={badgeVariants({ variant: "outline", className: "text-white" })}>
                                            {e.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <h3>Total Episode : {data.total_episode ?? '-'}</h3>
                            <h3>Air Time : {data.air_time ?? '-'}</h3>
                            <h3>Trailer : {data.trailer ? <a className={badgeVariants({ className: "bg-red-600 hover:bg-red-400" })} href={data.trailer} rel="noopener noreferrer" target="_blank">Trailer</a> : '-'}</h3>
                        </div>
                    </div>
                    <div className='flex flex-wrap md:w-auto w-full justify-center gap-2 my-2'>
                        {data?.tags?.map((e, i) => (
                            <Link href={`/tag/${e.name}`} key={i} className={badgeVariants({ variant: "outline",className:"text-white" })}>{e.name}</Link>
                        ))}
                    </div>
                </div>
                <p className='text-gray-500'>{data.description}</p>
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
                                            className="rounded-md"
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
