import Article from "@/models/article"
import { JSONToHTML } from "html-to-json-parser";
import LocalTime from "./LocalTime";
import { notFound, } from 'next/navigation';
import CreateLink from "@/components/Url/CreateLink";


const getData = async (slug) => {
  return await Article.findOne({ where: { slug } })
}


export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = await getData(slug);

  if (!data) {
    return {
      title: 'Article Not Found',
      openGraph: {
        title: 'Article Not Found',
        url: `${process.env.NEXTAUTH_URL}/404`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Article Not Found',
        description: 'Article not found on the site',
        image: `${process.env.NEXTAUTH_URL}/404-image.jpg`,
      },
    };
  }

  let description = 'No description available';
  let imageUrl = ''; // Inisialisasi variabel untuk URL gambar

  try {
    const contentJson = data.content; // Langsung menggunakan objek

    // Mengambil teks dari beberapa paragraf pertama
    const paragraphs = contentJson.content
      ?.filter(item => item.type === 'p') // Filter paragraf
      ?.map(paragraph => {
        // Periksa jika content ada dan merupakan array
        if (Array.isArray(paragraph.content)) {
          return paragraph.content.join(' '); // Gabungkan elemen content
        }
        return ''; // Jika content tidak ada, kembalikan string kosong
      })
      .slice(0, 2) // Ambil hanya dua paragraf pertama
      .join(' ')



    // Membersihkan dan memotong teks untuk SEO
    description = paragraphs
      ?.replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160)
      .trim();

    if (description?.length === 160) {
      const lastSpace = description.lastIndexOf(' ');
      if (lastSpace > 0) {
        description = description.slice(0, lastSpace);
      }
    }

    // Mengambil URL gambar pertama dari konten JSON
    const images = contentJson.content
      ?.filter(item => item.type === 'img')
      .map(image => image.attributes.src);

    if (images?.length > 0) {
      imageUrl = images[0];
    }

  } catch (error) {
    
  }

  const canonicalUrl = `${process.env.NEXTAUTH_URL}/${data.slug}`;

  return {
    title: data.title,
    description: description || 'No description available',
    openGraph: {
      title: data.title,
      description: description || 'No description available',
      url: canonicalUrl,
      type: 'article',
      article: {
        author: 'dcrypt',
        publishedTime: data.createdAt || new Date().toISOString(),
        modifiedTime: data.updatedAt || new Date().toISOString(),
      },
      images: [imageUrl],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: data.title,
      description: description || 'No description available',
      image: imageUrl || `${process.env.NEXTAUTH_URL}/default-twitter-image.jpg`,
    },
    authors: [{ name: 'dcrypt' }],
    creator: 'dcrypt',
    publisher: 'dcrypt',
    metaTags: [
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'dcyrpt' },
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
  },
  };
}

export default async function Page({ params }) {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) {
    return notFound();
  }
  const result = await JSONToHTML(data.content, true);

  return (
    <div className="min-h-screen py-6 px-4 relative">
  
      <CreateLink />
      <div className="md:w-[70vw] w-full mx-auto">
        <article className="prose lg:prose-lg prose-h2:m-auto prose-h1:my-4 prose-h3:m-auto prose-p:my-4 prose-slate prose-img:rounded-md prose-img:shadow-lg prose-img:block prose-img:m-auto w-full max-w-none">
          <header className="text-center">
            <h1>{data.title}</h1>
            <p className="text-md">
              <LocalTime date={data.createdAt} />
            </p>
          </header>

          <section
            dangerouslySetInnerHTML={{ __html: result }}
            className="ProseMirror"
          />
        </article>
      </div>
    </div>

  )
}
