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
import { Eye, Plus, SendHorizontal, Wrench } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import DeleteLinkCategory from "./DeleteLinkCategory";
import CopyButton from "../CopyButton";
import DialogAdd from "./DialogAdd";


export default function ByCateory({ handleClickSendMessage }) {
    const [expandedLinks, setExpandedLinks] = useState({});

    // Fungsi untuk toggle sub-link
    const handleToggle = (id) => {
        setExpandedLinks((prev) => ({
            ...prev,
            [id]: !prev[id],  // Toggle state berdasarkan ID link
        }));
    };
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['links-categori'],
        queryFn: async ({ pageParam }) => {
            const response = await axios.get(`/api/shorten?${pageParam ? `lastCreatedAt=${pageParam}` : ''}&category=true`);
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
    const [isAdd,setIsAdd] = useState(false)
    const handleAdd = (e)=>{
        setCurrentData(e)
        setIsAdd(true)
    }

    return (
        <div >
            <DialogAdd refetch={refetch} isOpen={isAdd} setIsOpen={setIsAdd} currentData={currentData}/>
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

                        data?.pages?.flatMap((page) => page.data).map((link, index) => (
                            <Fragment key={link.id}>
                                <TableRow onClick={() => handleToggle(link.id)}>
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
                                        <Button className="text-xs bg-slate-900" onClick={() => handleAdd(link)}><Plus /> </Button>
                                        <Button onClick={() => handleEdit(link)}><Wrench /></Button>
                                        <Link href={`/l/${link.short_url}`} target="_blank" className={`${buttonVariants()} bg-yellow-400 hover:bg-yellow-500`}><Eye /></Link>
                                        <Button onClick={() => handleClickSendMessage({ title: link.title, link: `l/${link.short_url}` })} className="bg-green-600 hover:bg-green-300"><SendHorizontal /></Button>
                                        <CopyButton textToCopy={`${process.env.NEXT_PUBLIC_ENDPOINT_URL}l/${link.short_url}`} />
                                        <DeleteLinkCategory data={link} refetch={refetch} />
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


                                {link.links && link.links.length > 0 && (
                                    expandedLinks[link.id] && (
                                        <TableRow>
                                            <TableCell colSpan="5" className="pl-10">
                                                <Table className="min-w-full border-l border-blue-600">
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
                                                        {link.links.map((subLink, subIndex) => (
                                                            <TableRow key={subLink.id}>
                                                                <TableCell className="font-medium">{subIndex + 1}</TableCell>
                                                                <TableCell className="font-medium">{subLink.title}</TableCell>
                                                                <TableCell className="font-medium">0</TableCell>
                                                                <TableCell className="font-medium">{new Date(subLink.createdAt).toLocaleString()}</TableCell>
                                                                <TableCell className="flex gap-2">

                                                                    <Button className="text-xs" onClick={() => handleEdit(subLink)}><Wrench /></Button>
                                                                    <Link href={`/l/${subLink.short_url}`} target="_blank" className={`${buttonVariants()} bg-yellow-400 hover:bg-yellow-500`}><Eye /></Link>
                                                                    <Button onClick={() => handleClickSendMessage({ title: link.subLink, link: `l/${subLink.short_url}` })} className="bg-green-600 hover:bg-green-300"><SendHorizontal /></Button>
                                                                    <CopyButton textToCopy={`${process.env.NEXT_PUBLIC_ENDPOINT_URL}l/${subLink.short_url}`} />
                                                                    <DeleteLink data={subLink} refetch={refetch} />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableCell>
                                        </TableRow>
                                    ))}

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
