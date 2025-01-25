'use client'

import { Skeleton } from "../ui/skeleton";


export default function OtherSkeleton() {
    return (
        <div className="space-y-4">
            {/* Skeleton untuk Chart */}
            <div className="w-full h-64">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Skeleton untuk Card - User Agent */}
            <div className="space-y-4">
                <div className="h-10">
                    <Skeleton className="h-full w-[150px]" />
                </div>
                <div className="w-full">
                    <Skeleton className="h-[200px]" />
                </div>
            </div>

            {/* Skeleton untuk Card - Referer */}
            <div className="space-y-4">
                <div className="h-10">
                    <Skeleton className="h-full w-[150px]" />
                </div>
                <div className="w-full">
                    <Skeleton className="h-[200px]" />
                </div>
            </div>
        </div>
    );
}
