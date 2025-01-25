'use client';

import { useEffect, useState } from 'react';

const ServerTimeDifference = ({ serverTimeISO }) => {
    const [timeDifference, setTimeDifference] = useState('');

    useEffect(() => {
        if (serverTimeISO) {
            // Server time is already in UTC
            const serverTime = new Date(serverTimeISO); // Server time in UTC
      

            // Get the local time and convert it to UTC
            const localTime = new Date(); // Local time in local timezone
            const localTimeUTC = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000); // Convert to UTC

            // Calculate the time difference in milliseconds
            const diffInMilliseconds = localTimeUTC.getTime() - serverTime.getTime();

            // Convert to absolute values for formatting
            const diffInSeconds = Math.abs(Math.floor(diffInMilliseconds / 1000));
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            const diffInHours = Math.floor(diffInMinutes / 60);
            const remainingMinutes = diffInMinutes % 60;
            const remainingSeconds = diffInSeconds % 60;

            // Determine if the server time is ahead or behind
            const isAhead = diffInMilliseconds < 0; // Negative means server is ahead

            // Format the time difference with correct sign
            const formattedDifference = `${isAhead ? '+' : '-'}${Math.abs(diffInHours)}jam ${remainingMinutes}menit ${remainingSeconds}detik`;
            setTimeDifference(formattedDifference);
        }
    }, [serverTimeISO]);

    return (
        <div className="mt-2 border-t">
            <p>
                <strong>Server Time (UTC):</strong> {new Date(serverTimeISO).toLocaleString('en-GB', { timeZone: 'UTC' })} {/* Display server time in UTC */}
            </p>
            <p>
                <strong>Local Time (UTC):</strong> {new Date().toLocaleString('en-GB', { timeZone: 'UTC' })} {/* Display local time in UTC */}
            </p>
            <p>
                <strong>Difference:</strong> {timeDifference}
            </p>
        </div>
    );
};

export default ServerTimeDifference;
