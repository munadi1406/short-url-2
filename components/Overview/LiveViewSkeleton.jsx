// components/SkeletonLiveActivityUsers.jsx
'use client'

 // Import Skeleton dari Shadcn UI
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; // Pastikan menggunakan table dari komponen UI Anda
import { Card, CardContent, CardHeader,  } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

export default function LiveViewSkeleton() {
    return (
        <div className='w-full space-y-2'>
            <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
                <Card>
                    <CardHeader>
                        {/* Skeleton untuk CardHeader */}
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </CardHeader>
                    <CardContent className="w-full">
                        {/* Skeleton untuk Table */}
                        <Table>
                            <TableCaption>
                                <Skeleton className="h-4 w-[200px]" />
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        <Skeleton className="h-4 w-[100px]" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-[150px]" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-[200px]" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Skeleton className="h-6 w-[100px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-6 w-[150px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-6 w-[200px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-6 w-[100px]" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
