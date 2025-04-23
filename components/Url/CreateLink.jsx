'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button'; // Asumsi Anda punya komponen Button yang sudah terintegrasi dengan Tailwind
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Iklan from '../Iklan/Iklan';

export default function CreateLink() {
    // State untuk menyimpan slug
    const [clickCount,setClickCount] = useState(0)
    const [slug, setSlug] = useState(null);

    // State untuk mengelola tombol yang ditampilkan
    const [showCreateButton, setShowCreateButton] = useState(true);
    const [showOpenButton, setShowOpenButton] = useState(false);

    // State untuk status loading tombol
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingOpen, setLoadingOpen] = useState(false);

    // State untuk status disabled pada tombol Open
    const [isOpenButtonDisabled, setIsOpenButtonDisabled] = useState(true);

    // State untuk menghitung waktu yang tersisa pada timeout
    const [timeRemaining, setTimeRemaining] = useState(3); // in seconds

    // State untuk posisi tombol Open Link
    const [topOpenLink, setTopOpenLink] = useState(0);

    // Mengambil slug dari sessionStorage ketika komponen dimuat
    useEffect(() => {
        const storedSlug = sessionStorage.getItem('slug');
        if (storedSlug) {
            setSlug(storedSlug); // Set slug ke state
            sessionStorage.removeItem('slug'); // Hapus slug dari sessionStorage
        }

        const handlePositionOpenButton = () => {
            const pageHeight = document.documentElement.scrollHeight;
         
            const positionFromTop = pageHeight * 0.05; // 5% dari tinggi halaman

            setTopOpenLink(pageHeight + positionFromTop);
        };

        handlePositionOpenButton(); // Set posisi awal tombol Open Link

        window.addEventListener('resize', handlePositionOpenButton); // Update posisi saat ukuran jendela berubah
        return () => {
            window.removeEventListener('resize', handlePositionOpenButton); // Membersihkan event listener saat komponen di-unmount
        };
    }, []);

    const handleCreateLinkClick = () => {
        setLoadingCreate(true);
        let timer = 3; // Set initial time to 3 seconds

        // Mulai countdown dan tampilkan tombol Open setelah 3 detik
        const countdown = setInterval(() => {
            setTimeRemaining(timer);
            timer--;

            if (timer < 0) {
                clearInterval(countdown);
                setShowCreateButton(false); // Sembunyikan tombol Create setelah 3 detik
                setShowOpenButton(true); // Tampilkan tombol Open
                setLoadingOpen(false); // Hentikan loading
                setIsOpenButtonDisabled(false); // Aktifkan tombol Open setelah 3 detik

                // Gunakan setTimeout untuk memastikan tombol "Open Link" sudah ada di DOM
                setTimeout(() => {
                    const openLinkButton = document.getElementById('openLinkButton');
                    if (openLinkButton) {
                        openLinkButton.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100); // Tunggu sedikit sebelum melakukan scroll
            }
        }, 1000); // Update tiap detik
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async (slug) => {
            const getLink = await axios.get(`/api/shorten/${slug}`)
         
            return getLink.data
        },
        onSuccess: (data) => {
            window.location.href = data.url

        },
        
    })

    const handleClick = () => {
        if(clickCount === 0 ){
            
            window.open('https://gappoison.com/n66f77cjb?key=084d560b78171070835b5485740f5fdf','_blank')
        }else{
            mutate(slug)
        }
        setClickCount((prev)=> prev + 1)
    }



    if (!slug) {
        return <></>;
    }

    return (
        <>
            <Iklan />
            <div className="bg-green-600 flex relative flex-col justify-between p-8">
                {/* Tombol Create Link */}
                {showCreateButton && (
                    <div className="relative top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                        <Button
                            onClick={handleCreateLinkClick}
                            disabled={loadingCreate}
                            className="px-6 py-3 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loadingCreate ? `Creating link... ${timeRemaining}s` : 'Create Link'}
                        </Button>
                    </div>
                )}

                {/* Tombol Open Link (akan diposisikan secara dinamis) */}
                {showOpenButton && (
                    <div
                        id="openLinkButton"
                        className="flex justify-center items-center left-0 py-8  w-full mb-4 absolute bottom-4"
                        style={{ top: `${topOpenLink}px` }}
                    >
                     
                        <Button
                            onClick={handleClick}
                            disabled={isOpenButtonDisabled || isPending}
                            className="px-6 py-3 text-lg bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {isOpenButtonDisabled
                                ? `Please wait... ${timeRemaining}s`
                                : (isPending ? 'Please wait...' : 'Open Link')}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
