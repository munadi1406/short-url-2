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
import { Link2, Link as Link1, Clapperboard } from 'lucide-react'
import LinkSkeleton from './LinkSkeleton'
export default function Link() {
    const { data, isLoading } = useQuery({
        queryKey: ['urlLinkStat'], queryFn: async () => {
            const datas = await axios.get('/api/shorten/stat')
            return datas.data.data
        },
        staleTime: 10000,
        refetchInterval: 5000,
    })
    if (isLoading) {
        return <LinkSkeleton/>
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Statistik Link</CardTitle>
                <CardDescription>
                    Data Total URL Dan Link
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <div>
                        <h3 className='text-xs font-semibold text-gray-900 mb-2'>
                            Total Url
                        </h3>
                        <div className='flex gap-2'>
                            <Link2 />
                            <p className='font-semibold'>{data.totalUrls}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className='text-xs font-semibold text-gray-900 mb-2'>
                            Total Link
                        </h3>
                        <div className='flex gap-2'>
                            <Link1 />
                            <p className='font-semibold'>{data.totalLinks}</p>
                        </div>
                    </div>
                    <div >
                        <h3 className='text-xs font-semibold text-gray-900 mb-2'>
                            Total Post
                        </h3>
                        <div className='flex gap-2'>
                            <Clapperboard />
                            <p className='font-semibold'>{data.totalPosts}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
