'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { AspectRatio } from '../ui/aspect-ratio'

export default function SearchClient({ initialData, initialQuery }) {
    const [query, setQuery] = useState(initialQuery || '')
    const router = useRouter()
    const timeoutRef = useRef(null)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            const response = await axios.get(`/api/post/search/?search=${query}`)
            return response.data
        },
        enabled: query.length >= 3,
        initialData: query === initialQuery ? initialData : undefined,
    })

    const handleSearch = (e) => {
        const value = e.target.value
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            setQuery(value)
            router.push(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/search?q=${encodeURIComponent(value)}`) // ubah URL → SEO friendly
        }, 800)
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
        <div className="mt-4">
            <Input
                placeholder="Cari..."
                onChange={handleSearch}
                defaultValue={initialQuery}
            />

            {isLoading && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="w-full h-[150px] rounded-md" />
                    ))}
                </div>
            )}

            {isError && <div>Terjadi kesalahan...</div>}

            {data?.data?.length === 0 && <div>Tidak ada hasil</div>}

            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                {data?.data?.map((e, i) => (
                    <Link
                        href={`/${e.slug}`}
                        key={i}
                        className="flex flex-col gap-2 w-full border p-2 rounded-md cursor-pointer"
                    >
                        <AspectRatio ratio={3 / 4}>
                            <Image
                                fill
                                src={e.image}
                                alt={e.title}
                                className="rounded w-full h-full object-cover"
                                sizes="(max-width: 768px) 100vw, 60vw"
                            />
                        </AspectRatio>
                        <div className="space-y-2">
                            <h1 className="font-semibold">{e.title}</h1>
                            <div className="flex flex-wrap gap-1">
                                {e.tags.map((tag, subIndex) => (
                                    <Badge key={subIndex}>{tag.name}</Badge>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {e.genres.map((genre, subIndex) => (
                                    <Badge variant="outline" key={subIndex}>
                                        {genre.name}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-xs text-gray-600">
                                {e.description.length > 100
                                    ? `${e.description.slice(0, 100)}...`
                                    : e.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
