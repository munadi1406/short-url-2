'use client'

import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";

export default function SendMessage({  isOpen, setIsOpen, datas }) {

    const [formData, setFormData] = useState({
        message: '',
        hyperlinks: '',
        channelIds: [], // Untuk menyimpan ID channel yang dipilih
    });
    const { toast } = useToast();
   
    useEffect(() => {
        if (datas) {
            setFormData((prev) => ({
                ...prev,
                hyperlinks: `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${datas.link}`,
            }));
        }
    }, [datas]);

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

    const { mutate, isPending } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault();
            const response = await axios.post('/api/telegram/send-message', {
                message: formData.message,
                hyperlinks: formData.hyperlinks,
                channelIds: formData.channelIds,
            });
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


    return (
        <>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim Pesan ke Channel Telegram</DialogTitle>
                        <DialogDescription>
                            Isi detail pesan dan pilih channel yang ingin dikirimi pesan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-2 w-full">
                        <form
                            className="rounded-md flex gap-2 flex-col"
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
                            <div>
                                <Label>Channel</Label>
                                <div className="flex flex-col gap-2">
                                    {isLoading ? 'Loading....' : data?.data?.map((channel) => (
                                        <label key={channel.id_chanel} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value={channel.id_chanel}
                                                onChange={handleChannelSelection}
                                            />
                                            {channel.title}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" disabled={isPending}>{isPending ? 'Loading...' : 'Kirim'}</Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
