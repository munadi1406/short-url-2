'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { quality } from '@/lib/quality';

export default function EditLink({ data }) {
  const [episodes, setEpisodes] = useState(
    data.episodes.map((episode) => ({
      ...episode,
      isSaved: true, // Tambahkan properti isSaved untuk melacak status simpan
    }))
  );
  

  const { toast } = useToast();

  const saveEpisodeMutation = useMutation({
    mutationFn: async (episode) => {
      const response = await axios.put(`/api/post/link`, episode);
      return response.data;
    },
    onSuccess: (data, variables) => {
      setEpisodes((prev) => {
        const updatedEpisodes = [...prev];
        const episodeIndex = updatedEpisodes.findIndex((ep) => ep.id === variables.id);
        if (episodeIndex !== -1) {
          updatedEpisodes[episodeIndex] = { ...updatedEpisodes[episodeIndex], isSaved: true };
        }
        return updatedEpisodes;
      });
      toast({
        title: 'Success',
        description: `Perubahan episode "${variables.title}" berhasil disimpan`,
        variant: 'primary',
      });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.response.data.msg, variant: 'destructive' });
    },
  });

  const deleteEpisodeMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/post/episode/?id=${id}`);
    },
    onSuccess: (data, variables) => {
      setEpisodes((prev) => prev.filter((episode) => episode.id !== variables));
      toast({ title: 'Success', description: 'Episode berhasil dihapus', variant: 'primary' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Gagal menghapus episode', variant: 'destructive' });
    },
  });

  const handleEpisodeChange = (index, value) => {
    setEpisodes((prev) => {
      const updatedEpisodes = [...prev];
      updatedEpisodes[index] = { ...updatedEpisodes[index], title: value, isSaved: false };
      return updatedEpisodes;
    });
  };

  const handleLinkChange = (episodeIndex, linkIndex, field, value) => {
    setEpisodes((prev) => {
      const updatedEpisodes = [...prev];
      const updatedLinks = [...updatedEpisodes[episodeIndex].post_links];
      updatedLinks[linkIndex] = { ...updatedLinks[linkIndex], [field]: value };
      updatedEpisodes[episodeIndex] = { ...updatedEpisodes[episodeIndex], post_links: updatedLinks, isSaved: false };
      return updatedEpisodes;
    });
  };

  const handleDeleteLink = (episodeIndex, linkIndex) => {
    setEpisodes((prev) => {
      const updatedEpisodes = [...prev];
      const updatedLinks = [...updatedEpisodes[episodeIndex].post_links];
      updatedLinks.splice(linkIndex, 1);
      updatedEpisodes[episodeIndex] = { ...updatedEpisodes[episodeIndex], post_links: updatedLinks, isSaved: false };
      return updatedEpisodes;
    });
  };

  const handleDeleteEpisode = (id) => {
    deleteEpisodeMutation.mutate(id);
  };

  const handleAddLink = (episodeIndex) => {
    setEpisodes((prev) => {
      const updatedEpisodes = [...prev];
      const newLink = { id: `new-${Date.now()}`, quality: '', url: '' };
      updatedEpisodes[episodeIndex] = {
        ...updatedEpisodes[episodeIndex],
        post_links: [...updatedEpisodes[episodeIndex].post_links, newLink],
        isSaved: false,
      };
      return updatedEpisodes;
    });
  };

  return (
    <div>
      {episodes.map((episode, episodeIndex) => (
        <div key={episode.id} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Input
              defaultValue={episode.title}
              onChange={(e) => handleEpisodeChange(episodeIndex, e.target.value)}
            />
            <Button
              variant="destructive"
              onClick={() => handleDeleteEpisode(episode.id)}
              disabled={deleteEpisodeMutation.isLoading}
            >
              {deleteEpisodeMutation.isLoading ? 'Menghapus...' : 'Hapus Episode'}
            </Button>
          </div>
          {episode.post_links.map((link, linkIndex) => (
            <div key={link.id} className="flex items-center gap-2 mb-1">
              <Input
                placeholder="URL"
                defaultValue={link.url}
                onChange={(e) => handleLinkChange(episodeIndex, linkIndex, 'url', e.target.value)}
              />
              <Select
                onValueChange={(value) => handleLinkChange(episodeIndex, linkIndex, 'quality', value)}
                required
                value={link.quality || ''}
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
              <Button variant="destructive" onClick={() => handleDeleteLink(episodeIndex, linkIndex)}>
                Hapus Link
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => handleAddLink(episodeIndex)}>
            Tambah Link
          </Button>
          <div className="mt-2">
            {!episode.isSaved && <p className="text-sm text-red-600">Perubahan belum disimpan!</p>}
            <Button
              onClick={() => saveEpisodeMutation.mutate(episodes[episodeIndex])}
              disabled={episode.isSaved || saveEpisodeMutation.isLoading}
            >
              {saveEpisodeMutation.isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
