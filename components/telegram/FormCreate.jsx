'use client'

import { Button } from "../ui/button";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";



export default function FormCreate({ refetch }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        idChanel: '',

    });
    const { toast } = useToast()
    const handleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const { mutate, isPending } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()
            const inserChanel = await axios.post('/api/telegram', formData)
            return inserChanel.data
        },
        onSuccess: (data) => {
            setIsOpen(false);
            setFormData({
                title: '',
                idChanel: '',

            })
            refetch()
            toast({ title: "Success", description: data.msg, variant: "primary", })
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
        }
    })


    const botSync = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()
            const createLink = await axios.get('/api/telegram/bot/sync')
            return createLink.data
        },
        onSuccess: (data) => {
            refetch()
            toast({ title: "Success", description: data.msg, variant: "primary", })
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
        }
    })





    return (
        <>
            <div className="flex gap-2 ">
                <Button onClick={handleIsOpen} variant="outline">Create Link</Button>
                <Button onClick={botSync.mutate} disabled={botSync.isPending}>{botSync.isPending ? 'Please Wait...' : 'Singkronkan Bot'}</Button>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>

                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Tambah Data Chanel Telegram</DialogTitle>
                        <DialogDescription>
                            Isi Inputan Berikut
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-2 w-full ">
                        <form
                            className="rounded-md flex gap-2 flex-col"
                            onSubmit={mutate}
                        >
                            <div>
                                <Label htmlFor="link">Nama Chanel</Label>
                                <Input
                                    name="title"
                                    id="link"
                                    required
                                    placeholder="Masukkan Nama Chanel"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="link">ID Chanel telegram</Label>
                                <Input
                                    name="idChanel"
                                    id="link"
                                    required
                                    placeholder="Masukkan ID Chanel telegram"
                                    value={formData.idChanel}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button type="submit" disabled={isPending}>{isPending ? 'Loading...' : 'Simpan'}</Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
