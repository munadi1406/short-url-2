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
import React, { Fragment, useState } from 'react';
import { Button } from "../ui/button";
import EditGenre from "./EditGenre";
import DeleteGenre from "./DeleteGenre";
import { Wrench } from "lucide-react";
import CreateGenre from "./CreateGenre";


export default function Data() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['genre'],
        queryFn: async ({ pageParam }) => {
            const response = await axios.get(`/api/genre?${pageParam ? `lastCreatedAt=${pageParam}` : ''}`);
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
            <CreateGenre refetch={refetch} />
            <Table className="overflow-scroll ">
                <TableCaption>Daftar Genre yang Tersedia</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead>createdAt</TableHead>
                        <TableHead>updatedAt</TableHead>
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
                        data?.pages?.flatMap((page) => page.data).map((genre, index) => (
                            <Fragment key={genre.id}>
                                <TableRow>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        {genre.name}
                                    </TableCell>

                                    <TableCell>{new Date(genre.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(genre.updatedAt).toLocaleString()}</TableCell>
                                    <TableCell className="flex flex-wrap gap-2 justify-start">

                                        <Button onClick={() => handleEdit(genre)} ><Wrench /></Button>

                                        <DeleteGenre data={genre} refetch={refetch} />
                                    </TableCell>
                                </TableRow>

                                {/* Menampilkan form edit jika sedang dalam mode edit */}
                                {currentData?.id === genre.id && isEdit && (
                                    <TableRow>
                                        <TableCell colSpan="5">
                                            <EditGenre data={currentData} refetch={refetch}/>
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
