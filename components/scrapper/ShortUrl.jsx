import { Label } from '@radix-ui/react-context-menu'
import React, { useEffect, useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Input } from '../ui/input'
import CopyButton from '../CopyButton'

export default function ShortUrl({ linkData, title, originalTitle }) {

    const [formData, setFormData] = useState({ link: '', type: 'bulk' })
    const { toast } = useToast()
    useEffect(() => {
        if (linkData) {
            setFormData((prev) => ({
                ...prev, link: linkData.links.join('\n')
            }))
        }
    }, [linkData])


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const { mutate, isPending, isSuccess, data } = useMutation({
        mutationFn: async (formData) => {
            const createLink = await axios.post('/api/shorten', formData)
            return createLink.data
        },
        onSuccess:(data)=>{
            toast({ title: "Success", description: data.msg, variant: "primary" })
        },
        onError:(error)=>{
            toast({ title: "Success", description: error.response.data.msg, variant: "destructive" })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!originalTitle) {
            toast({ title: "Error", description: "Title Masih Kosong", variant: "destructive" })
            return
        }
        const payload = {
            title,
            ...formData
        }
      
        mutate(payload)


    }
    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
                <Label>Episode {linkData.quality}</Label>
                <Textarea value={formData.link} onChange={handleChange} name="link" />
                <Button type="submit" disabled={isPending || isSuccess}>{isPending ? 'Loading...' : 'Short Url'}</Button>
                {isSuccess && (
                    <div className='px-4 py-2 rounded-md bg-gray-200/40 space-y-2 my-4 '>
                        <Label >Short URL</Label>
                        <div className='flex gap-2'>
                            <Input name="short_url" id="short_url" value={data.data.link} readOnly />
                            <CopyButton textToCopy={data.data.link} />
                        </div>
                    </div>
                )}
            </form>
        </>
    )
}
