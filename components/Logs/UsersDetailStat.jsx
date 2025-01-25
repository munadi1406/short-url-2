'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ChartComponent from '../Chart/ChartComponent'
import Logs from '../Overview/Logs'
import UsersDetailSkeleton from './UsersDetailSkeleton'


export default function UsersDetailStat() {

    const { data, isLoading } = useQuery({
        queryKey: ['usersDetailStat'], queryFn: async () => {
            const datas = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/users/detail`)
            return datas.data.data
        },
    })
    if (isLoading) {
        return <UsersDetailSkeleton/>
    }
    const usersPerDay = {
        labels: data?.usersPerDay?.map(item => item.day),
        datasets: [
            {
                label: 'Users per Day',
                data: data?.usersPerDay?.map(item => item.userCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    };
    const usersPerMonth = {
        labels: data?.usersPerMonth?.map(item => item.month),
        datasets: [
            {
                label: 'Users per month',
                data: data?.usersPerMonth?.map(item => item.userCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    };
    const usersPerYears = {
        labels: data?.usersPerYear?.map(item => item.year),
        datasets: [
            {
                label: 'Users per years',
                data: data?.usersPerYear?.map(item => item.userCount),
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
                <ChartComponent chartData={usersPerDay} title='User Per Hari' desc="Data Users Per 1 Hari Dalam Bulan Ini" serverTime={data.serverTime}/>
                <ChartComponent chartData={usersPerMonth} title="User Per Bulan" desc="Data Users Per Bulan Dan Tahun Ini"serverTime={data.serverTime} />
                <ChartComponent chartData={usersPerYears} title="User Per Tahun" desc="Data Users Dalam Tahun Ini" serverTime={data.serverTime}/>
            </div>
        </div>
    )
}
