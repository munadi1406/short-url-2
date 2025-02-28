'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import IpAddress from '../IpLocation/IpAddress'
import LiveViewSkeleton from './LiveViewSkeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'




export default function LiveView({ footer = true }) {
    const [limit, setLimit] = useState()
    const fetchLiveActivityUsers = async ({ pageParam = null }) => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/latest`, {
            params: {
                limit,
                lastId: pageParam,
            },
        })
        return response.data.data
    }

    const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['liveActivityUsers', limit],
        queryFn: fetchLiveActivityUsers,
        getNextPageParam: (lastPage) => lastPage?.lastId || null,
        refetchInterval: 5000,
    })


    if (isLoading) {
        return <LiveViewSkeleton />;
    }



    return (
        <div className='w-full space-y-2'>


            <Card>
                <CardHeader>
                    <CardTitle>Live Activity Users</CardTitle>
                    <CardDescription>
                        Data Realtime Aktifitas User:
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                    <Select onValueChange={(e) => setLimit(Number(e))} value={limit}>
                        <SelectTrigger className="w-[180px]" >
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30, 50,100,250,500,1000].map((value) => (
                                <SelectItem value={value} key={value}>{value}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Table>
                        <TableCaption>List Aktifitas Users</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Ip Address</TableHead>
                                <TableHead>Page/Path</TableHead>
                                <TableHead>User Agent</TableHead>
                                <TableHead>Visited At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.pages.map((page) => (
                                page.visitors.map((e, i) => {
                                    const splitIp = e.ipAddress.split(',')[0]
                                    return (
                                        <TableRow key={e.id || `${e.ipAddress}-${i}`}>
                                            <TableCell className="cursor-pointer">
                                                <IpAddress ipAddress={splitIp} />
                                            </TableCell>
                                            <TableCell>{e.page}</TableCell>
                                            <TableCell>{e.userAgent}</TableCell>
                                            <TableCell>{new Date(e.visitedAt).toLocaleTimeString()}</TableCell>
                                        </TableRow>
                                    )
                                })
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    {hasNextPage && (
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading' : 'Load More'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
