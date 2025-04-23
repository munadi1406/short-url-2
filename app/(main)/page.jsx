import MainCard from '@/components/main/MainCard';
// import LogSend from '@/lib/LogSend';
import { Genre } from '@/models/genre';
import Post from '@/models/post';
import { Tag } from '@/models/tag';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const getData = async (page = 1, limit = 12) => {
  try {
    const offset = (page - 1) * limit;
    const data = await Post.findAndCountAll({
      attributes: ['id', 'title', 'description', 'updatedAt', 'image', 'slug'],
      where: {
        status: 'publish',
      },
      distinct: true,
      order: [['updatedAt', 'DESC']],
      limit,
      offset,
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

export async function generateMetadata({ searchParams }) {
  const searchParamsResolved = await searchParams;
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
  const page = parseInt(searchParamsResolved.page || '1', 12);
  const title = page > 1 ? `Page ${page} - Lyco` : `Lyco - Download Drama Korea Subtitle Indonesia`;
  const description = `Download Drama Korea Subtitle Indonesia`;
  const canonicalUrl = page > 1 ? `${endpoint}?page=${page}` : `${endpoint}`;
  return {
    title,
    description,
    robots: 'index, follow',
    openGraph: {
      title,
      description,
      url: `${endpoint}?page=${page}`,
      type: 'website',
      siteName: 'Lyco',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@lyco',
    },
    alternates: {
      canonical: canonicalUrl, // Menambahkan canonical di sini
    },
  };
}

export default async function Home({ searchParams }) {
  const searchParamsResolved = await searchParams;
  const page = parseInt(searchParamsResolved.page || '1', 12);
  const limit = 12;

  const { rows: posts, count } = await getData(page, limit);

  const totalPages = Math.ceil(count / limit);

  // Generate range of pages
  const maxVisiblePages = 5;
  const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${endpoint}`
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
      {/* <LogSend/> */}
      <div
        className="py-4 grid md:grid-cols-4 grid-cols-2 gap-4 w-full"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        {posts.map((post, i) => (
          <MainCard post={post} key={i} />

        ))}
      </div>

      {count > limit && (
        <div className="flex items-center justify-center mt-6 space-x-2">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}`}
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
              <ChevronRight />
            </Link>
          )}
        </div>
      )}
    </>
  );
}
