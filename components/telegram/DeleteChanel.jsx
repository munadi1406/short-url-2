'use client'

import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import axios from "axios"
import { Trash } from "lucide-react"

export default function DeleteChanel({ data,refetch }) {

    const {mutate,isPending} = useMutation({
        mutationFn: async (formData) => {
            
       
            const updateLink = await axios.delete(`/api/telegram?id=${formData.id}`)
            return updateLink.data
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
