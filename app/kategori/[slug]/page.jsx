import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/models/links';
import { Url } from '@/models/urls';
import { notFound } from 'next/navigation';
import React from 'react';

const getData = async (slug) => {
  return await Url.findOne({
    where: { short_url: slug },
    include: {
      model: Link,
      as: 'links',
      order: [['createdAt', 'ASC']],
    },
  });
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const urls = await getData(slug);

  return {
    title: urls ? urls.title : 'Page Not Found',
    description: urls ? `Explore links for ${urls.title}` : 'No links available',
    robots: 'noindex, nofollow',
  };
}

export default async function Page({ params }) {
  const { slug } = params;
  const urls = await getData(slug);

  if (!urls) {
    return notFound();
  }

  return (
    <div className="py-8 flex flex-col items-center w-full md:w-[70vw] mx-auto gap-8">
      <h1 className="text-4xl font-bold text-center p-6 w-full shadow-lg rounded-lg bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
        {urls.title}
      </h1>

      {urls.links.length === 0 ? (
        <div className="w-full text-center py-8">
          <p className="text-lg text-gray-500">No links available for this URL.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col shadow-lg rounded-lg p-2 gap-4">
          {urls.links.map((e, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-2 w-full border-b border-blue-600 last:border-b-0"
            >
              <div className="col-span-2">
                <h2
                  title={e.title}
                  className="text-md font-medium break-words overflow-hidden text-ellipsis"
                >
                  {e.title}
                </h2>
                <h3 className="text-sm text-gray-600">
                  {e.link ? new URL(e.link).hostname.replace(/^www\./, '') : 'Invalid URL'}
                </h3>
              </div>
              <div className="flex items-center justify-end">
                <a
                  className={buttonVariants({ className: 'px-4 py-2 text-sm' })}
                  href={e.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Link
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
