'use client'

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
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
import { useInView } from 'react-intersection-observer';
import { Eye, Trash, Wrench } from "lucide-react"
import Link from 'next/link';
import DeleteArticle from './DeleteArticle';

export default function Data() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['article'],
        queryFn: async ({ pageParam }) => {
            const response = await axios.get(`/api/article?${pageParam ? `lastCreatedAt=${pageParam}` : ''}`);

            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.pagination.lastCreatedAt,
    });
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.5,
    });
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, inView]);
    return (
        <div className='px-2 py-4 shadow-md rounded-md border border-gray-300'>
            <Link className={buttonVariants()} href={'/dashboard/article/create'}>Create Article</Link>
            <Table className="overflow-scroll ">
                <TableCaption>Daftar Artikel yang anda</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Title</TableHead>
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
                        data?.pages?.flatMap((page) => page.data).map((article, index) => (
                            <Fragment key={article.id}>
                                <TableRow>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        {article.title}
                                    </TableCell>
                                    <TableCell>{article.visitorCount}</TableCell>
                                    <TableCell>{new Date(article.createdAt).toLocaleString()}</TableCell>
                                    <TableCell className="flex flex-wrap gap-2 justify-center">
                                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleEdit(article)}><Wrench /></Button>
                                        <Link target='_blank' href={`/${article.slug}`} className={buttonVariants()}><Eye /></Link>

                                        <DeleteArticle data={article} refetch={refetch} />
                                    </TableCell>
                                </TableRow>
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
    )
}
