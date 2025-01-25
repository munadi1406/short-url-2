'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import IpAddressSkeleton from "./IpAddressSkeleton"

export default function IpAddress({ ipAddress }) {
    const [open, setOpen] = useState(false)

    // Menjalankan query hanya saat dialog dibuka
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [`${ipAddress}`],
        queryFn: async () => {
            const response = await axios.get(`/api/proxy?ipAddress=${ipAddress}`)
            return response.data
        },
        enabled: !!open,  // Hanya jalankan query ketika dialog terbuka
    
    })

    return (
        <>
            {/* Dialog untuk menampilkan informasi IP */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{ipAddress}</DialogTitle>
                        <DialogDescription>
                            Detail Dari IP {ipAddress}
                        </DialogDescription>
                    </DialogHeader>
                    {isLoading ? (
                        <IpAddressSkeleton/>
                    ) : isError ? (
                        <p>Error: {error.message}</p>
                    ) : (
                        <div>
                            <p><strong>Country:</strong> {data?.country}</p>
                            <p><strong>Region:</strong> {data?.regionName}</p>
                            <p><strong>City:</strong> {data?.city}</p>
                            <p><strong>Org:</strong> {data?.org}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Tautan untuk membuka dialog */}
            <p className="text-blue-600 underline" onClick={() => setOpen(!open)}>
                {ipAddress}
            </p>
        </>
    )
}
