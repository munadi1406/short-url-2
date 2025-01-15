/* eslint-disable react-hooks/exhaustive-deps */
'use client'


import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
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
// import EditGenre from "./EditGenre";
// import DeleteGenre from "./DeleteGenre";
import { Settings, SquarePlus, Wrench } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Switch } from "../ui/switch";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import Image from "next/image";
import EditLink from "./link/EditLink";
import { Label } from "../ui/label";
import { Input } from "../ui/input";


export default function Data() {
    const [query,setQuery] = useState('')
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
            const response = await axios.get(`/api/post?${pageParam ? `lastCreatedAt=${pageParam}` : ''}${query ?`&search=${query}` : ''}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.pagination.lastCreatedAt,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (e) => {
            const changeStatus = await axios.post('/api/post/status', { postId: e.postId, status: e.status ? 'publish' : 'draft' })
            return changeStatus.data
        }
    })
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
    useEffect(()=>{
        refetch()
    },[query])
    const [currentData, setCurrentData] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [typeEdit,setTypeEdit] = useState('')
    const handleEdit = (data, type) => {
        if (isEdit && currentData.id === data.id && typeEdit === type) {
            // Reset state if the same item is clicked again
            setCurrentData({});
            setIsEdit(false);
            setTypeEdit('');
        } else {
            // Set the new data and type
            setCurrentData(data);
            setIsEdit(true);
            setTypeEdit(type);
        }
    };
    return (
        <div>
            <Label htmlFor="search">Search</Label>
            <Input type="search" id="search" placeholder="search" onChange={search}/>
            <Table className="overflow-scroll ">
                <TableCaption>Daftar Genre yang Tersedia</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Genres</TableHead>
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
                        data?.pages?.flatMap((page) => page.data).map((post, index) => (
                            <Fragment key={post.id}>
                                <TableRow>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        {post.title}
                                      
                                        <Image className="w-auto h-auto" alt={post.title} src={post.image} height="100" width="50"/>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            defaultChecked={post.status === 'publish'}
                                            onCheckedChange={(e) => mutate({ postId: post.id, status: e })}
                                            disabled={isPending}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-wrap gap-2 ">
                                            {post?.tags?.map((tag, tagId) => (
                                                <Badge key={tagId}>{tag.name}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2 ">
                                            {post?.genres?.map((genre, genreId) => (
                                                <Badge key={genreId}>{genre.name}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(post.updatedAt).toLocaleString()}</TableCell>
                                    <TableCell className="flex flex-wrap gap-2 justify-start">
                                        <Link href={`/dashboard/post/link/${post.id}`} className={buttonVariants({className:"bg-yellow-500 text-white"})}><SquarePlus /></Link>
                                        <Button onClick={() => handleEdit(post,'post')} ><Wrench /></Button>
                                        <Button onClick={() => handleEdit(post,'link')} className={buttonVariants({className:"bg-slate-600 text-white"})}><Settings /></Button>
                                        <DeletePost data={post} refetch={refetch} />
                                    </TableCell>
                                </TableRow>
                                {currentData?.id === post.id && isEdit && typeEdit === 'post' && (
                                    <TableRow>
                                        <TableCell colSpan="6">
                                           <EditPost post={currentData} refetch={refetch}/>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {currentData?.id === post.id && isEdit && typeEdit === 'link' && (
                                    <TableRow>
                                        <TableCell colSpan="6">
                                          <EditLink data={post}/>
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
    )
}
