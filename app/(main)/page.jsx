import MainCard from '@/components/main/MainCard';
import Popular from '@/components/main/Popular';
import { Genre } from '@/models/genre';
import Post from '@/models/post';
import { Tag } from '@/models/tag';
import Setting from '@/models/settings';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const getData = async (page = 1, limit = 12) => {
  try {
    const offset = (page - 1) * limit;

    const result = await Post.findAndCountAll({
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
          through: { attributes: [] },
        },
        {
          model: Tag,
          attributes: ['name'],
          as: 'tags',
          through: { attributes: [] },
        },
      ],
    });

    return { data: result.rows, count: result.count };
  } catch (error) {
    return { rows: [], count: 0 };
  }
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

export async function generateMetadata({ searchParams }) {
  const searchParamsResolved = await searchParams;
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
  const page = parseInt(searchParamsResolved.page || 1);

  const setting = await getSetting()

  const siteName = setting?.namaWebsite || 'Lyco'
  const siteDescription = setting?.description || 'Download Drama Korea Subtitle Indonesia'
  const keywords = setting?.keyword || ''
  const favicon = setting?.favicon || '/favicon.ico'
  const logo = setting?.logo || null

  const title = page > 1
  ? `${siteName} - Halaman ${page}`
  : siteName  // cukup nama website saja untuk homepage

  const canonicalUrl = page > 1 ? `${endpoint}?page=${page}` : `${endpoint}`

  return {
    title,
    description: siteDescription,
    keywords,
    robots: 'index, follow',
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title,
      description: siteDescription,
      url: `${endpoint}?page=${page}`,
      type: 'website',
      siteName,
      images: logo ? [{ url: logo }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: siteDescription,
      site: `@${siteName.toLowerCase()}`,
      images: logo ? [logo] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function Home({ searchParams }) {
  const searchParamsResolved = await searchParams;
  const page = parseInt(searchParamsResolved.page || 1);
  const limit = 12;

  const [{ data: posts, count }, setting] = await Promise.all([
    getData(page, limit),
    getSetting(),
  ])

  const totalPages = Math.ceil(count / limit);
  const maxVisiblePages = 5;
  const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
  const siteName = setting?.namaWebsite || 'Lyco'

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className='w-full h-max'>
        <Popular />
      </div>
      <h1 className='text-xl font-bold text-gray-600 mt-2'>Recent</h1>
      <div
        className="grid md:grid-cols-5 grid-cols-3 my-2 gap-4 w-full"
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