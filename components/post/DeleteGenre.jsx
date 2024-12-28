'use client'

import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import axios from "axios"
import { Trash } from "lucide-react"

export default function DeletePost({ data,refetch }) {

    const {mutate,isPending} = useMutation({
        mutationFn: async (formData) => {
            const deleteGenre = await axios.delete(`/api/p?id=${formData.id}`)
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
        <Button variant="destructive" onClick={()=>mutate(data)} disabled={isPending} type="button"><Trash/></Button>
    )
}
