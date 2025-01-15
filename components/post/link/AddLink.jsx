"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

    const handleEpisodeTitleChange = (index, value) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[index].title = value;
        setEpisodes(updatedEpisodes);
    };

    const handleLinkChange = (episodeIndex, linkIndex, field, value) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[episodeIndex].links[linkIndex][field] = value;
        setEpisodes(updatedEpisodes);
    };

    const addLink = (episodeIndex) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[episodeIndex].links.push({ quality: '', url: '' });
        setEpisodes(updatedEpisodes);
    };

    const deleteLink = (episodeIndex, linkIndex) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[episodeIndex].links.splice(linkIndex, 1);
        setEpisodes(updatedEpisodes);
    };

    const addEpisode = () => {
        setEpisodes([...episodes, { title: '', links: [{ quality: '', url: '' }] }]);
    };

    const deleteEpisode = (episodeIndex) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes.splice(episodeIndex, 1);
        setEpisodes(updatedEpisodes);
    };

    const navigate = useRouter();
    const { toast } = useToast();
    const { mutate, isPending } = useMutation({
        mutationFn: async (e) => {
            const insertLink = await axios.post('/api/post/link', e);
            return insertLink.data;
        },
        onSuccess: (data) => {
            navigate.push('/dashboard/post');
            toast({ title: "Success", description: data.msg, variant: "primary" });
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response.data.msg, variant: "destructive" });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate({ postId: id, episodes });
    };

    return (
        <div>
            <h1 className="text-lg font-semibold mb-4">Add Links</h1>
            <form onSubmit={handleSubmit}>
                {episodes.map((episode, episodeIndex) => (
                    <div key={episodeIndex} className={`border p-4 mb-4 rounded-md ${episodeIndex % 2 === 0 ? '' : 'bg-blue-100'}`}>
                        <Label htmlFor={`episode-title-${episodeIndex}`} className="text-2xl my-2">Episode Title {episode?.title}</Label>
                        <Input
                            id={`episode-title-${episodeIndex}`}
                            value={episode.title}
                            onChange={(e) => handleEpisodeTitleChange(episodeIndex, e.target.value)}
                            placeholder="Enter episode title"
                            className="mb-4 "
                        />

                        {episode.links.map((link, linkIndex) => (
                            <div key={linkIndex} className="p-2 border rounded-md mb-4">
                                <div className="mb-2">
                                    <Label>Quality</Label>
                                    <RadioGroup
                                        value={link.quality}
                                        onValueChange={(value) =>
                                            handleLinkChange(episodeIndex, linkIndex, 'quality', value)
                                        }
                                        className="flex gap-2 flex-wrap"
                                    >
                                        {quality.map((q) => (
                                            <div key={q} className="flex items-center space-x-2">
                                                 <RadioGroupItem value={q} id={`quality-${episodeIndex}-${linkIndex}-${q}`} />
                                                <Label htmlFor={`quality-${episodeIndex}-${linkIndex}-${q}`}>{q}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
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
                                <Button
                                    onClick={() => deleteLink(episodeIndex, linkIndex)}
                                    type="button"
                                    variant="destructive"
                                    className="mt-2"
                                >
                                    Delete Link
                                </Button>
                            </div>
                        ))}
                        <Button onClick={() => addLink(episodeIndex)} type="button" className="mt-2">
                            Add Link
                        </Button>
                        <Button
                            onClick={() => deleteEpisode(episodeIndex)}
                            type="button"
                            variant="destructive"
                            className="mt-2 ml-2"
                        >
                            Delete Episode
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
