'use client'
import AutoFill from '@/components/post/AutoFill'
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
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['genreAll'],
    queryFn: async () => {
      const response = await axios.get('/api/genre?all=true')
      return response.data
    }
  })
  const [newTag, setNewTag] = useState('')
  const [genre, setGenre] = useState([])
  // State to hold the form inputs
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    trailer: '',
    totalEpisode: '',
    airTime: '',
    image: null,
    genres: [], // Array of genre IDs
    type: 'series', // Default to 'movie'

    tags: [],
  })

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle textarea input change
  const handleTextareaChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle file input change
  const handleFileChange = (e) => {
    const { files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: files[0]
      }))
    }
  }

  // Handle genre checkbox change
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

  // Handle type (movie/series) change using radio buttons
  const handleTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      type: e
    }))
  }




  const navigate = useRouter()
  const { toast } = useToast()
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      // Create a new FormData instance
      const formData = new FormData()

      // Append all form data to FormData
      formData.append('title', data.title)
      formData.append('desc', data.desc)
      formData.append('airTime', data.airTime)
      formData.append('totalEpisode', data.totalEpisode)
      formData.append('trailer', data.trailer)
      formData.append('type', data.type)


      // Append the genres array
      data.genres.forEach((genre) => formData.append('genres[]', genre))
      data.tags.forEach((tag) => formData.append('tags[]', tag))

      // If an image exists, append it to the FormData
      if (data.image) {
        formData.append('file', data.image)
      }

      // Make the API request with FormData
      const response = await axios.post('/api/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: (data) => {
      navigate.push(`/dashboard/post/link/${data.data.id}`)
      toast({ title: "Success", description: data.msg, variant: "primary", })
    },
    onError: (error) => {
      toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate(formData)
  }
  const tags = useQuery({
    queryKey: ['tags'], queryFn: async () => {
      const datas = await axios.get('/api/tag?all=true')
      return datas.data
    }
  })

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

  const handleAutoFill = (data) => {
    setFormData((prev) => ({
      ...prev,
      airTime: data?.first_air_date,
      totalEpisode: data?.number_of_episodes,
      title: data?.title ? data?.title : data?.name,
      desc: data?.overview

    }))
    setGenre(data.genres)
  }

  return (
    <div className='bg-white rounded-md p-2 shadow-md'>
      <h1 className='text-lg font-semibold'>Create Post</h1>
      <AutoFill handleAutoFill={handleAutoFill} />
      <form onSubmit={handleSubmit}>
        <div className='p-2'>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Masukkan title"
            required
          />
        </div>
        <div className='p-2'>
          <Label htmlFor="desc">Deskripsi</Label>
          <Textarea
            name="desc"
            id="desc"
            value={formData.desc}
            onChange={handleTextareaChange}
            placeholder="Masukkan Deskripsi"
            required
          />
        </div>
        <div className='p-2'>
          <Label htmlFor="totalEpisode">Total Episode</Label>
          <Input
            type="number"
            name="totalEpisode"
            id="totalEpisode"
            value={formData.totalEpisode}
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
            value={formData.airTime}
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
            value={formData.trailer}
            onChange={handleInputChange}
            placeholder="Masukkan total episode"

          />
        </div>
        <div className='p-2'>
          <Label htmlFor="image">Foto</Label>
          <Input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className='p-2'>
          <h3 className='text-md font-semibold'>Genre</h3>
          <div className='flex flex-wrap p-2 text-xs text-blue-600 gap-2'>
            {genre.map((e, i) => (
              <p key={i}>{e.name}</p>
            ))}
          </div>
          {isLoading ? <Skeleton className={"h-[50px] w-full rounded-md"} /> :
            <div className='grid grid-cols-3 gap-2'>
              {data.data.map((genre, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <Checkbox
                    id={genre.id.toString()}
                    checked={formData.genres.includes(genre.id)}
                    onCheckedChange={() => handleGenreChange(genre.id)}
                  />
                  <Label
                    htmlFor={genre.id.toString()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {genre.name}
                  </Label>
                </div>
              ))}
            </div>
          }
        </div>

        <div className='p-2'>
          <h3 className='text-md font-semibold'>Type</h3>
          <RadioGroup defaultValue="series" onValueChange={handleTypeChange}>
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
        <div className='w-full p-2 flex flex-col gap-2'>
          <Label>Tag</Label>
          {tags.isLoading ? <Skeleton className={"h-[50px] w-full rounded-md"} /> :
            <div className='grid grid-cols-3 gap-2'>
              {tags.data.data.map((tag, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <Checkbox
                    id={tag.id.toString()}
                    checked={formData.tags.includes(tag.id)}
                    onCheckedChange={() => handleTagChange(tag.id)}
                  />
                  <Label
                    htmlFor={tag.id.toString()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          }
          <Input type="text" onChange={(e) => setNewTag(e.target.value)} value={newTag} />
          <Button type="button" onClick={mutateTag.mutate} disabled={mutateTag.isPending}>Add Tag</Button>

        </div>
        <div className='p-2'>
          <Button type="submit" disabled={isPending}>{isPending ? 'Loading...' : "Simpan"}</Button>
        </div>
      </form>
    </div>
  )
}
