'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Data() {
    const [stats, setStats] = useState({
        totalVisitors: 0,
        todayVisitors: 0,
        groupedStats: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/stat');
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch visitor stats:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Visitor Statistics</h1>
            <div className="mb-4">
                <p className="text-lg">
                    <strong>Total Visitors:</strong> {stats.totalVisitors}
                </p>
                <p className="text-lg">
                    <strong>Today&apos;s Visitors:</strong> {stats.todayVisitors}
                </p>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Visitors by Page:</h2>
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Page</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Total Visitors</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.groupedStats.map((stat, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{stat.page || 'Unknown'}</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    {stat.totalVisitors}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
