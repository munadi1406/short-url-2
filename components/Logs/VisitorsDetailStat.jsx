'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ChartComponent from '../Chart/ChartComponent'
import Logs from '../Overview/Logs'
import VisitorsDetailSkeleton from './VisitorsDetailSkeleton'


export default function VisitorsDetailStat() {

    const { data, isLoading } = useQuery({
        queryKey: ['visitorsDetailStat'], queryFn: async () => {
            const datas = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/visitors/detail`)
            return datas.data.data
        },
        refetchInterval:10000,
    })
    if (isLoading) {
        return <VisitorsDetailSkeleton/>
    }
    
    const visitorsPerDay = {
        labels: data?.visitorsPerDay?.map(item => item.day),
        datasets: [
            {
                label: 'Visits per Day',
                data: data?.visitorsPerDay?.map(item => item.visitCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    };
    const visitorsPerHour = {
        labels: data?.visitorsPerHour?.map(item => item.hour),
        datasets: [
            {
                label: 'Visits per hour',
                data: data?.visitorsPerHour?.map(item => item.visitCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    };
    const visitorsPerMonth = {
        labels: data?.visitorsPerMonth?.map(item => item.month),
        datasets: [
            {
                label: 'Visits per month',
                data: data?.visitorsPerMonth?.map(item => item.visitCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    };
    const visitorsPerYears = {
        labels: data?.visitorsPerYear?.map(item => item.year),
        datasets: [
            {
                label: 'Visits per year',
                data: data?.visitorsPerYear?.map(item => item.visitCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    };
    

    return (
        <div className='space-y-2'>
            <Logs footer={false}/>
            <div className='flex flex-col gap-2'>
                <ChartComponent chartData={visitorsPerHour} title='View Per Jam' desc="Data view Per Jam Dalam Hari Ini" serverTime={data.serverTime}/>
                <ChartComponent chartData={visitorsPerDay} title='View Per Hari' desc="Data view Per Hari Dalam bulan Ini" serverTime={data.serverTime}/>
                <ChartComponent chartData={visitorsPerMonth} title='View Per Bulan' desc="Data view Per Bulan Dalam Tahun Ini" serverTime={data.serverTime}/>
                <ChartComponent chartData={visitorsPerYears} title='View Per Tahun' desc="Data view Per Tahun " serverTime={data.serverTime}/>
            </div>
        </div>
    )
}
