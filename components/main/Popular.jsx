import Post from '@/models/post';
import PostView from '@/models/postView';
import { badgeVariants } from '../ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Genre } from '@/models/genre';
import { Tag } from '@/models/tag';
import { sequelize } from '@/lib/sequelize';
import { Op } from 'sequelize';

const getData = async (limit = 5) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Awal bulan
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Akhir bulan
        // Mengambil data post dari tabel PostView
        const data = await PostView.findAll({
            attributes: [
                'post_id',
                [sequelize.fn('COUNT', sequelize.col('post_views.id')), 'viewCount'], // Menghitung jumlah tampilan
            ],
            group: ['post_id'], // Kelompokkan berdasarkan post_id
            order: [[sequelize.literal('viewCount'), 'DESC']], // Urutkan berdasarkan jumlah tampilan
            limit, // Batasi jumlah hasil
            include: [
                {
                    model: Post,
                    as: 'post', // Relasi dengan Post model
                    attributes: ['id', 'title', 'description', 'updatedAt', 'image', 'slug'], // Ambil atribut dari Post
                    include: [
                        {
                            model: Genre,
                            attributes: ['name'], // Mengambil genre
                            as: 'genres',
                            through: {
                                attributes: [],
                            },
                        },
                        {
                            model: Tag,
                            attributes: ['name'], // Mengambil tag
                            as: 'tags',
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                    where: {
                        status: 'publish',
                    },
                },
            ],
            where: {
                viewed_at: {
                    [Op.between]: [startOfMonth, endOfMonth], // Batasi berdasarkan createdAt dalam bulan ini
                },
            },
            required: true, // Mengambil hanya yang memiliki relasi dengan post
        });
       
        return data.map((view) => ({
            postId: view.post.id,
            title: view.post.title,
            description: view.post.description,
            updatedAt: view.post.updatedAt,
            image: view.post.image,
            slug: view.post.slug,
            viewCount: view.dataValues.viewCount, // Jumlah tampilan
            genres: view.post.genres.map((genre) => genre.name), // Ambil nama genre
            tags: view.post.tags.map((tag) => tag.name), // Ambil nama tag
        }));
    } catch (error) {
      
        return [];
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

    const popular = await getData();

    return (
        <>
            <h3 className="text-lg font-semibold w-full text-center">Trending</h3>
            <div className="flex flex-col gap-2">
                {popular.map((post, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4 border rounded-md p-2">
                        <div className="relative">
                            <Link href={`/${post.slug}`} style={{ height: "auto" }} className='relative w-24 block'>
                                <Image
                                    src={post.image}
                                    alt={post.title}

                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    className="w-full h-auto"
                                    itemProp="image"

                                    quality={70}
                                    loading='lazy'
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
                            <div className="flex flex-wrap gap-2">
                                {post?.tags?.map((tag, subIndex) => (
                                    <div key={subIndex}>
                                        <Link
                                            href={`/tag/${tag}`}
                                            className={badgeVariants({ variant: 'outline' })}
                                        >
                                            {tag}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {post.genres.map((genre, subIndex) => (
                                    <div key={subIndex}>
                                        <Link
                                            className={`${badgeColors[subIndex % badgeColors.length]} text-xs px-2 py-1 rounded-md`}
                                            itemProp="genre"
                                            href={`/genre/${genre}`}
                                        >
                                            {genre}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
