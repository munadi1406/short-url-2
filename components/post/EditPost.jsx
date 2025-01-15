'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CldUploadButton } from 'next-cloudinary'
import React, { useEffect, useState } from 'react'

export default function EditPage({ post, refetch }) { // Expect `post` as props
    const { data: genresData, isLoading: isGenresLoading } = useQuery({
        queryKey: ['genreAll'],
        queryFn: async () => {
            const response = await axios.get('/api/genre?all=true')
            return response.data
        }
    })
    const { data: tagsData, isLoading: isTagsLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await axios.get('/api/tag?all=true')
            return response.data
        }
    })

    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        image: null,
        genres: [], // Array of genre IDs
        type: 'series', // Default to 'series'
      
        tags: [],
    })
    const [newTag, setNewTag] = useState('')

    // Populate form data from props on component mount
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                desc: post.description || '',
                image: null, // Don't populate file input
                genres: post.genres ? post.genres.map((genre) => genre.id) : [],
                type: post.type || 'series',
               
                tags: post.tags ? post.tags.map((tag) => tag.id) : [], // Extract names
                airTime:post.airTime || '',
                totalEpisode:post.total_episode || '',
                trailer:post.trailer || '',
            })
        }
    }, [post])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const { files } = e.target
        if (files && files[0]) {
            setFormData((prev) => ({
                ...prev,
                image: files[0]
            }))
        }
    }

    const handleGenreChange = (genreId) => {
        setFormData((prev) => {
            const newSelectedGenres = prev.genres.includes(genreId)
                ? prev.genres.filter((id) => id !== genreId)
                : [...prev.genres, genreId]
            return {
                ...prev,
                genres: newSelectedGenres
            }
        })
    }

    const handleTagChange = (tagId) => {
        setFormData((prev) => {
            const newSelectedTags = prev.tags.includes(tagId)
                ? prev.tags.filter((id) => id !== tagId)
                : [...prev.tags, tagId]
            return {
                ...prev,
                tags: newSelectedTags
            }
        })
    }

    const handleTypeChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            type: e
        }))
    }

   
    const { toast } = useToast()
    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const formData = new FormData()
            formData.append('id', post.id)
            formData.append('title', data.title)
            formData.append('desc', data.desc)
            formData.append('type', data.type)
            formData.append('airTime', data.airTime)
            formData.append('totalEpisode', data.totalEpisode)
            formData.append('trailer', data.trailer)
          
            data.genres.forEach((genre) => formData.append('genres[]', genre))
            data.tags.forEach((tag) => formData.append('tags[]', tag))
            if (data.image) {
                formData.append('file', data.image)
            }
            const response = await axios.put(`/api/post`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        },
        onSuccess: (data) => {


            toast({ title: "Success", description: data.msg, variant: "primary" })
            refetch()
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive" })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate(formData)
    }
    const mutateTag = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()

            if (!newTag) return toast({ title: "Error", description: "Tag tidak boleh kosong", variant: "destructive", })
            const addNewTag = await axios.post('/api/tag', { name: newTag })
            return addNewTag.data
        },
        onSuccess: () => {
            tags.refetch()
            setNewTag("")
        }
    })


    return (
        <div className='border-l border-blue-600 p-2'>
            <h1 className='text-lg font-semibold'>Edit Post</h1>
            <form onSubmit={handleSubmit}>
                <div className='p-2'>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter title"
                        required
                    />
                </div>
                <div className='p-2'>
                    <Label htmlFor="desc">Description</Label>
                    <Textarea
                        name="desc"
                        id="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        placeholder="Enter description"
                        required
                    />
                </div>
                <div className='p-2'>
                    <Label htmlFor="totalEpisode">Total Episode</Label>
                    <Input
                        type="number"
                        name="totalEpisode"
                        id="totalEpisode"
                        defaultValue={formData.totalEpisode}
                        onChange={handleInputChange}
                        placeholder="Masukkan total episode"
                    />
                </div>
                <div className='p-2'>
                    <Label htmlFor="airTime">Air Time</Label>
                    <Input
                        type="text"
                        name="airTime"
                        id="airTime"
                        defaultValue={formData.airTime}
                        onChange={handleInputChange}
                        placeholder="Masukkan total air time "

                    />
                </div>
                <div className='p-2'>
                    <Label htmlFor="trailer">Trailer</Label>
                    <Input
                        type="text"
                        name="trailer"
                        id="trailer"
                        defaultValue={formData.trailer}
                        onChange={handleInputChange}
                        placeholder="Masukkan total episode"

                    />
                </div>
                <div className='p-2'>
                    <Label htmlFor="image">Image</Label>
                    <Input
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleFileChange}
                    />
                </div>
      
                <div className='p-2'>
                    <h3 className='text-md font-semibold'>Genre</h3>
                    {isGenresLoading ? <Skeleton className="h-[50px] w-full rounded-md" /> :
                        <div className='grid grid-cols-3 gap-2'>
                            {genresData.data.map((genre, index) => (
                                <div className="flex items-center space-x-2" key={index}>
                                    <Checkbox
                                        id={genre.id.toString()}
                                        checked={formData.genres.includes(genre.id)}
                                        onCheckedChange={() => handleGenreChange(genre.id)}
                                    />
                                    <Label htmlFor={genre.id.toString()}>{genre.name}</Label>
                                </div>
                            ))}
                        </div>
                    }
                </div>
                <div className='p-2'>
                    <h3 className='text-md font-semibold'>Type</h3>
                    <RadioGroup defaultValue={formData.type} onValueChange={handleTypeChange}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="movie" id="movie" />
                            <Label htmlFor="movie">Movie</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="series" id="series" />
                            <Label htmlFor="series">Series</Label>
                        </div>
                    </RadioGroup>
                </div>
               
                <div className='p-2'>
                    <h3 className='text-md font-semibold'>Tags</h3>
                    {isTagsLoading ? <Skeleton className="h-[50px] w-full rounded-md" /> :
                        <div className='grid grid-cols-3 gap-2'>
                            {tagsData.data.map((tag, index) => (
                                <div className="flex items-center space-x-2" key={index}>
                                    <Checkbox
                                        id={tag.id.toString()}
                                        checked={formData.tags.includes(tag.id)}
                                        onCheckedChange={() => handleTagChange(tag.id)}
                                    />
                                    <Label htmlFor={tag.id.toString()}>{tag.name}</Label>
                                </div>
                            ))}
                        </div>
                    }
                    <Input
                        type="text"
                        onChange={(e) => setNewTag(e.target.value)}
                        value={newTag}
                    />
                    <Button type="button" onClick={mutateTag.mutate} disabled={mutateTag.isPending}>
                        Add Tag
                    </Button>
                </div>
                <div className='p-2'>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Loading...' : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
