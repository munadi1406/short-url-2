



import Post from '@/models/post';
import { Badge, badgeVariants } from '../ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Genre } from '@/models/genre';
import { Tag } from '@/models/tag';

const getData = async (limit = 5) => {
    try {
        const data = await Post.findAll({
            attributes: ['id', 'title', 'description', 'updatedAt', 'image', 'slug'],
            where: {
                status: 'publish',
            },
            distinct: true,

            limit,
            include: [
                {
                    model: Genre,
                    attributes: ['name'],
                    as: 'genres',
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: Tag,
                    attributes: ['name'],
                    as: 'tags',
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
        return data;
    } catch (error) {
      
        return { rows: [], count: 0 };
    }
};
export default async function Popular() {
    const badgeColors = [
        'bg-red-500 text-white',
        'bg-blue-500 text-white',
        'bg-green-500 text-white',
        'bg-yellow-500 text-black',
        'bg-purple-500 text-white',
        'bg-pink-500 text-white',
    ];
    const popular = await getData()
    return (
        <>
            <h3 className='text-lg font-semibold w-full text-center'>Trending</h3>
            <div className='flex flex-col gap-2'>
                {popular.map((post, i) => (
                    <div key={i} className='grid grid-cols-3 gap-4 border rounded-md p-2'>
                        <div className="relative ">
                            <Link href={`/${post.slug}`}>
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    height="500"
                                    width="500"
                                    
                                    itemProp="image"
                                />
                            </Link>
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                            <Link href={`/${post.slug}`}>
                                <h2
                                    className="text-sm font-semibold capitalize w-full"
                                    itemProp="headline"
                                >
                                    {post.title}
                                </h2>
                            </Link>
                            <div className='flex flex-wrap gap-2'>
                                {post?.tags?.map((tag, subIndex) => (
                                    <div key={subIndex}>
                                        <Link
                                            href={`/tag/${tag.name}`}
                                            className={badgeVariants({variant:"outline"})}
                                        >
                                            {tag.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {post.genres.map((genre, subIndex) => (
                                    <div key={subIndex}>
                                        <Link
                                            className={`${badgeColors[subIndex % badgeColors.length]} text-xs px-2 py-1 rounded-md`}
                                            itemProp="genre"
                                            href={`/genre/${genre.name}`}
                                        >
                                            {genre.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
