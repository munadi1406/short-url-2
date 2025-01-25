/* eslint-disable @next/next/no-img-element */

'use client';
import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';
import Link from 'next/link';
import Image from 'next/image';

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
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(img, 2); // Ambil 2 warna utama
                if (palette.length >= 2) {
                    const [color1, color2] = palette;

                    // Konversi ke warna HEX
                    const hex1 = rgbToHex(color1[0], color1[1], color1[2]);
                    const hex2 = rgbToHex(color2[0], color2[1], color2[2]);

                    // Atur gradien dari atas ke bawah kanan (diagonal)
                    setGradient(`linear-gradient(to bottom right, ${hex1}, ${hex2})`);
                    const rgba1 = hexToRgba(hex1, 0.2);
                    const rgba2 = hexToRgba(hex2, 0.2);

                    setGradient2(`linear-gradient(to right, ${rgba1}, ${rgba2})`);
                    // Gunakan warna kedua untuk menentukan warna teks

                    const luminance1 = 0.299 * color1[0] + 0.587 * color1[1] + 0.114 * color1[2];
                    const luminance2 = 0.299 * color2[0] + 0.587 * color2[1] + 0.114 * color2[2];
                    const avgLuminance = (luminance1 + luminance2) / 2;
    
                    // Tentukan warna teks berdasarkan luminance rata-rata
                    setTextColor(avgLuminance < 128 ? 'white' : 'black');
                }
            };

           
        }
    }, [data?.image]);

    return (
        <div {...props} style={{ background: gradient, color: textColor }}>
            <div className="flex flex-wrap gap-2 justify-center">
                <div className="h-[10rem] w-full relative">
                    <Image
                        src={data.image}
                        alt={data.title}
                        fill
                        quality={100}
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        className="rounded-md"
                    />
                </div>

                <div className="px-2 flex flex-col gap-2 w-full relative -top-10">
                    <div className="  backdrop-blur-lg  p-2 flex gap-2 w-full rounded-md" style={{ background: gradient2 }}>
                        <Image
                            src={data.image}
                            alt={data.title}
                            width={100}
                            height={200}
                            className="rounded-md"
                        />
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
                            <h3>
                                Air Time: {data.air_time ?? '-'}
                            </h3>
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
                                className="text-xs border rounded p-1"
                                style={{ borderColor: textColor }}
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
