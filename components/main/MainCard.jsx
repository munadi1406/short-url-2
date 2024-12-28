import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MainCard({ post }) {
    const badgeColors = [
        'bg-red-500 text-white',
        'bg-blue-500 text-white',
        'bg-green-500 text-white',
        'bg-yellow-500 text-black',
        'bg-purple-500 text-white',
        'bg-pink-500 text-white',
    ];
    return (
        <Link href={`/${post.slug}`} className="hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="relative">
                <Image
                    src={post.image || '/placeholder.jpg'}
                    alt={post.title}
                    width={200}
                    height={150}
                    className="rounded-md"
                    itemProp="image"
                />
                <div className="flex flex-wrap gap-2 w-full p-2 absolute bottom-0">
                    {post.genres.map((genre, subIndex) => (
                        <div key={subIndex}>
                            <span
                                className={`${badgeColors[subIndex % badgeColors.length]} text-xs px-2 py-1 rounded-md`}
                                itemProp="genre"
                            >
                                {genre.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='py-2 flex flex-wrap gap-2'>
                {post?.tags?.map((tags, subIndex) => (
                    <div key={subIndex}>
                        <h3
                            className="text-xs text-gray-500 font-semibold w-full"


                        >
                            {tags.name}
                        </h3>
                    </div>
                ))}
                <h2
                    className="text-md font-semibold capitalize w-full"

                >
                    {post.title}
                </h2>
                <p className='text-xs text-gray-600'>{post?.description?.length > 100 ? `${post.description.slice(0, 100)}...` : post?.description}</p>

            </div>



        </Link>
    )
}
