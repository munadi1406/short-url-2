'use client'

import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog";
import { useEffect, useState, useRef } from "react";
import { Badge } from "../ui/badge";


export default function AutoFill({handleAutoFill}) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useRef("");
    const [open,setOpen] = useState(false)

    const handleClick = async (data) => {
        const detail = await axios.get(`/api/movie/detail?id=${data.id}&type=${data.media_type}`);
        const datas = detail.data.data;
        handleAutoFill(datas)
    };

    const movieData = useQuery({
        queryKey: [`movie`, debouncedQuery.current], 
        queryFn: async () => {
            const movie = await axios.get(`/api/movie?search=${debouncedQuery.current}`);
            return movie.data;
        },
        enabled: debouncedQuery.current.length > 3, 
    });

    const debounceTimeout = useRef(null);

    const handleSearch = (e) => {
        const newQuery = e.target.value;

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            debouncedQuery.current = newQuery; // Update debounced query
            setQuery(newQuery); // Trigger query update
        }, 300); // Adjust debounce delay as needed
    };

    useEffect(() => {
        if (query.length > 3) {
            movieData.refetch();
        }
    }, [query]);

    return (
      <div>
      <Badge onClick={()=>setOpen(true)}>Auto Fill</Badge>
        <Dialog open={open} onOpenChange={setOpen}>
           <DialogContent>
               <DialogHeader>
                   <DialogTitle>Auto Fill</DialogTitle>
                   <DialogDescription>
                       Cari dan pilih
                   </DialogDescription>
                   <div>
                       <div className="p-2">
                           <Label>Search</Label>
                           <Input 
                               type="search" 
                               placeholder="Search..." 
                               onChange={handleSearch} 
                           />
                       </div>
                       <div className="grid grid-cols-2 max-h-[300px] overflow-auto gap-2">
                           {movieData.isLoading && (
                               <>
                                   <Skeleton className="h-44 w-full rounded-none" />
                                   <Skeleton className="h-44 w-full rounded-none" />
                                   <Skeleton className="h-44 w-full rounded-none" />
                                   <Skeleton className="h-44 w-full rounded-none" />
                               </>
                           )}
                           {movieData?.data?.data?.results?.map((e, i) => (
                               <div 
                                   key={i} 
                                   onClick={() => handleClick(e)} 
                                   className="relative cursor-pointer">
                                   {e.poster_path ? (
                                       <>
                                           <p className="text-xs font-semibold leading-2">
                                               {e?.title || e?.name}
                                           </p>
                                           <div className="h-44 relative">
                                               <Image
                                                   src={`${process.env.NEXT_PUBLIC_ENDPOINT_TMBD_IMAGE}/original/${e.poster_path}`}
                                                   alt={e.name || e.title || 'Movie Poster'}
                                                   fill
                                                   style={{ objectFit: 'cover' }}
                                                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                   priority={i < 3}
                                               />
                                           </div>
                                       </>
                                   ) : (
                                       <div className="bg-gray-300 h-full w-full flex items-center justify-center">
                                           <span>No Image</span>
                                       </div>
                                   )}
                               </div>
                           ))}
                       </div>
                   </div>
               </DialogHeader>
           </DialogContent>
       </Dialog>
      </div>
    );
}
