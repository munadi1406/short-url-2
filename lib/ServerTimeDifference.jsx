'use client';

import { useEffect, useState } from 'react';

const ServerTimeDifference = ({ serverTimeISO }) => {
    const [timeDifference, setTimeDifference] = useState('');
    const [localTime, setLocalTime] = useState(new Date());

    useEffect(() => {
        if (serverTimeISO) {
            const serverTime = new Date(serverTimeISO).getTime(); // Waktu server dalam UTC (milidetik)

            // Update waktu lokal dan hitung selisih waktu setiap detik
            const interval = setInterval(() => {
                const currentLocalTime = new Date(); // Waktu komputer pengguna
                setLocalTime(currentLocalTime); // Update waktu lokal

                // Konversi waktu lokal ke UTC
                const localTimeUTC = currentLocalTime.getTime() - currentLocalTime.getTimezoneOffset() * 60000;

                // Hitung selisih waktu dalam milidetik
                const diffInMilliseconds = localTimeUTC - serverTime;

                // Konversi ke jam, menit, dan detik
                const diffInSeconds = Math.abs(Math.floor(diffInMilliseconds / 1000));
                const diffInMinutes = Math.floor(diffInSeconds / 60);
                const diffInHours = Math.floor(diffInMinutes / 60);
                const remainingMinutes = diffInMinutes % 60;
                const remainingSeconds = diffInSeconds % 60;

                // Tentukan apakah server lebih cepat atau lambat
                const isAhead = diffInMilliseconds < 0; // Jika negatif, server lebih cepat

                // Format hasil perbedaan waktu
                const formattedDifference = `${isAhead ? '+' : '-'}${Math.abs(diffInHours)} jam ${remainingMinutes} menit ${remainingSeconds} detik`;
                setTimeDifference(formattedDifference);
            }, 1000);

            // Bersihkan interval saat komponen di-unmount
            return () => clearInterval(interval);
        }
    }, [serverTimeISO]);

    return (
        <div className="mt-2 border-t p-2">
            <p>
                <strong>Server Time (UTC):</strong> {new Date(serverTimeISO).toLocaleString('en-GB', { timeZone: 'UTC' })}
            </p>
            <p>
                <strong>Local Time:</strong> {localTime.toLocaleString()} {/* Waktu lokal komputer */}
            </p>
            <p>
                <strong>Difference:</strong> {timeDifference}
            </p>
        </div>
    );
};

export default ServerTimeDifference;