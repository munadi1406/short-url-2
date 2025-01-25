'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
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




export default function LiveView({ footer = true }) {

    const { data, isLoading } = useQuery({
        queryKey: ['liveActiviyUsers'], queryFn: async () => {
            const datas = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/latest`)
            return datas.data.data
        },
        staleTime: 2,
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
                                {data.map((e, i) => {
                                    const splitIp = e.ipAddress.split(',')[0]
                                    return (
                                        <TableRow key={i}>
                                            <TableCell className="cursor-pointer"><IpAddress ipAddress={splitIp} /></TableCell>
                                            <TableCell>{e.page}</TableCell>
                                            <TableCell>{e.userAgent}</TableCell>
                                            <TableCell >{new Date(e.visitedAt).toLocaleTimeString()}</TableCell>
                                        </TableRow>
                                    )
                                }
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
 
    )
}
