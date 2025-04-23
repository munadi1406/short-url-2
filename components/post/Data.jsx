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
import { Link2, SendHorizontal, Settings, SquarePlus, Wrench } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Switch } from "../ui/switch";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import Image from "next/image";
import EditLink from "./link/EditLink";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import BadgeRandomColor from "@/lib/BadgeRandomColor";
import SendMessage from "../SendMessage";

export default function Data() {
    const [query, setQuery] = useState("")
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('')

    useEffect(() => {
        const currentQuery = searchParams.get('search');
        const statusQuery = searchParams.get('status');

        setStatus(statusQuery)

        setQuery(currentQuery);
    }, [searchParams]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['post', query, status],
        queryFn: async ({ pageParam }) => {
            const response = await axios.get('/api/post', {
                params: {
                    ...(pageParam && { lastCreatedAt: pageParam }),
                    ...(query && { search: query }),
                    ...(status && { status })
                }
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.pagination.lastCreatedAt,

    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (e) => {
            const changeStatus = await axios.post('/api/post/status', { postId: e.postId, status: e.status ? 'publish' : 'draft' })
            return changeStatus.data
        },
        onSuccess: (data) => {
            toast({ title: "Success", description: data.msg, variant: "primary", })
            refetch()
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
        },
    })
    let searchTimeout;
    const search = (e) => {
        const query = e.target.value;
        
       
        if (!query) {
            
            router.push(window.location.pathname);
            
        }

        // Debounce search to optimize performance
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => {
            const currentSearch = searchParams.get('search') || "";
            if (query !== currentSearch) {
                router.push(`?search=${encodeURIComponent(query)}`);
            }
        }, 500);
    };

    const handleChangeStatus = (value) => {
        router.push(`?status=${encodeURIComponent(value)}`);
    }
    const handleClear = () => {
        router.push(window.location.pathname);
    }


    const [currentData, setCurrentData] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [typeEdit, setTypeEdit] = useState('')
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
    const handleCopy = async (link) => {
        try {
            await navigator.clipboard.writeText(link);
            toast({
                title: "Link Copied",
                description: "The link has been copied to your clipboard.",
                variant: "primary",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to copy the link.",
                variant: "destructive",
            });
            console.error("Copy failed: ", err);
        }
    };
    return (
        <div>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
                <div className="col-span-2">
                    <Label htmlFor="search">Search</Label>
                    <Input type="search" defaultValue={query} id="search" placeholder="search" onChange={search} />
                </div>
                <div className="flex justify-start items-end gap-2">
                    <div className="w-2/3">
                        <Label htmlFor="status">Filter Status</Label>
                        <Select id="status" onValueChange={handleChangeStatus} value={status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="publish">Publish</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Button onClick={handleClear}>Clear</Button>
                    </div>
                </div>
            </div>
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
                                        <Image className="w-auto h-auto" alt={post.title} src={post.image} height="100" width="50" />
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
                                                <BadgeRandomColor text={tag.name} key={tagId} />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2 ">
                                            {post?.genres?.map((genre, genreId) => (
                                                <BadgeRandomColor key={genreId} text={genre.name}/>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(post.updatedAt).toLocaleString()}</TableCell>
                                    <TableCell className="flex flex-wrap gap-2 justify-start">
                                        <Link href={`/dashboard/post/link/${post.id}`} className={buttonVariants({ className: "bg-yellow-500 text-white" })}><SquarePlus /></Link>
                                        <Button title="Edit Post" onClick={() => handleEdit(post, 'post')} ><Wrench /></Button>
                                        <SendMessage link={`${process.env.NEXT_PUBLIC_ENDPOINT_URL}${post.slug}`} title={post.title}/>
                                       
                                        <Button title="Edit Link" onClick={() => handleEdit(post, 'link')} className={buttonVariants({ className: "bg-slate-600 text-white" })}><Settings /></Button>
                                        <Button title="Copy Link" onClick={() => handleCopy(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}${post.slug}`)} className={buttonVariants({ className: "bg-indigo-600 text-white" })}> <Link2 /></Button>
                                        <DeletePost data={post} refetch={refetch} />
                                    </TableCell>
                                </TableRow>
                                {currentData?.id === post.id && isEdit && typeEdit === 'post' && (
                                    <TableRow>
                                        <TableCell colSpan="6">
                                            <EditPost post={currentData} refetch={refetch} />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {currentData?.id === post.id && isEdit && typeEdit === 'link' && (
                                    <TableRow>
                                        <TableCell colSpan="6">
                                            <EditLink data={post} />
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
