'use client'

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'

export default function Data() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['article'],
        queryFn: async ({ pageParam }) => {
            const response = await axios.get(`/api/article?${pageParam ? `lastCreatedAt=${pageParam}` : ''}`);
      
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.pagination.lastCreatedAt,
    });
    return (
        <div>
           
            {isLoading ? (
                <div>
                    <p colSpan="5">Memuat data...</p>
                </div>
            ) : (
                // Menampilkan data dari setiap halaman
                data?.pages?.flatMap((page) => page.data).map((article, index) => (
                    <div key={index}>
                        <a href={`/${article.slug}`} target="_blank" key={index}>{article.title}</a>
                    </div>
                ))
            )}
        </div>
    )
}
