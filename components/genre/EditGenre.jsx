'use client'

import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"



export default function EditGenre({ data,refetch }) {
    const [hasEdited, setHasEdited] = useState(false);
    const [updateData, setUpdateData] = useState({ name: '', id: '' })
    const { toast } = useToast()
    const [msg, setMsg] = useState("")
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    useEffect(() => {
        setUpdateData({
            name: data.name,

            id: data.id
        })
    }, [data])

    useEffect(() => {
        const isEdited =
            updateData.name !== data.name ||
            updateData.id !== data.id;
        setHasEdited(isEdited);
    }, [updateData, data]);




    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()
            setMsg("")
            const updateGenre = await axios.put('/api/genre', updateData)
            return updateGenre.data
        },
        onSuccess: (data) => {
            setMsg(data.msg)
            toast({ title: "Success", description: data.msg, variant: "primary", })
            setHasEdited(false)
            refetch()
        },
        onError: (error) => {
            setHasEdited(false)
            setMsg(error.response.data.msg)
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
        },

    })


    const textColor = isSuccess ? 'text-green-600' : 'text-red-500'

    return (
        <form className="border-l-2 border-blue-600 p-2 flex flex-col gap-1" onSubmit={mutate} method="post">
            {msg && <p className={`" text-sm font-medium leading-none ${textColor}`}>{msg}</p>}
            <div className="grid md:grid-cols-2 gap-2 grid-cols-1">
                <div>
                    <Label htmlFor="editTitle">Name</Label>
                    <Input id="editTitle" name="name" value={updateData.name} onChange={handleChange} />
                </div>
            </div>
            <div>
                <Button type="submit" disabled={isPending || !hasEdited}>Perbarui</Button>
            </div>
        </form>
    )
}
