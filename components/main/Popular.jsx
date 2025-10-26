import Post from '@/models/post';
import PostView from '@/models/postView';
import Image from 'next/image';
import Link from 'next/link';
import { Genre } from '@/models/genre';
import { Tag } from '@/models/tag';
import { sequelize } from '@/lib/sequelize';
import { Op } from 'sequelize';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

// export const getRandomGenrePosts = async (limit = 10) => {
//     try {
//       // 1️⃣ Ambil satu genre secara acak
//       const randomGenres = await Genre.findAll({
//         attributes:['id','name'],
//         order: sequelize.random(), // urutan acak
//         limit:3,
//       });
//       if (randomGenres.length === 0) return { genres: [], posts: [] };

//       const genreIds = randomGenres.map((g) => g.id);
      
  
//       // 2️⃣ Ambil post dari genre tersebut
//       const posts = await Post.findAll({
//         include: [
//           {
//             model: Genre,
//             as: "genres",
//             attributes: ["id", "name"],
//             where: {
//                 id: { [Op.in]: genreIds }, // genre A atau B
//               },
//             through: { attributes: [] },
//           },
//           {
//             model: Tag,
//             as: "tags",
//             attributes: ["name"],
//             through: { attributes: [] },
//           },
//         ],
//         attributes:['image','slug','title'],
//         where: { status: "publish" },
//         limit,
//       });
  
//       return {
//         posts,
//       };
//     } catch (err) {
//       console.error("Error fetching random genre posts:", err);
//       return { genre: null, posts: [] };
//     }
//   };

const getData = async (limit = 10) => {
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
                    attributes: ['id', 'title', 'updatedAt', 'image', 'slug'], // Ambil atribut dari Post
                   
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
        }));
    } catch (error) {

        return [];
    }
};

export default async function Popular() {
    

    const popular = await getData();

    return (
        <>
            <h3 className="text-xl font-bold text-gray-600 w-full text-left">Trending</h3>
            <div className="w-full px-10">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full max-h-sm"
                >
                    <CarouselContent>
                        {popular.map((post, i) => (
                            <CarouselItem key={i} className="-ml-2 basis-1/3 md:basis-1/5">
                                <div>
                                    <Link href={`/${post.slug}`} style={{ height: "auto" }} className='relative block'>
                                        <AspectRatio ratio={3 / 4} className="rounded-lg h-full">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full "
                                                fill
                                                sizes="(max-width: 768px) 100vw, 60vw"
                                                quality={70}
                                                loading='lazy'
                                            />
                                        </AspectRatio>
                                    </Link>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </>
    );
}
