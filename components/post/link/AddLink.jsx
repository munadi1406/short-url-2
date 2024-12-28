'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { quality } from '@/lib/quality';
import AutoFillLink from '@/components/shortUrl/AutoFillLink';

export default function AddLink({ id }) {
    const [episodes, setEpisodes] = useState([
        { title: '', links: [{ quality: '', url: '' }] },
    ]);



    // Array of quality options


    // Handle changes to the episode title
    const handleEpisodeTitleChange = (index, value) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[index].title = value;
        setEpisodes(updatedEpisodes);
    };

    // Handle changes to a link field
    const handleLinkChange = (episodeIndex, linkIndex, field, value) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[episodeIndex].links[linkIndex][field] = value;
        setEpisodes(updatedEpisodes);
    };

    // Add a new link to an episode
    const addLink = (episodeIndex) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[episodeIndex].links.push({ quality: '', url: '' });
        setEpisodes(updatedEpisodes);
    };

    const navigate = useRouter()
    const addEpisode = () => {
        setEpisodes([...episodes, { title: '', links: [{ quality: '', url: '' }] }]);
    };
    const { toast } = useToast()
    const { mutate, isPending } = useMutation({
        mutationFn: async (e) => {

            const insertLink = await axios.post('/api/post/link', e)
            return insertLink.data
        },
        onSuccess: (data) => {

            navigate.push('/dashboard/post')
            toast({ title: "Success", description: data.msg, variant: "primary", })
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate({ postId: id, episodes })
    };

    return (
        <div >
            <h1 className="text-lg font-semibold mb-4">Add Links</h1>
            <form onSubmit={handleSubmit}>
                {episodes.map((episode, episodeIndex) => (
                    <div key={episodeIndex} className="border p-4 mb-4 rounded-md">
                        <Label htmlFor={`episode-title-${episodeIndex}`}>Episode Title</Label>
                        <Input
                            id={`episode-title-${episodeIndex}`}
                            value={episode.title}
                            onChange={(e) => handleEpisodeTitleChange(episodeIndex, e.target.value)}
                            placeholder="Enter episode title"
                            className="mb-4"
                        />

                        {episode.links.map((link, linkIndex) => (
                            <div key={linkIndex} className="p-2 border rounded-md mb-4">
                                <div className="mb-2">
                                    <Label>Quality</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            handleLinkChange(episodeIndex, linkIndex, 'quality', value)
                                        }
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select quality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {quality.map((quality) => (
                                                <SelectItem key={quality} value={quality}>
                                                    {quality}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <Label>URL</Label>
                                    <AutoFillLink handleAutoFill={(link) => { handleLinkChange(episodeIndex, linkIndex, 'url', link) }} />
                                    <Input
                                        value={link.url}
                                        onChange={(e) =>
                                            handleLinkChange(episodeIndex, linkIndex, 'url', e.target.value)
                                        }
                                        placeholder="Enter link URL"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <Button onClick={() => addLink(episodeIndex)} type="button" className="mt-2">
                            Add Link
                        </Button>
                    </div>
                ))}

                <Button onClick={addEpisode} type="button" variant="outline" className="w-full mt-4">
                    Add Episode
                </Button>
                <Button type="submit" disabled={isPending} className="w-full mt-4 bg-blue-500 text-white">
                    {isPending ? "Loading..." : 'Simpan'}
                </Button>
            </form>
        </div>
    );
}
