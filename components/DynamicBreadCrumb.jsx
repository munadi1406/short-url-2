'use client';
import { useRouter, usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from 'react'

const DynamicBreadcrumb = () => {
    const router = useRouter();
    const pathUrl = usePathname();

    // Memastikan pathUrl ada sebelum melakukan split
    if (!pathUrl) {
        return null; // Bisa tampilkan loading atau komponen fallback jika diperlukan
    }

    // Membagi path URL menjadi bagian-bagian untuk breadcrumb
    const breadcrumbItems = pathUrl.split('/').filter((item) => item !== '');

    // Menghasilkan breadcrumb berdasarkan URL
    const generateBreadcrumb = () => {
        return breadcrumbItems.map((item, index) => {
            const path = '/' + breadcrumbItems.slice(0, index + 1).join('/');

            return (
                <React.Fragment key={index}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={path}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}  {/* Mengkapitalisasi huruf pertama */}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {/* Separator hanya ditampilkan jika bukan item terakhir */}
                    {index < breadcrumbItems.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Menampilkan breadcrumb dinamis */}
                {generateBreadcrumb()}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default DynamicBreadcrumb;
