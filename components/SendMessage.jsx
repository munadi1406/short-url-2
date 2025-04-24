/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch"

import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { Checkbox } from "./ui/checkbox";
import { SendHorizontal } from "lucide-react";

export default function SendMessage({ link, title }) {

    const [formData, setFormData] = useState({
        message: '',
        hyperlinks: '',
        channelIds: [],
    });
    const { toast } = useToast();
    const [withIcon, setWithIcon] = useState(false)
    const titleIcon = withIcon ? "🎬 " : '';
    const ratingIcon = withIcon ? "⭐ " : '';
    const genreIcon = withIcon ? "🎭 " : '';
    const [isOpen, setIsOpen] = useState(false)
   

    const handleClick = async (data) => {
        const detail = await axios.get(`/api/movie/detail?id=${data.id}&type=${data.media_type}`);
        const datas = detail.data.data;


        const genres = datas.genres.map(genre => genre.name).join(', ');

        // Define Unicode emojis or other icons for better presentation


        setFormData((prev) => ({
            ...prev,
            message: `${titleIcon}*Title*: ${data.name ? data.name : data?.title}\n` +
                `${ratingIcon}*Rating*: ${data.vote_average} / ${data.vote_count} votes\n` +
                `${genreIcon}*Genre*: ${genres}\n\n` +
                `720p : \n480p : \n360p : `,
            poster_path: data.poster_path,
        }));
    };

    useEffect(() => {
        if (link) {
            setFormData((prev) => ({
                ...prev,
                hyperlinks: link,
            }));
        }
    }, [link]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChannelSelection = (e) => {

        const value = e.target.value;
        setFormData((prev) => {
            const updatedChannelIds = e.target.checked
                ? [...prev.channelIds, value]
                : prev.channelIds.filter((id) => id !== value);

            return {
                ...prev,
                channelIds: updatedChannelIds,

            };
        });
    };
    const handleCheckAll = (e) => {
        const checked = e.target.checked;
        const allChannelIds = data?.data?.map((channel) => channel.id_chanel);
        setFormData((prev) => ({
            ...prev,
            channelIds: checked ? allChannelIds : [],
        }));
    };


    const { mutate, isPending } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault();
            const response = await axios.post('/api/telegram/send-message', formData);
            return response.data;
        },
        onSuccess: (data) => {
            setIsOpen(false);
            setFormData({
                message: '',
                hyperlinks: '',
                channelIds: [],
            });

            toast({ title: "Success", description: data.msg, variant: "primary", });
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response?.data?.msg || "An error occurred", variant: "destructive", });
        }
    });

    const { data, isLoading } = useQuery({
        queryKey: ['allChanels'], queryFn: async () => {
            const allChanel = await axios.get('/api/telegram?all=true')
            return allChanel.data
        }
    })
    const [query, setQuery] = useState("");
    const movieData = useQuery({
        queryKey: [`movie`], queryFn: async () => {
            const movie = await axios.get(`/api/movie?search=${query}`)
       
            return movie.data
        },
        enabled: query.length > 3 && isOpen
    })
    const handleOpen = ()=>{
        setIsOpen(true)
        setQuery(title)
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

    




    return (
        <>
            <Button onClick={handleOpen} className="bg-green-600 hover:bg-green-300"><SendHorizontal /></Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="min-w-[80vw] max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Kirim Pesan ke Channel Telegram</DialogTitle>
                        <DialogDescription>
                            Isi detail pesan dan pilih channel yang ingin dikirimi pesan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                        <div className="p-2 w-full h-full md:order-1 order-2">
                            <form
                                className="rounded-md flex gap-2 flex-col h-full"
                                onSubmit={mutate}
                            >
                                <div>
                                    <Label htmlFor="message">Pesan</Label>
                                    <Textarea
                                        name="message"
                                        id="message"
                                        required
                                        placeholder="Masukkan pesan"
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="hyperlinks">Hyperlink (Opsional)</Label>
                                    <Input
                                        name="hyperlinks"
                                        id="hyperlinks"
                                        placeholder="Masukkan hyperlink (Opsional)"
                                        value={formData.hyperlinks}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="airplane-mode" checked={withIcon} onCheckedChange={(e) => setWithIcon(!withIcon)} />
                                    <Label htmlFor="airplane-mode">With Icon ?</Label>
                                </div>
                                <div>
                                    <Label>Channel</Label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            id="checkAll"
                                            onChange={handleCheckAll}
                                            checked={formData.channelIds.length === data?.data?.length}
                                        />
                                        <Label htmlFor="checkAll">Select All</Label>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {isLoading ? 'Loading....' : data?.data?.map((channel, i) => (
                                            <div key={i} className="flex gap-2 items-start">
                                                <Checkbox
                                                    id={channel.id_chanel}

                                                    value={channel.id_chanel}
                                                    checked={formData.channelIds.includes(channel.id_chanel)} // Menggunakan 'checked' daripada 'defaultChecked'
                                                    onCheckedChange={(e) => handleChannelSelection({
                                                        target: { value: channel.id_chanel, checked: e }
                                                    })}
                                                />

                                                <label htmlFor={channel.id_chanel} key={channel.id_chanel} className="flex items-center gap-2 text-xs">
                                                    {channel.title}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button type="submit" disabled={isPending}>{isPending ? 'Loading...' : 'Kirim'}</Button>
                            </form>
                        </div>
                        <div className="md:order-2 order-1">
                            <div className="p-2">
                                <Label>Search</Label>
                                <Input type="search" placeholserd="search...." onChange={search} defaultValue={title} />

                            </div>
                            <div className="grid grid-cols-2  max-h-[300px] overflow-auto gap-2">
                                {console.log(movieData.data)}
                                {movieData.isLoading && (
                                    <>
                                        <Skeleton className="h-44 w-full rounded-none" />
                                        <Skeleton className="h-44 w-full rounded-none" />
                                        <Skeleton className="h-44 w-full rounded-none" />
                                        <Skeleton className="h-44 w-full rounded-none" />
                                    </>
                                )}
                                {movieData?.data?.data?.map((e, i) => (
                                    <div key={i} onClick={() => handleClick(e)} className="relative cursor-pointer "> {/* Pastikan tinggi dan lebar ditentukan */}
                                        {e.poster_path ? (
                                            <>
                                                <p className="text-xs font-semibold leading-2">{e?.title ? e.title : e?.name}</p>
                                                <div className="h-44 relative">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_ENDPOINT_TMBD_IMAGE}/original/${e.poster_path}`}
                                                        alt={e.name || e.title || 'Movie Poster'} // Fallback alt text
                                                        fill
                                                        style={{ objectFit: 'cover' }} // Object fit sesuai kebutuhan
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Sesuaikan ukuran responsif
                                                        priority={i < 3} // Hanya untuk gambar penting, misalnya tiga gambar pertama
                                                    />
                                                </div>

                                            </>
                                        ) : (
                                            <div className="bg-gray-300 h-full w-full flex items-center justify-center">
                                                {/* Placeholder jika tidak ada poster */}
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
