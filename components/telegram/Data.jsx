/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { Fragment, useEffect, useState } from 'react';
import { Button, buttonVariants } from "../ui/button";
import EditForm from "./EditForm";
import DeleteChanel from "./DeleteChanel";
import {  Wrench } from "lucide-react";
import FormCreate from "./FormCreate";
import SendMessage from "./SendMessage";
 
export default function Data() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['links'],
        queryFn: async ({ pageParam }) => {
            const response = await axios.get(`/api/telegram?${pageParam ? `lastCreatedAt=${pageParam}` : ''}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.pagination.lastCreatedAt,
    });


    // State untuk data saat ini dan mode edit
    const [currentData, setCurrentData] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    // Fungsi untuk mengatur mode edit
    const handleEdit = (data) => {
        if (isEdit && currentData.id === data.id) {
            setCurrentData({});
            setIsEdit(false);
        } else {
            setCurrentData(data);
            setIsEdit(true);
        }
    };


    return (
        <div >
            <FormCreate refetch={refetch}/>
            <SendMessage channels={data?.pages?.flatMap((page) => page.data)}/>
            <Table className="overflow-scroll ">
                <TableCaption>Daftar Chanel yang Tersedia</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Id Chanel</TableHead>
                        <TableHead>Tanggal Dibuat</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Jika sedang loading */}
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan="5">Memuat data...</TableCell>
                        </TableRow>
                    ) : (
                        // Menampilkan data dari setiap halaman
                        data?.pages?.flatMap((page) => page.data).map((telegram, index) => (
                            <Fragment key={telegram.id}>
                                <TableRow>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>

                                        {telegram.title}

                                    </TableCell>
                                    <TableCell>0</TableCell>
                                    <TableCell>{new Date(telegram.createdAt).toLocaleString()}</TableCell>
                                    <TableCell className="flex flex-wrap gap-2 justify-center">

                                        <Button onClick={() => handleEdit(telegram)} ><Wrench /></Button>

                                        <DeleteChanel data={telegram} refetch={refetch} />
                                    </TableCell>
                                </TableRow>

                                {/* Menampilkan form edit jika sedang dalam mode edit */}
                                {currentData?.id === telegram.id && isEdit && (
                                    <TableRow>
                                        <TableCell colSpan="5">
                                            <EditForm data={currentData} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))
                    )}

                    {/* Jika tidak ada data */}
                    {!isLoading && data?.pages.length === 0 && (
                        <TableRow>
                            <TableCell colSpan="5">Tidak ada data tersedia</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Tombol untuk memuat lebih banyak data */}
            {hasNextPage && (
                <Button
                    onClick={fetchNextPage}
                   
                    disabled={isFetchingNextPage}
                    className="mt-4"
                >
                    {isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
                </Button>
            )}
        </div>
    );
}
