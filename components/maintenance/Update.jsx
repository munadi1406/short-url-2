'use client'

import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import axios from "axios"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "../ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export default function Update({ data, refetch }) {
    const [hasEdited, setHasEdited] = useState(false);
    const [updateData, setUpdateData] = useState({ description: '', status: '' })
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
        const isEdited =
            updateData.description !== data.description ||
            updateData.id !== data.id;
        updateData.status !== data.status;
        setHasEdited(isEdited);
    }, [updateData, data]);
    useEffect(() => {
        if (!data) return
        setUpdateData({ status: data.status, description: data.description })

    }, [data]);







    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()
            setMsg("")
            const updateGenre = await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/maintenance/${data.id}`, updateData)
            return updateGenre.data
        },
        onSuccess: (data) => {
            setMsg(data.msg)
            toast({ title: "Success", description: data.message, variant: "primary", })
            setHasEdited(false)
            refetch()
        },
        onError: (error) => {
            setHasEdited(false)
            setMsg(error.response.data.msg)
            toast({ title: "Error", description: error.response.data.message, variant: "destructive", })
        },

    })


    const textColor = isSuccess ? 'text-green-600' : 'text-red-500'

    return (
        <form className="border-l-2 border-blue-600 p-2 flex flex-col gap-1" onSubmit={mutate} method="post">
            {msg && <p className={`" text-sm font-medium leading-none ${textColor}`}>{msg}</p>}
            <div className="flex flex-col gap-2 w-full">
                <div className="w-full">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                        name="description"
                        id="description"
                        required
                        placeholder="Masukkan Deskripsi Maintenenace"
                        defaultValue={data?.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select id="status" onValueChange={(value) => handleChange({ target: { value, name: "status" } })} defaultValue={data?.status}>
                        <SelectTrigger >
                            <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"active"} >Aktif</SelectItem>
                            <SelectItem value={"inactive"} >Tidak Aktif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div>
                <Button type="submit" disabled={isPending || !hasEdited}>Perbarui</Button>
            </div>
        </form>
    )
}
