'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { Skeleton } from '../ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 🔹 Fungsi untuk memformat angka (1000 -> 1K, 1,000,000 -> 1M)
const formatNumber = (num) => {
  if (num == null || isNaN(num)) return '-'
  if (num >= 1_000_000) return (num / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M'
  if (num >= 1_000) return (num / 1_000).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'K'
  return num.toLocaleString('en-US')
}

export default function StatAverage() {
  // 🔹 Jalankan dua query secara paralel
  const results = useQueries({
    queries: [
      {
        queryKey: ['visitorAverage'],
        queryFn: async () => {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/visitor/average`)
          return res.data
        },
      },
      {
        queryKey: ['userAverage'],
        queryFn: async () => {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/logs/users/average`)
          return res.data
        },
      },
    ]
  })

  const [visitorQuery, userQuery] = results
  const isLoading = visitorQuery.isLoading || userQuery.isLoading
  const isError = visitorQuery.isError || userQuery.isError

  if (isLoading) {
    return (
      <Card className="w-full h-52">
        <CardHeader>
          <CardTitle><Skeleton className="w-40 h-6" /></CardTitle>
          <CardDescription><Skeleton className="w-3/4 h-4" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="w-full h-52 flex items-center justify-center">
        <p className="text-sm text-red-500">Gagal memuat data.</p>
      </Card>
    )
  }

  const visitor = visitorQuery.data.data
  const users = userQuery.data.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Average Users & Visitors</CardTitle>
        <CardDescription>Statistik rata-rata harian dan bulanan</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="view">
          <TabsList className="mb-4">
            <TabsTrigger value="view">View</TabsTrigger>
            <TabsTrigger value="Users">Users</TabsTrigger>
          </TabsList>

          {/* === VISITOR TAB === */}
          <TabsContent value="view" className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <CardTitle className="text-lg">Daily Average</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Rata-rata View harian
              </CardDescription>
              <p className="text-3xl font-bold mt-2">{formatNumber(visitor.dailyAverage)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Data dari {visitor.totalDays} hari
              </p>
            </Card>

            <Card className="p-4">
              <CardTitle className="text-lg">Monthly Average</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Rata-rata View bulanan
              </CardDescription>
              <p className="text-3xl font-bold mt-2">{formatNumber(visitor.monthlyAverage)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {visitor.monthsWithData} bulan terisi data
              </p>
            </Card>
          </TabsContent>

          {/* === USERS TAB === */}
          <TabsContent value="Users" className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <CardTitle className="text-lg">Daily Average</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Rata-rata pengguna harian
              </CardDescription>
              <p className="text-3xl font-bold mt-2">
                {formatNumber(users.averages.daily.value)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Data dari {users.averages.daily.daysWithData} hari
              </p>
            </Card>

            <Card className="p-4">
              <CardTitle className="text-lg">Monthly Average</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Rata-rata pengguna bulanan
              </CardDescription>
              <p className="text-3xl font-bold mt-2">
                {formatNumber(users.averages.monthly.value)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {users.averages.monthly.monthsWithData} bulan terisi data
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
