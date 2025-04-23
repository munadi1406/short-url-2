'use client'
import { useQueries } from '@tanstack/react-query'
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
import LogSkeleton from './LogSkeleton'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import Indicator from './Indicator'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UsersActive from './UsersActive'


export default function Logs({ footer = true }) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState()
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const handleChangeFilter = (value) => {
        setFilter(value)
    }
    const useParallelQueries = () => {
        const queries = useQueries({
            queries: [
                {
                    queryKey: ['logsUsersOverview'],
                    queryFn: async () => {
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/users/overview`);
                        return response.data.data;
                    },
                    staleTime: 10000,
                    refetchInterval: 10000,
                },
                {
                    queryKey: [`logsVisitorsOverview-${filter}`],
                    queryFn: async () => {
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/overview`, {
                            params: filter ? { filter } : undefined,
                        });
                        return response.data.data;
                    },
                    staleTime: 10000,
                    refetchInterval: 10000,
                },
                {
                    queryKey: [`top-pages-${startDate}-${endDate}`],
                    queryFn: async () => {
                        const params = {
                            ...(startDate ? { startDate } : {}),
                            ...(endDate ? { endDate } : {}),
                        };
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/top-pages`, params)
                        return response.data.data;
                    },
                    staleTime: 10000,
                    refetchInterval: 10000,
                },

            ]
        });

        // Destructuring the query results
        const [logsUsersOverview, logsVisitorsOverview, topPages] = queries;

        return { logsUsersOverview, logsVisitorsOverview, topPages };
    };



    const { logsUsersOverview, logsVisitorsOverview, topPages } = useParallelQueries();

    if (logsUsersOverview.isLoading || logsVisitorsOverview.isLoading || topPages.isLoading) {
        return <LogSkeleton />;
    }
    const serverTime = new Date(logsUsersOverview.data.serverTime);
    const formattedServerTime = `${serverTime.getUTCFullYear()}-${String(serverTime.getUTCMonth() + 1).padStart(2, '0')}-${String(serverTime.getUTCDate()).padStart(2, '0')} ${String(serverTime.getUTCHours()).padStart(2, '0')}:${String(serverTime.getUTCMinutes()).padStart(2, '0')}:${String(serverTime.getUTCSeconds()).padStart(2, '0')}`;

    return (
        <div className='w-full space-y-2'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="h-[80vh] min-w-[80vw]">
                    <DialogHeader>
                        <DialogTitle>Users Online</DialogTitle>
                        <DialogDescription>
                            List Users Online
                        </DialogDescription>
                    </DialogHeader>

                    <UsersActive />
                </DialogContent>
            </Dialog>

            <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
                <div className='col-span-full flex justify-center items-center'>
                    <div className='w-full border rounded-md grid grid-cols-2'>
                        <p className="text-md  text-gray-700 p-2">Total View:</p>
                        <p className="text-2xl font-bold text-gray-700 p-2">{logsVisitorsOverview.data.totalVisitors}</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Logs</CardTitle>
                        <CardDescription>
                            Data Realtime Logs, Waktu Server: {formattedServerTime}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full">
                        <div className='md:col-span-1 col-span-2 flex flex-col gap-2 w-full '>
                            <h2 className='text-lg font-semibold'>
                                Pengunjung
                            </h2>
                            <div className='w-full border rounded-md grid grid-cols-2'>
                                <p className="text-md  text-gray-700 p-2">User Online:</p>
                                <p className="text-md font-semibold text-gray-700 p-2  flex flex-col justify-center items-center bg-green-600 cursor-pointer text-white" onClick={() => setIsOpen(true)}>{logsUsersOverview.data.activeUsers}</p>
                            </div>
                            <Indicator title="User Baru" value={logsUsersOverview.data.newUsers} comprisonsValue={logsUsersOverview.data.comparisons.newUsersChange} />
                            <Indicator title="User Kembali" value={logsUsersOverview.data.returningUsers} comprisonsValue={logsUsersOverview.data.comparisons.returningUsersChange} />
                            <Indicator title="Total User" value={logsUsersOverview.data.totalUsersToday} comprisonsValue={logsUsersOverview.data.comparisons.totalUsersChange} />
                            <Indicator title="Rata Rata Waktu" value={logsUsersOverview.data.averageSessionDurationFormatted} comprisonsValue={logsUsersOverview.data.comparisons.averageSessionDurationChange} />
                        </div>
                    </CardContent>
                    {footer && (

                        <CardFooter className="w-full flex justify-end p-2">
                            <Link href={'/dashboard/logs/users'} className={` ${buttonVariants({ variant: "outline" })}`}>Detail</Link>
                        </CardFooter>
                    )}
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Views</CardTitle>
                        <CardDescription>
                            Data Realtime Logs, Waktu Server: {formattedServerTime}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full">
                        <div className="w-full flex flex-col gap-2">

                            <h2 className='text-lg font-semibold'>
                                Views / {logsVisitorsOverview?.data?.selectedFilter}
                            </h2>
                            <Select onValueChange={handleChangeFilter} value={filter}>
                                <SelectTrigger className="w-[180px]" >
                                    <SelectValue placeholder="Pilih Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    {logsVisitorsOverview?.data?.availableFilters.map((e, i) => (
                                        <SelectItem value={e.key} key={i}>{e.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Indicator title="Total View" value={logsVisitorsOverview.data.totalVisitors} comprisonsValue={logsVisitorsOverview.data.visitorChangePercent} />
                            <Indicator title="Prev View" value={logsVisitorsOverview.data.prevTotalVisitors} />

                        </div>
                    </CardContent>
                    {footer && (

                        <CardFooter className="w-full flex justify-end p-2">
                            <Link href={'/dashboard/logs/visitors'} className={` ${buttonVariants({ variant: "outline" })}`}>Detail</Link>
                        </CardFooter>
                    )}
                </Card>
                <Card className="md:col-span-2 col-span-1">
                    <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                        <CardDescription>
                            Data Realtime Logs, Waktu Server: {formattedServerTime}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full">
                        <div className="w-full flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="border p-2 rounded-md"
                                    />
                                </div>
                                <div>

                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="border p-2 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                {topPages?.data?.topVisitedPages?.map((e, i) => (
                                    <div className="w-full border rounded-md grid grid-cols-2" key={i}>
                                        <p className="text-md text-gray-700 p-2" title={e.page}>
                                            {e.page.length > 25 ? `${e.page.slice(0, 15)}...` : e.page}
                                        </p>
                                        <p className="text-md font-semibold text-gray-700 p-2">{e.visitCount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    {footer && (

                        <CardFooter className="w-full flex justify-end p-2">
                            <Link href={'/dashboard/logs/visitors'} className={` ${buttonVariants({ variant: "outline" })}`}>Detail</Link>
                        </CardFooter>
                    )}
                </Card>

            </div>
        </div>
    )
}
