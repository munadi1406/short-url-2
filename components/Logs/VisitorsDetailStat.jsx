'use client'
import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import ChartComponent from '../Chart/ChartComponent';
import Logs from '../Overview/Logs';
import VisitorsDetailSkeleton from './VisitorsDetailSkeleton';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function VisitorsDetailStat() {
    // State untuk filter tanggal
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Fungsi fetch dengan parameter dinamis
    const fetchVisitorsData = (endpoints) => {
        return endpoints.map(endpoint => ({
            queryKey: [endpoint, startDate, endDate],
            queryFn: async () => {
                const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${endpoint}`;
                const response = await axios.get(url, {
                    params: {
                        ...(startDate && { startDate }), // Hanya menambahkan jika startDate ada
                        ...(endDate && { endDate })     // Hanya menambahkan jika endDate ada
                    },
                });
                
                return response.data.data;
            },
        }));
    };

    const endpoints = ['/api/logs/hourly', '/api/logs/daily', '/api/logs/monthly', '/api/logs/yearly'];

    // Fetch data menggunakan react-query
    const visitorsQueries = useQueries({
        queries: fetchVisitorsData(endpoints),
    });

    // Cek loading state
    const isLoading = visitorsQueries.some(query => query.isLoading);
    if (isLoading) return <VisitorsDetailSkeleton />;

    // Destruktur data hasil fetch
    const [hourlyData, dailyData, monthlyData, yearlyData] = visitorsQueries.map(query => query.data);

    // Data untuk Chart.js
    const visitorsPerDay = {
        labels: dailyData?.visitorsPerDay?.map(item => item.day),
        datasets: [
            {
                label: 'Visits per Day',
                data: dailyData?.visitorsPerDay?.map(item => item.visitCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const visitorsPerHour = {
        labels: hourlyData?.map(item => item.hour),
        datasets: [
            {
                label: 'Visits per Hour',
                data: hourlyData?.map(item => item.visitCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const visitorsPerMonth = {
        labels: monthlyData?.visitorsPerMonth?.map(item => item.month),
        datasets: [
            {
                label: 'Visits per Month',
                data: monthlyData?.visitorsPerMonth?.map(item => item.visitCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const visitorsPerYears = {
        labels: yearlyData?.map(item => item.year),
        datasets: [
            {
                label: 'Visits per Year',
                data: yearlyData?.map(item => item.visitCount),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Event handler untuk mengatur tanggal
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);
    const serverTime = dailyData?.serverTime
   

    return (
        <div className='space-y-4'>
            {/* Komponen Logs */}
            <Logs footer={false} />
            {/* Chart Section */}
            <div className='flex flex-col gap-4'>
                <ChartComponent chartData={visitorsPerHour} title='View Per Jam' desc="Data view Per Jam Dalam Hari Ini" serverTime={serverTime}/>
                <ChartComponent chartData={visitorsPerDay} title='View Per Hari' desc="Data view Per Hari Dalam Bulan Ini" serverTime={serverTime}/>
                <ChartComponent chartData={visitorsPerMonth} title='View Per Bulan' desc="Data view Per Bulan Dalam Tahun Ini" serverTime={serverTime}/>
                <ChartComponent chartData={visitorsPerYears} enableFilter={false} title='View Per Tahun' desc="Data view Per Tahun" serverTime={serverTime}/>
            </div>
        </div>
    );
}
