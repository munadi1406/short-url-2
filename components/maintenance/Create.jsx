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
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export default function Create({ refetch }) {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState()
    const [formData, setFormData] = useState({
        status: 'active',
        description: ''
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
            const inserChanel = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/maintenance`, { status, ...formData })
            return inserChanel.data
        },
        onSuccess: (data) => {
            setIsOpen(false);
            setFormData({
                status: '',
                description: ''
            })
            refetch()
            toast({ title: "Success", description: data.message, variant: "primary", })
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.message, variant: "destructive", })
        }
    })








    return (
        <>
            <div className="flex gap-2 ">
                <Button onClick={handleIsOpen} >Create</Button>

            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>

                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Tambah Data Maintenance</DialogTitle>
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
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    name="description"
                                    id="description"
                                    required
                                    placeholder="Masukkan Deskripsi Maintenenace"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select id="status" onValueChange={(value) => handleChange({ target: { value, name: "status" } })} value={formData.status}>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>

                                        <SelectItem value={"active"} >Aktif</SelectItem>
                                        <SelectItem value={"inactive"} >Tidak Aktif</SelectItem>

                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" disabled={isPending}>{isPending ? 'Loading...' : 'Simpan'}</Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
