'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import IpAddress from "../IpLocation/IpAddress";
import { Button } from "../ui/button";

export default function UsersActive() {
    const fetchUsersActive = async ({ pageParam = null }) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/users/list`, {
                params: {
                    lastId: pageParam,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            return { users: [], lastId: null };
        }
    };

    const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['users-active'],
        queryFn: fetchUsersActive,
        getNextPageParam: (lastPage) => lastPage?.lastId || null,
        refetchInterval: 5000,
    });

    return (
        <>
            <Table className="h-[500px] overflow-y-scroll">
                <TableCaption>List Users Active</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Device</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={4}>Loading...</TableCell>
                        </TableRow>
                    )}

                    {data?.pages.flatMap((page) => page.users).map((e, i) => {
                        const splitIp = e.ipAddress?.split(',')[0] || "Unknown";
                        return (
                            <TableRow key={i}>
                                <TableCell scope="row">{e.sessionId}</TableCell>
                                <TableCell className="cursor-pointer">
                                    <IpAddress ipAddress={splitIp} />
                                </TableCell>
                                <TableCell>{e.status}</TableCell>
                                <TableCell>{e.userAgent}</TableCell>
                            </TableRow>
                        );
                    })}

                    {!isLoading && data?.pages.every((page) => page.users.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={4}>No active users found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>


            </Table>
           
            {hasNextPage && (
                <Button
                    onClick={() => fetchNextPage()}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Load More'}
                </Button>
            )}
        </>
    );
}
