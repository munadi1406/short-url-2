import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/models/links';
import { Url } from '@/models/urls';
import { notFound } from 'next/navigation';
import React from 'react';

const getData = async (slug) => {
  return await Url.findOne({ where: { short_url: slug }, include: { model: Link, as: 'links' } });
};

export async function generateMetadata({ params }) {
  const { slug } = params;

  // Ambil data untuk metadata
  const urls = await getData(slug);

  return {
    title: urls ? urls.title : 'Page Not Found',
    description: urls ? `Explore links for ${urls.title}` : 'No links available',
  };
}

export default async function Page({ params }) {
  const { slug } = params;

  const urls = await getData(slug);

  // Jika data `urls` tidak ditemukan, arahkan ke halaman NotFound bawaan Next.js
  if (!urls) {
    return notFound();
  }

  return (
    <div className="py-4 flex w-full md:w-[70vw] m-auto justify-center items-center flex-col gap-4">
      <h1 className="text-4xl font-semibold text-center p-4 w-full shadow-md rounded-md">{urls.title}</h1>
      {urls.links.length === 0 ? (
        <div className="w-full text-center py-6">
          <p className="text-lg text-gray-500">No links available for this URL.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col shadow-md rounded-md p-4">
          {urls.links.map((e, i) => (
            <div key={i} className="flex items-center justify-between p-2 w-full">
              <p title={e.title}>
                {e.title.length > 30 ? `${e.title.substring(0, 30)}...` : e.title}
              </p>
              <div className="flex items-center justify-center">
                <a
                  className={buttonVariants()}
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