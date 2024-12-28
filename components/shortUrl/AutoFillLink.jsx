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
import { Button } from "../ui/button";
import EditForm from "./EditForm";
import CopyButton from "../CopyButton";
import DialogAdd from "./DialogAdd";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "../ui/badge";



export default function AutoFillLink({ handleAutoFill}) {
   
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false);




    const handleToggle = (url) => {
        handleAutoFill(url)
        setOpen(false);
    };
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: [`links-categori`],
        queryFn: async ({ pageParam }) => {
            const response = await axios.get(`/api/shorten?${pageParam ? `lastCreatedAt=${pageParam}` : ''}&category=true${query ? `&search=${query}` : ''}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.pagination.lastCreatedAt,
    });


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
    const [isAdd, setIsAdd] = useState(false)
    const handleAdd = (e) => {
        setCurrentData(e)
        setIsAdd(true)
    }

    let searchTimeout;
    const search = (e) => {
        const query = e.target.value;

        if (query.length > 3) {
            // setIsSearch(true);
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            searchTimeout = setTimeout(async () => {
                setQuery(query);
            }, 2000);
        } else {
            setQuery("");
        }
    };
    useEffect(() => {
        refetch()
    }, [query])

    return (
        <div>
            <Badge  onClick={() => setOpen(true)}>Auto Fill</Badge>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Auto Fill Link</DialogTitle>
                        <DialogDescription>
                            Cari Dan Pilih
                        </DialogDescription>
                        <div className="h-[80vh] overflow-auto px-2">
                            <DialogAdd refetch={refetch} isOpen={isAdd} setIsOpen={setIsAdd} currentData={currentData} />
                            <Label htmlFor="search">Search</Label>
                            <Input type="search" id="search" placeholder="search" onChange={search} />
                            <Table className="overflow-scroll ">
                                <TableCaption>Daftar Link yang Tersedia</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Judul</TableHead>
                                       
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

                                        data?.pages?.flatMap((page) => page.data).map((link, index) => (
                                            <Fragment key={link.id}>
                                                <TableRow >
                                                    <TableCell className="font-medium" onClick={() => handleToggle(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}l/${link.short_url}`)}>{index + 1}</TableCell>
                                                    <TableCell onClick={() => handleToggle(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}l/${link.short_url}`)}>

                                                        {link.title}

                                                    </TableCell>
                                                   
                                                    
                                                    <TableCell className="flex flex-wrap gap-2 justify-center">
                                                        
                                                        
                                                        
                                                        <CopyButton textToCopy={`${process.env.NEXT_PUBLIC_ENDPOINT_URL}l/${link.short_url}`} />
                                                      
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
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>


    );
}
