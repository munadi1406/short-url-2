'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WithCard from '@/lib/WithCard'
import GeneralTab from './GeneralTab'
import MetadataTab from './MetadataTab'
import AdsTab from './AdsTab'

const tabsValue = [
    {
        value: "umum",
        title: "Umum",
        description: "Kelola pengaturan umum seperti nama, deskripsi, dan preferensi dasar aplikasi.",
        component: <GeneralTab />,
    },
    {
        value: "metadata",
        title: "Metadata",
        description: "Atur metadata konten seperti judul SEO, kata kunci, dan deskripsi pencarian.",
        component: <MetadataTab />,
    },
    {
        value: "ads",
        title: "Ads",
        description: "Konfigurasi penempatan iklan dan pengaturan monetisasi konten Anda.",
        component: <AdsTab />,
    },
]

export default function Data() {
    return (
        <div>
            <WithCard title={"Pengaturan"}>
                <Tabs defaultValue={tabsValue[0].value} className="w-full">
                    <TabsList>
                        {tabsValue.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabsValue.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {tab.description && (
                                <p className="text-sm text-muted-foreground mb-4 border-b pb-3">
                                    {tab.description}
                                </p>
                            )}
                            {tab.component}
                        </TabsContent>
                    ))}
                </Tabs>
            </WithCard>
        </div>
    )
}