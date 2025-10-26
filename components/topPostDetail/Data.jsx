'use client'

import { useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber } from '@/lib/formatNumber'

const Data = () => {
  const [limit, setLimit] = useState('5')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['detailPostStat', limit],
    queryFn: async () => {
      const res = await axios.get(`/api/post/stat?limit=${limit}`)
      return res.data.data
    },
  })

  const handleLimitChange = (value) => {
    setLimit(value)
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>📊 Detail Top Post</CardTitle>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="text-sm text-muted-foreground">Limit:</span>
          <Select value={limit} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isError ? (
          <p className="text-sm text-red-500">Terjadi kesalahan saat mengambil data.</p>
        ) : (
          <Tabs defaultValue="today">
            <TabsList className="mb-4">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>

            {/* === TODAY === */}
            <TabsContent value="today" className="grid gap-3">
              {isLoading ? (
                Array.from({ length: Number(limit) }).map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : data?.today?.length > 0 ? (
                data.today.map((post, i) => (
                  <div
                    key={post.postId}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{i + 1}. {post.title}</span>
                      <span className="text-sm text-muted-foreground">{formatNumber(post.viewCount)} views</span>
                    </div>
                    <p className="text-xs text-blue-500">/{post.slug}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada data hari ini.</p>
              )}
            </TabsContent>

            {/* === ALL TIME === */}
            <TabsContent value="allTime" className="grid gap-3">
              {isLoading ? (
                Array.from({ length: Number(limit) }).map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : data?.allTime?.length > 0 ? (
                data.allTime.map((post, i) => (
                  <div
                    key={post.postId}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{i + 1}. {post.title}</span>
                      <span className="text-sm text-muted-foreground">{formatNumber(post.viewCount)} views</span>
                    </div>
                    <p className="text-xs text-blue-500">/{post.slug}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada data.</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

export default Data
