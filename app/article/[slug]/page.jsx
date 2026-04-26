import Article from "@/models/article"
import Ads from "@/models/ads"
import { JSONToHTML } from "html-to-json-parser";
import LocalTime from "./LocalTime";
import { notFound } from 'next/navigation';
import CreateLink from "@/components/Url/CreateLink";

const getData = async (slug) => {
    return await Article.findOne({ where: { slug } })
}

const getAds = async () => {
    try {
        const ads = await Ads.findOne({
            order: [['createdAt', 'DESC']],
        })
       
        return ads ? JSON.parse(JSON.stringify(ads)) : null
    } catch (error) {
        return null
    }
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
    let imageUrl = '';

    try {
        const contentJson = data.content;

        const paragraphs = contentJson.content
            ?.filter(item => item.type === 'p')
            ?.map(paragraph => {
                if (Array.isArray(paragraph.content)) {
                    return paragraph.content.join(' ');
                }
                return '';
            })
            .slice(0, 2)
            .join(' ')

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

        const images = contentJson.content
            ?.filter(item => item.type === 'img')
            .map(image => image.attributes.src);

        if (images?.length > 0) {
            imageUrl = images[0];
        }
    } catch (error) {}

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

    const [data, ads] = await Promise.all([
        getData(slug),
        getAds(),
    ])
 

    if (!data) {
        return notFound();
    }

    const result = await JSONToHTML(data.content, true);

    return (
        <div className="min-h-screen py-6 px-4 relative">
         
            <CreateLink ads={ads} />
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