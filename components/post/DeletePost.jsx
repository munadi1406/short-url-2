'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useState } from "react"

export default function DeletePost({ data, refetch }) {
    const [open, setOpen] = useState(false)
    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const deleteGenre = await axios.delete(`/api/post?id=${formData.id}`)
            return deleteGenre.data
        },
        onSuccess: (data) => {
            toast({ title: "Success", description: data.msg, variant: "primary", })
            refetch()
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
        },
    })
    return (

        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant="destructive" ><Trash /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Yakin ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda Yakin Ingin Menghapus Ini ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutate(data)} disabled={isPending}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
