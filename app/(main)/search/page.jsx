import Search from '@/components/search/Search'



export const dynamic = 'force-dynamic' // supaya hasil bisa diupdate tiap query

export async function generateMetadata({ searchParams }) {
  const query = await searchParams?.q || ''
  return {
    title: query ? `${query} ` : 'Search',
    description: query
      ? `Download Drama "${query}" Sub Indo`
      : 'Download Drama Korea Sub Indo',
    alternates: {
      canonical: query
        ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/search?q=${encodeURIComponent(query)}`
        : `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/search`,
    },
  }
}

export default async function SearchPage({ searchParams }) {
  const query = await searchParams?.q || ''

  // SSR fetch agar hasil muncul di HTML awal (SEO)
  let initialData = null
  if (query.length >= 3) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/post/search/?search=${query}`,
      { cache: 'no-store' }
    )
    initialData = await res.json()
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">
        {query ? `Result For "${query}"` : 'Search?'}
      </h1>
      <Search initialData={initialData} initialQuery={query} />
    </main>
  )
}
