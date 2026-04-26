'use client'
import React from 'react'
import NextImage from 'next/image'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Globe, Image, Tag, FileText, Type, Upload, X, Loader2 } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'



export default function GeneralTab() {
    const getSettings = async () => {
        const res = await fetch('/api/settings')
        if (!res.ok) throw new Error('Gagal memuat settings')
        const json = await res.json()
        return json.data
    }
    
    const postSettings = async (payload) => {
        const res = await fetch('/api/settings', {
            method: 'POST',
            body: payload,
        })
        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.msg || 'Gagal menyimpan settings')
        }
        return res.json()
    }
    
    function ImageUploadField({ label, icon: Icon, id, description, accept, onChange, existingUrl }) {
        const [preview, setPreview] = React.useState(existingUrl || null)
    
        React.useEffect(() => {
            if (existingUrl) setPreview(existingUrl)
        }, [existingUrl])
    
        const handleChange = (e) => {
            const file = e.target.files?.[0]
            if (file) {
                setPreview(URL.createObjectURL(file))
                onChange?.(file)
            }
        }
    
        const handleRemove = (e) => {
            e.preventDefault()
            setPreview(null)
            onChange?.(null)
        }
    
        return (
            <div className="space-y-2">
                <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    {label}
                </Label>
                <label
                    htmlFor={id}
                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-accent/40 transition-colors relative overflow-hidden group"
                >
                    {preview ? (
                        <>
                            <NextImage src={preview} alt={label} fill className="object-contain p-3" />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
                            <Upload className="w-6 h-6" />
                            <span className="text-xs font-medium">Klik untuk upload</span>
                            <span className="text-xs">{description}</span>
                        </div>
                    )}
                    <input
                        id={id}
                        name={id}
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={handleChange}
                    />
                </label>
            </div>
        )
    }
    
    function GeneralTabSkeleton() {
        return (
            <div className="space-y-5">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-36 w-full rounded-lg" />
                    <Skeleton className="h-36 w-full rounded-lg" />
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-28" />
                </div>
            </div>
        )
    }
    const [formData, setFormData] = React.useState({
        namaWebsite: '',
        keyword: '',
        description: '',
        favicon: null,
        logo: null,
    })

    // simpan nilai awal dari API untuk perbandingan
    const [initialData, setInitialData] = React.useState(null)

    const { data: settingsData, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: getSettings,
        retry: 1,
    })

    React.useEffect(() => {
        if (settingsData) {
            const initial = {
                namaWebsite: settingsData.namaWebsite || '',
                keyword:     settingsData.keyword     || '',
                description: settingsData.description || '',
                favicon:     null,
                logo:        null,
            }
            setFormData(initial)
            setInitialData(initial)
        }
    }, [settingsData])

    // cek apakah ada perubahan dari data awal
    const isDirty = React.useMemo(() => {
        if (!initialData) return false

        const textChanged =
            formData.namaWebsite !== initialData.namaWebsite ||
            formData.keyword     !== initialData.keyword     ||
            formData.description !== initialData.description

        const fileChanged = formData.favicon !== null || formData.logo !== null

        return textChanged || fileChanged
    }, [formData, initialData])

    // cek field wajib tidak kosong
    const isValid = formData.namaWebsite.trim() !== ''

    

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const { mutate, isPending } = useMutation({
        mutationFn: postSettings,
        onSuccess: (data) => {
            toast.success(data.msg || 'Settings berhasil disimpan')
            // reset initialData ke nilai terbaru setelah simpan
            setInitialData((prev) => ({
                ...prev,
                namaWebsite: formData.namaWebsite,
                keyword:     formData.keyword,
                description: formData.description,
                favicon:     null,
                logo:        null,
            }))
            setFormData((prev) => ({ ...prev, favicon: null, logo: null }))
        },
        onError: (error) => {
            toast.error(error.message || 'Terjadi kesalahan')
        },
    })
    const canSubmit = isDirty && isValid && !isPending
    const handleSubmit = (e) => {
        e.preventDefault()
        const payload = new FormData()
        payload.append('namaWebsite', formData.namaWebsite)
        payload.append('keyword', formData.keyword)
        payload.append('description', formData.description)
        if (formData.favicon) payload.append('favicon', formData.favicon)
        if (formData.logo) payload.append('logo', formData.logo)
        mutate(payload)
    }

    if (isLoading) return <GeneralTabSkeleton />

    return (
        <div>
            <form className="space-y-5" onSubmit={handleSubmit}>

                <div className="space-y-2">
                    <Label htmlFor="namaWebsite" className="flex items-center gap-2 text-sm font-medium">
                        <Type className="w-4 h-4 text-muted-foreground" />
                        Nama Website
                    </Label>
                    <Input
                        type="text"
                        name="namaWebsite"
                        id="namaWebsite"
                        placeholder="Masukkan nama website"
                        required
                        value={formData.namaWebsite}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keyword" className="flex items-center gap-2 text-sm font-medium">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        Keyword
                    </Label>
                    <Input
                        type="text"
                        name="keyword"
                        id="keyword"
                        placeholder="kata-kunci, dipisah, dengan koma"
                        value={formData.keyword}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                    <p className="text-xs text-muted-foreground">
                        Pisahkan setiap kata kunci dengan tanda koma.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        Deskripsi
                    </Label>
                    <Textarea
                        name="description"
                        id="description"
                        placeholder="Deskripsi singkat website Anda..."
                        rows={4}
                        className="resize-none"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUploadField
                        label="Favicon"
                        icon={Globe}
                        id="favicon"
                        description=".ico atau .png (32×32px)"
                        accept=".ico,.png,.jpg,.jpeg"
                        existingUrl={settingsData?.favicon}
                        onChange={(file) => setFormData((prev) => ({ ...prev, favicon: file }))}
                    />
                    <ImageUploadField
                        label="Logo Website"
                        icon={Image}
                        id="logo"
                        description=".png atau .svg (maks 2MB)"
                        accept=".png,.jpg,.jpeg,.svg,.webp"
                        existingUrl={settingsData?.logo}
                        onChange={(file) => setFormData((prev) => ({ ...prev, logo: file }))}
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={!canSubmit} className="min-w-28">
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : 'Simpan'}
                    </Button>
                </div>

            </form>
        </div>
    )
}