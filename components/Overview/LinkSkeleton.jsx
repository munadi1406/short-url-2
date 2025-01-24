import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from '../ui/skeleton'

export default function LinkSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Statistik Link</CardTitle>
                <CardDescription>
                    Data Total URL Dan Link
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <div>
                        <h3 className='text-xs font-semibold text-gray-900 mb-2'>
                            Total Url
                        </h3>
                        <div className='flex gap-2'>
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                    <div>
                        <h3 className='text-xs font-semibold text-gray-900 mb-2'>
                            Total Link
                        </h3>
                        <div className='flex gap-2'>
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                    <div>
                        <h3 className='text-xs font-semibold text-gray-900 mb-2'>
                            Total Post
                        </h3>
                        <div className='flex gap-2'>
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
