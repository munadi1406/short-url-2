'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import PostSkeleton from './PostSkeleton'
export default function Post() {
    const { data, isLoading } = useQuery({
        queryKey: ['postStat'], queryFn: async () => {
            const datas = await axios.get('/api/post/stat')
            return datas.data.data
        },
    })
    if (isLoading) {
        return <PostSkeleton />
    }


    return (

        <Card>
            <CardHeader>
                <CardTitle>Posts</CardTitle>
                <CardDescription>
                    Data Statistik Post
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <div className="w-full flex flex-col gap-2">
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-lg font-semibold'>
                            Top Post Today
                        </h2>
                        {data?.today.map((e, i) => (
                            <div className="w-full border rounded-md grid grid-cols-2" key={i}>
                                <p className="text-md text-gray-700 p-2" title={e.title}>
                                    {e.title.length > 25 ? `${e.title.slice(0, 15)}...` : e.title}
                                </p>
                                <p className="text-md font-semibold text-gray-700 p-2">{e.viewCount}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-lg font-semibold'>
                            Top Post All Time
                        </h2>
                        {data?.allTime.map((e, i) => (
                            <div className="w-full border rounded-md grid grid-cols-2" key={i}>
                                <p className="text-md text-gray-700 p-2" title={e.title}>
                                    {e.title.length > 25 ? `${e.title.slice(0, 15)}...` : e.title}
                                </p>
                                <p className="text-md font-semibold text-gray-700 p-2">{e.viewCount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
