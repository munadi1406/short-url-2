'use client'

import { Button } from "../ui/button";
import { useEffect, useState } from "react";
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
import CopyButton from "../CopyButton";

export default function DialogAdd({ refetch, isOpen, setIsOpen, currentData }) {

    const [formData, setFormData] = useState({
        link: '',
        short_url: '', // Adding short_url to the state
    });
    
    const { toast } = useToast()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Mutation for posting the form data
    const { mutate, isPending ,data,isSuccess} = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()
            const addLink = await axios.post('/api/shorten', {
                idUrls: currentData.id,
                link: formData.link,
                type:"single"
            });
            return addLink.data
        },
        onSuccess: (data) => {
            refetch();
            toast({ title: "Success", description: data.msg, variant: "primary" })
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive" })
        }
    });

  

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah link kategori</DialogTitle>
                        <DialogDescription>
                            Isi Inputan Berikut
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-2 w-full">
                        <form
                            className="rounded-md flex gap-2 flex-col"
                            onSubmit={mutate}
                        >
                            {/* Input for the original link */}
                            <div>
                                <Label htmlFor="link">Link</Label>
                                <Input
                                    name="link"
                                    id="link"
                                    required={true}
                                    placeholder="Masukkan Link"
                                    value={formData.link}
                                    onChange={handleChange}
                                />
                            </div>

                            
                          
                            {isSuccess && data.data.link && (
                                <div>
                                    <Label htmlFor="short_url">Short URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            name="short_url"
                                            id="short_url"
                                            value={data.data.link}
                                            readOnly
                                            placeholder="Short URL"
                                        />
                                        <CopyButton textToCopy={data.data.link} />
                                    </div>
                                </div>
                            )}

                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Loading...' : 'Simpan'}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
