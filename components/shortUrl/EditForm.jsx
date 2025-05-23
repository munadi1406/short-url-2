'use client'

import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"



export default function EditForm({ data,type }) {

    const [hasEdited, setHasEdited] = useState(false);
    const [updateData, setUpdateData] = useState({ title: '', link: '', id: '' })
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
            title: data.title,
            link: data.link,
            id: data.id,
            type: type
        })
    }, [data,type])

    useEffect(() => {
        const isEdited =
            updateData.title !== data.title ||
            updateData.link !== data.link ||
            updateData.id !== data.id;
        setHasEdited(isEdited);
    }, [updateData, data]);




    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()
            setMsg("")
            const updateLink = await axios.put('/api/shorten', updateData)
            return updateLink.data
        },
        onSuccess: (data) => {
            setMsg(data.msg)
            toast({ title: "Success", description: data.msg, variant: "primary", })
            setHasEdited(false)
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
            <div className="grid md:grid-cols-2 gap-2 grid-cols-1 ">
                <div>
                    <Label htmlFor="editTitle">Judul</Label>
                    <Input className="text-sm" id="editTitle" name="title" value={updateData.title} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="editLink">Link</Label>
                    <Input className="text-sm" id="editLink" name="link" value={updateData.link} onChange={handleChange} />
                </div>
            </div>
            <div>
                <Button type="submit" disabled={isPending || !hasEdited}>Perbarui</Button>
            </div>
        </form>
    )
}
