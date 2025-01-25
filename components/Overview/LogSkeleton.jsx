import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from '../ui/skeleton'
export default function LogSkeleton() {
    return (
        <div className='w-full gap-2 w-full grid grid-cols-1 md:grid-cols-2'>
            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-64" />
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                    <div className='flex flex-col gap-2'>
                        {['User Aktif', 'User Baru', 'User Kembali', 'Total Pengunjung', 'Rata Rata Waktu'].map((label, index) => (
                            <div className='w-full border rounded-md grid grid-cols-2' key={index}>
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Visitors</CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-64" />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full flex flex-col gap-2">
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-semibold'>
                                Top Path
                            </h2>
                            {[...Array(3)].map((_, i) => (
                                <div className="w-full border rounded-md grid grid-cols-2" key={i}>
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>


        </div>
    )
}
