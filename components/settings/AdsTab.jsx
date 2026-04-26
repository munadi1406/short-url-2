'use client'
import React from 'react'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Code, MonitorPlay, Plus, Trash2, Link, Loader2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const ADS_SLOTS = [
    {
        id: 'header',
        label: 'Iklan Header',
        description: 'Tampil di bagian atas halaman (leaderboard 728×90)',
        icon: MonitorPlay,
        placeholder: `<!-- Contoh Google AdSense -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>\n<ins class="adsbygoogle" data-ad-slot="XXXXXXXX"></ins>`,
    },
    {
        id: 'sidebar',
        label: 'Iklan Sidebar',
        description: 'Tampil di samping konten (300×250 atau 160×600)',
        icon: Code,
        placeholder: `<!-- Contoh iframe iklan -->\n<iframe src="https://example.com/ads" width="300" height="250" frameborder="0"></iframe>`,
    },
    {
        id: 'inContent',
        label: 'Iklan In-Content',
        description: 'Tampil di tengah artikel',
        icon: Code,
        placeholder: `<!-- Script iklan in-content -->\n<script type="text/javascript">...</script>`,
    },
    {
        id: 'footer',
        label: 'Iklan Footer',
        description: 'Tampil di bagian bawah halaman',
        icon: MonitorPlay,
        placeholder: `<!-- Iklan footer -->\n<ins class="adsbygoogle" data-ad-slot="YYYYYYYY"></ins>`,
    },
]


export default function AdsTab() {
    
// ── API functions ─────────────────────────────────────────────
const getAds = async () => {
    const res = await fetch('/api/ads')
    if (!res.ok) throw new Error('Gagal memuat data ads')
    const json = await res.json()
    return json.data
}

const postAds = async (payload) => {
    const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.msg || 'Gagal menyimpan ads')
    }
    return res.json()
}


function AdsTabSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="border-t pt-2" />
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-28 w-full" />
                </div>
            ))}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-28" />
            </div>
        </div>
    )
}
    const [adsData, setAdsData] = React.useState(
        Object.fromEntries(ADS_SLOTS.map((slot) => [slot.id, '']))
    )
    const [directLink, setDirectLink] = React.useState('')
    const [initialData, setInitialData] = React.useState(null)

    // ── GET ───────────────────────────────────────────────────
    const { data: adsApiData, isLoading } = useQuery({
        queryKey: ['ads'],
        queryFn: getAds,
        retry: 1,
    })

    React.useEffect(() => {
        if (adsApiData) {
            const initial = {
                header:     adsApiData.header     || '',
                sidebar:    adsApiData.sidebar    || '',
                inContent:  adsApiData.inContent  || '',
                footer:     adsApiData.footer     || '',
                directLink: adsApiData.directLink || '',
            }
            setAdsData({
                header:    initial.header,
                sidebar:   initial.sidebar,
                inContent: initial.inContent,
                footer:    initial.footer,
            })
            setDirectLink(initial.directLink)
            setInitialData(initial)
        }
    }, [adsApiData])

    // ── isDirty ───────────────────────────────────────────────
    const isDirty = React.useMemo(() => {
        if (!initialData) {
            return Object.values(adsData).some((val) => val.trim() !== '') ||
                directLink.trim() !== ''
        }
        return (
            adsData.header     !== initialData.header     ||
            adsData.sidebar    !== initialData.sidebar    ||
            adsData.inContent  !== initialData.inContent  ||
            adsData.footer     !== initialData.footer     ||
            directLink         !== initialData.directLink
        )
    }, [adsData, directLink, initialData])

    // ── POST ──────────────────────────────────────────────────
    const { mutate, isPending } = useMutation({
        mutationFn: postAds,
        onSuccess: (data) => {
            toast.success(data.msg || 'Ads berhasil disimpan')
            const newInitial = {
                header:     adsData.header,
                sidebar:    adsData.sidebar,
                inContent:  adsData.inContent,
                footer:     adsData.footer,
                directLink: directLink,
            }
            setInitialData(newInitial)
        },
        onError: (error) => {
            toast.error(error.message || 'Terjadi kesalahan')
        },
    })

    const handleChange = (id, value) => {
        setAdsData((prev) => ({ ...prev, [id]: value }))
    }

    const handleClear = (id) => {
        setAdsData((prev) => ({ ...prev, [id]: '' }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate({
            header:     adsData.header     || null,
            sidebar:    adsData.sidebar    || null,
            inContent:  adsData.inContent  || null,
            footer:     adsData.footer     || null,
            directLink: directLink         || null,
        })
    }

    if (isLoading) return <AdsTabSkeleton />

    return (
        <div>
            <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Direct Link */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                            <Link className="w-4 h-4 text-muted-foreground" />
                            Direct Link Iklan
                            {directLink.trim() && (
                                <Badge variant="secondary" className="text-xs ml-1">Aktif</Badge>
                            )}
                        </Label>
                        {directLink.trim() && (
                            <button
                                type="button"
                                onClick={() => setDirectLink('')}
                                className="flex items-center gap-1 text-xs text-destructive hover:underline"
                            >
                                <Trash2 className="w-3 h-3" />
                                Hapus
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        URL langsung untuk redirect iklan (contoh: https://ads.example.com/track?id=xxx)
                    </p>
                    <Input
                        type="url"
                        id="directLink"
                        name="directLink"
                        value={directLink}
                        onChange={(e) => setDirectLink(e.target.value)}
                        placeholder="https://ads.example.com/track?id=xxx"
                        disabled={isPending}
                    />
                </div>

                <div className="border-t pt-2" />

                {/* Script / iframe slots */}
                {ADS_SLOTS.map((slot) => {
                    const Icon = slot.icon
                    const isEmpty = !adsData[slot.id].trim()

                    return (
                        <div key={slot.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                    {slot.label}
                                    {!isEmpty && (
                                        <Badge variant="secondary" className="text-xs ml-1">
                                            Aktif
                                        </Badge>
                                    )}
                                </Label>
                                {!isEmpty && (
                                    <button
                                        type="button"
                                        onClick={() => handleClear(slot.id)}
                                        className="flex items-center gap-1 text-xs text-destructive hover:underline"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Hapus
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{slot.description}</p>
                            <Textarea
                                id={slot.id}
                                name={slot.id}
                                value={adsData[slot.id]}
                                onChange={(e) => handleChange(slot.id, e.target.value)}
                                placeholder={slot.placeholder}
                                rows={5}
                                className="resize-none font-mono text-xs"
                                disabled={isPending}
                            />
                        </div>
                    )
                })}

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={!isDirty || isPending} className="min-w-28">
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                Simpan Iklan
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    )
}