'use client'

import { Skeleton } from '@shadcn/ui'; // Import Skeleton dari Shadcn UI

export default function VisitorsDetailSkeleton() {
    return (
        <div className="space-y-4">
            {/* Skeleton untuk Logs */}
            <div className="h-[60px]">
                <Skeleton className="h-full w-[200px]" />
            </div>

            {/* Skeleton untuk Chart Visits Per Jam */}
            <div className="h-64">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Skeleton untuk Chart Visits Per Hari */}
            <div className="h-64">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Skeleton untuk Chart Visits Per Bulan */}
            <div className="h-64">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Skeleton untuk Chart Visits Per Tahun */}
            <div className="h-64">
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    );
}
