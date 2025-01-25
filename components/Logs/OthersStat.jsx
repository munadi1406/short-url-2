'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ChartComponent from '../Chart/ChartComponent'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import OtherSkeleton from './OtherSkeleton'


export default function OthersStat() {

    const { data, isLoading } = useQuery({
        queryKey: ['usersDetailStat'], queryFn: async () => {
            const datas = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/other`)
            return datas.data.data
        },
    })
    if (isLoading) {
        return <OtherSkeleton/>
    }

    const osStats = {
        labels: data?.osStats?.map(item => item.os),
        datasets: [
            {
                label: data?.osStats?.map(item => item.os),
                data: data?.osStats?.map(item => item.count),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    };



    return (
        <div className='space-y-2'>
            <div className='flex flex-col gap-2'>
                <ChartComponent chartData={osStats} title='Operating System' desc="Data Sistem Operasi Users" />
                <Card>
                    <CardHeader>
                        <CardTitle>User Agent</CardTitle>
                        <CardDescription>
                            Data User Agent
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full">
                        <Table>
                            <TableCaption>List User Agent</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead >User Agent</TableHead>
                                    <TableHead>Jumlah</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.userAgentStats.map((e, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{e.userAgent}</TableCell>
                                        <TableCell>{e.count}</TableCell>
                                    </TableRow>
                                )
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Referer</CardTitle>
                        <CardDescription>
                            Data Referer
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full">
                        <Table>
                            <TableCaption>List Referer</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead >Referer</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.refererStats.map((e, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{e.referer}</TableCell>
                                        <TableCell>{e.count}</TableCell>
                                    </TableRow>
                                )
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
