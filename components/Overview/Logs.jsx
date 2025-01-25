'use client'
import { useQueries } from '@tanstack/react-query'
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
import LogSkeleton from './LogSkeleton'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'


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
                queryKey: ['logsVisitorsOverview'],
                queryFn: async () => {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/visitors/overview`);
                    return response.data.data;
                },
                staleTime: 10000,
                refetchInterval: 10000,
            },
        ]
    });

    // Destructuring the query results
    const [logsUsersOverview, logsVisitorsOverview] = queries;

    return { logsUsersOverview, logsVisitorsOverview };
};
export default function Logs({ footer = true }) {


    const { logsUsersOverview, logsVisitorsOverview } = useParallelQueries();

    if (logsUsersOverview.isLoading || logsVisitorsOverview.isLoading) {
        return <LogSkeleton />;
    }
    const serverTime = new Date(logsUsersOverview.data.serverTime);
    const formattedServerTime = `${serverTime.getUTCFullYear()}-${String(serverTime.getUTCMonth() + 1).padStart(2, '0')}-${String(serverTime.getUTCDate()).padStart(2, '0')} ${String(serverTime.getUTCHours()).padStart(2, '0')}:${String(serverTime.getUTCMinutes()).padStart(2, '0')}:${String(serverTime.getUTCSeconds()).padStart(2, '0')}`;

    return (
        <div className='w-full space-y-2'>

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
                                <p className="text-md font-semibold text-gray-700 p-2">{logsUsersOverview.data.activeUsers}</p>
                            </div>
                            <div className='w-full border rounded-md grid grid-cols-2'>
                                <p className="text-md  text-gray-700 p-2">User Baru:</p>
                                <p className="text-md font-semibold text-gray-700 p-2">{logsUsersOverview.data.newUsers}</p>
                            </div>
                            <div className='w-full border rounded-md grid grid-cols-2'>
                                <p className="text-md  text-gray-700 p-2">User Kembali:</p>
                                <p className="text-md font-semibold text-gray-700 p-2">{logsUsersOverview.data.returningUsers}</p>
                            </div>
                            <div className='w-full border rounded-md grid grid-cols-2'>
                                <p className="text-md  text-gray-700 p-2">Total User :</p>
                                <p className="text-md font-semibold text-gray-700 p-2">{logsUsersOverview.data.totalUsersToday}</p>
                            </div>
                            <div className='w-full border rounded-md grid grid-cols-2'>
                                <p className="text-md  text-gray-700 p-2">Rata Rata Waktu:</p>
                                <p className="text-md font-semibold text-gray-700 p-2">{logsUsersOverview.data.averageSessionDurationFormatted}</p>
                            </div>
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
                        <CardTitle>Visitors</CardTitle>
                        <CardDescription>
                            Data Realtime Logs, Waktu Server: {formattedServerTime}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full">
                        <div className="w-full flex flex-col gap-2">
                            <div className='flex flex-col gap-2'>
                                <h2 className='text-lg font-semibold'>
                                    Top Path
                                </h2>
                                {logsVisitorsOverview?.data?.topPaths?.map((e, i) => (
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
