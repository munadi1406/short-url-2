'use client';

import { useEffect, useState, useRef, Fragment } from "react";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";


export default function Search({ placeholder }) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null); // Menggunakan ref untuk menyimpan timeout

    const { data, isLoading, isError } = useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            const response = await axios.get(`/api/post/search/?search=${query}`);
            return response.data;
        },
        enabled: query.length >= 3, // Query hanya dijalankan jika panjang query >= 3
        refetchOnWindowFocus: false, // Opsional: Hindari refetch otomatis saat fokus kembali ke jendela
    });

    const handleSearch = (e) => {
        const input = e.target.value;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setQuery(input);
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    const navigate = useRouter()

    const handleNavigate = (slug) => {
        setOpen(false)
        navigate.push(`/${slug}`)
    }

    return (
        <div className="relative">

            <SearchIcon onClick={() => setOpen(true)} className="cursor-pointer"/>
            <Drawer open={open} onOpenChange={setOpen}>

                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Search</DrawerTitle>
                        <DrawerDescription>-</DrawerDescription>
                    </DrawerHeader>
                    <div className="h-[70vh] p-2 overflow-auto">
                        <div className="w-full">
                            <Input
                                id="search"
                                type="text"
                                placeholder={placeholder}
                                onChange={handleSearch}

                            />
                        </div>
                        <div className="mt-2 ">
                            {isLoading &&
                                <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
                                    <Skeleton className={"w-full h-[150px] rounded-md"} />
                                    <Skeleton className={"w-full h-[150px] rounded-md"} />
                                    <Skeleton className={"w-full h-[150px] rounded-md"} />
                                    <Skeleton className={"w-full h-[150px] rounded-md"} />
                                </div>}
                            {isError && <div>Something went wrong</div>}
                            {data?.data?.length === 0 && <div>No data found</div>}
                            <div className="grid md:grid-cols-3 grid-cols-2 gap-2 ">
                                {data?.data?.map((e, i) => (
                                    <div key={i} className="flex gap-2 border p-2 rounded-md cursor-pointer" onClick={() => handleNavigate(e.slug)}>
                                        <div>
                                            <Image height="100" width="100" src={e.image} alt={e.title} />
                                        </div>
                                        <div className="space-y-2">
                                            <h1 className="font-semibold">
                                                {e.title}
                                            </h1>
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    e.tags.map((tag, subIndex) => (
                                                        <Badge key={subIndex}>{tag.name}</Badge>
                                                    ))
                                                }
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    e.genres.map((genre, subIndex) => (
                                                        <Badge variant={"outline"} key={subIndex}>{genre.name}</Badge>
                                                    ))
                                                }
                                            </div>
                                            <p className='text-xs text-gray-600'>{e?.description?.length > 100 ? `${e.description.slice(0, 100)}...` : e?.description}</p>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>

                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

        </div>
    );
}
