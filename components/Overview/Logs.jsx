'use client'
import { useQueries, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import LogSkeleton from './LogSkeleton'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
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
export default function Logs() {

    const { data, isLoading } = useQuery({
        queryKey: ['logsUsersOverview'], queryFn: async () => {
            const datas = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/users/overview`)
            return datas.data.data
        },
        staleTime: 10000,
        refetchInterval: 10000,
    })
    const { logsUsersOverview, logsVisitorsOverview } = useParallelQueries();

    if (logsUsersOverview.isLoading || logsVisitorsOverview.isLoading) {
        return <LogSkeleton/>;
    }




    // const chartOptions = {
    //     responsive: true,
    //     maintainAspectRatio: false, // Agar tinggi mengikuti kontainer
    //     plugins: {
    //         legend: {
    //             display: true,
    //             position: 'top',
    //         },
    //         tooltip: {
    //             enabled: true,
    //         },
    //     },
    // };

    // // Prepare the data for the Line Chart
    // const visitorsPerHourData = {
    //     labels: data?.visitorsPerHour?.map(item => item.hour),
    //     datasets: [
    //         {
    //             label: 'Visits per Hour',
    //             data: data?.visitorsPerHour?.map(item => item.visitCount),
    //             borderColor: '#2563eb',
    //             backgroundColor: 'rgba(37, 99, 235, 0.2)',
    //             fill: true,
    //             tension: 0.4,
    //         }
    //     ]
    // };

    // const visitorsPerDayData = {
    //     labels: data.visitorsPerDayThisMonth?.map(item => item.day),
    //     datasets: [
    //         {
    //             label: 'Visits per Day',
    //             data: data?.visitorsPerDayThisMonth?.map(item => item.visitCount),
    //             borderColor: '#60a5fa',
    //             backgroundColor: 'rgba(96, 165, 250, 0.2)',
    //             fill: true,
    //             tension: 0.4,
    //         }
    //     ]
    // };
    const serverTime = new Date(logsUsersOverview.data.serverTime);
    const formattedServerTime = `${serverTime.getUTCFullYear()}-${String(serverTime.getUTCMonth() + 1).padStart(2, '0')}-${String(serverTime.getUTCDate()).padStart(2, '0')} ${String(serverTime.getUTCHours()).padStart(2, '0')}:${String(serverTime.getUTCMinutes()).padStart(2, '0')}:${String(serverTime.getUTCSeconds()).padStart(2, '0')}`;

    return (
        <div className='w-full space-y-2'>
            {console.log(logsVisitorsOverview.data)}
            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                    <CardDescription>
                        Data Realtime Logs, Waktu Server: {formattedServerTime}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 grid-cols-1 gap-2">
                    <div className='col-span-full flex justify-center items-center'>
                        <div className='w-full border rounded-md grid grid-cols-2'>
                            <p className="text-md  text-gray-700 p-2">Total View:</p>
                            <p className="text-md font-semibold text-gray-700 p-2">{logsVisitorsOverview.data.todayVisitors}</p>
                        </div>
                    </div>
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
                            <p className="text-md font-semibold text-gray-700 p-2">{logsUsersOverview.data.averageSessionTime}</p>
                        </div>
                    </div>

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
            </Card>
            {/* <Card>
                <CardHeader>
                    <CardTitle>Jumlah Pengunjung Per Jam</CardTitle>
                    <CardDescription>
                        Data Realtime Pengunjung Per Jam, Waktu Server: {formattedServerTime}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Line data={visitorsPerHourData} options={chartOptions} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Jumlah Pengunjung Per Tanggal</CardTitle>
                    <CardDescription>
                        Data Realtime Pengunjung Per Tanggal Dalam Bulan Ini, Waktu Server: {formattedServerTime}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Line data={visitorsPerDayData} options={chartOptions} />
                </CardContent>
            </Card> */}


        </div>
    )
}
