'use client'

import { Skeleton } from "../ui/skeleton";

export default function IpAddressSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    );
}
