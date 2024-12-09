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
import { useInView } from 'react-intersection-observer'; // Import hook untuk IntersectionObserver
import { Button, buttonVariants } from "../ui/button";
import EditForm from "./EditForm";
import DeleteLink from "./DeleteLink";
import Link from "next/link";
import { Eye, Wrench } from "lucide-react";
import ByCategory from './ByCategory'

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
            const response = await axios.get(`/api/shorten?${pageParam ? `lastCreatedAt=${pageParam}` : ''}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.pagination.lastCreatedAt,
    });

    // Konfigurasi IntersectionObserver
    const { ref, inView } = useInView({
        triggerOnce: false, // Memastikan observer aktif berkali-kali
        threshold: 0.5, // Memuat data saat 50% elemen terlihat
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

    // // Efek samping untuk memuat halaman berikutnya saat observer terlihat
    // useEffect(() => {
    //     if (inView && hasNextPage) {
    //         fetchNextPage();
    //     }
    // }, [inView]);

    return (
        <div >

            <ByCategory />

            <Table className="overflow-scroll ">
                <TableCaption>Daftar Link yang Tersedia</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>View</TableHead>
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
                        data?.pages?.flatMap((page) => page.data).map((link, index) => (
                            <Fragment key={link.id}>
                                <TableRow>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <a
                                            className="hover:text-blue-600 hover:underline"
                                            href={link.link}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {link.title}
                                        </a>
                                    </TableCell>
                                    <TableCell>0</TableCell>
                                    <TableCell>{new Date(link.createdAt).toLocaleString()}</TableCell>
                                    <TableCell className="flex flex-wrap gap-2 justify-center">
                                        {console.log(link)}
                                        <Button onClick={() => handleEdit(link)} ><Wrench /></Button>
                                        <Link href={`/link/${link.short_url}`} target="_blank" className={buttonVariants()}><Eye /></Link>
                                        <DeleteLink data={link} refetch={refetch} />
                                    </TableCell>
                                </TableRow>

                                {/* Menampilkan form edit jika sedang dalam mode edit */}
                                {currentData?.id === link.id && isEdit && (
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
                    ref={ref}
                    disabled={isFetchingNextPage}
                    className="mt-4"
                >
                    {isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
                </Button>
            )}
        </div>
    );
}
