'use client'

import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
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
import { useState } from "react"

export default function Remove({ data,refetch }) {
    const [open, setOpen] = useState(false)
    const {mutate,isPending} = useMutation({
        mutationFn: async (formData) => {
            const removeMaintenance = await axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/maintenance/${formData.id}`)
            return removeMaintenance.data
        },
        onSuccess: (data) => {
         
            toast({ title: "Success", description: data.message, variant: "primary", })
            refetch()
            setOpen(false)
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.message, variant: "destructive", })
        },
    })
    return (
        <>
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant="destructive" disabled={isPending}><Trash /></Button>
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
        </>
    )
}
