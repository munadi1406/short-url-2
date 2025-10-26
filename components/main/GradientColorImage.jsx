/* eslint-disable @next/next/no-img-element */

'use client';
import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';
import Link from 'next/link';
import Image from 'next/image';
import { AspectRatio } from "@/components/ui/aspect-ratio"
// Fungsi untuk mengonversi RGB ke HEX
const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
};
const hexToRgba = (hex, alpha) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const getLuminance = (r, g, b) => {
    const [R, G, B] = [r, g, b].map((v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

const GradientCard = ({ data, ...props }) => {
    const [gradient, setGradient] = useState('');
    const [gradient2, setGradient2] = useState('');
    const [textColor, setTextColor] = useState('text-black');


    useEffect(() => {
        // Pastikan gambar tersedia sebelum melanjutkan
        if (data?.image) {
            const img = document.createElement('img');
            img.crossOrigin = 'Anonymous'; // Hindari masalah CORS
            img.src = data.image;

            img.onload = () => {
                try {
                    const colorThief = new ColorThief()
                    const palette = colorThief.getPalette(img, 2)

                    if (palette?.length >= 2) {
                        const [color1, color2] = palette
                        const hex1 = rgbToHex(...color1)
                        const hex2 = rgbToHex(...color2)

                        // Set gradient background
                        setGradient(`linear-gradient(135deg, ${hex1}, ${hex2})`)
                        const rgba1 = hexToRgba(hex1, 0.25)
                        const rgba2 = hexToRgba(hex2, 0.25)
                        setGradient2(`linear-gradient(to right, ${rgba1}, ${rgba2})`)

                        // Hitung luminance rata-rata
                        const lum1 = getLuminance(...color1)
                        const lum2 = getLuminance(...color2)
                        const avgLum = (lum1 + lum2) / 2

                        // Gunakan warna teks kontras sesuai WCAG
                        setTextColor(avgLum > 0.5 ? 'black' : 'white')
                    }
                } catch (err) {
                    console.warn('Gagal ambil warna:', err)
                    setGradient('linear-gradient(135deg, #888, #aaa)')
                    setTextColor('white')
                }
            };


        }
    }, [data?.image]);

    return (
        <div {...props} style={{ background: gradient, color: textColor }}>
            <div className="flex flex-wrap gap-2 justify-center">

                <AspectRatio ratio={6 / 1}>
                    <Image src={data.image} alt="Image" fill className="rounded-md object-cover" />
                </AspectRatio>



                <div className="px-2 flex flex-col gap-2 w-full relative -top-10">
                    <div className="  backdrop-blur-lg  p-2 flex gap-2 w-full rounded-md" style={{ background: gradient2 }}>
                        <div className="w-[150px]">
                            <AspectRatio ratio={3 / 4} >
                                <Image
                                    src={data.image}
                                    alt={data.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                    quality={70}
                                    className="rounded-md w-full h-full object-cover"
                                />
                            </AspectRatio>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold capitalize">{data.title}</h2>
                            <div className="flex gap-2">
                                <div className="flex flex-wrap gap-2 capitalize">
                                    {data.genres?.map((e, i) => (
                                        <Link
                                            href={`/genre/${e.name}`}
                                            key={i}
                                            className=" border  rounded-md text-xs p-1"
                                            style={{ borderColor: textColor }}
                                        >
                                            {e.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <h3>{data.total_episode ?? '-'} Episode</h3>
                            {data.air_time ?? (
                                <h3>
                                    Air Time: {data.air_time ?? '-'}
                                </h3>
                            )}
                            <h3>
                                {data.trailer && (
                                    <a
                                        className="bg-red-600 hover:bg-red-400  text-white rounded p-1"
                                        href={data.trailer}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Trailer
                                    </a>
                                )}
                            </h3>
                        </div>
                    </div>
                    <p className="max-w-full px-2">{data.description}</p>
                    <div className="flex flex-wrap md:w-auto w-full justify-start gap-2 my-2 px-2">
                        {data?.tags?.map((e, i) => (
                            <Link
                                href={`/tag/${e.name}`}
                                key={i}
                                className="text-xs rounded p-1 shadow-md"
                                style={{ background: gradient2 }}
                            >
                                {e.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradientCard;
