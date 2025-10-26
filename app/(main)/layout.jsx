import Navbar from '@/components/main/Navbar'
import React from 'react'
import { Nunito_Sans } from 'next/font/google';
import Popular from '@/components/main/Popular';

import RecoredVisitors from '@/components/visitor/RecordVisitors';
import View from '@/components/maintenance/View';



const nunito = Nunito_Sans({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700']
})
export const metadata = {
    title: {
        template: '%s | Lyco',
        default: 'Lyco', 
    },
    robots: {
        index: true,
        follow: true,
    },
}


export default async function layout({ children }) {
    let isActive = false;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/maintenance/status/check`, {
            cache: 'no-store',
        });
        if (res.ok) {
            const data = await res.json();
            isActive = data.isActive;
        } else {

        }
    } catch (err) {

    }




    return (
        <>
            {isActive ? <View /> :
                (
                    <>
                        <RecoredVisitors />
                        <Navbar />
                        <div className={`md:mb-0  relative  w-full min-h-screen p-4 ${nunito.className}`}>
                            <div className='w-full'>
                                {children}
                            </div>
                        </div>
                        <footer className="bg-gray-800 text-white py-6 mt-8 mb-24 md:mb-0">
                            <div className="max-w-4xl mx-auto px-4">
                                <p className="text-center text-xs">
                                    This site Lyco - short.dcrypt.my.id does not host any files on its servers. All files and content are hosted by third-party websites.
                                    We simply index and provide links to content that is already publicly available on the internet.
                                </p>
                                <p className="text-center text-xs mt-4">
                                    Lyco is not responsible for the content hosted on third-party websites. We only collect and link to sources that are already published online.
                                    Any issues related to the content on third-party sites are not our responsibility.
                                </p>
                            </div>
                        </footer>
                    </>

                )}
        </>
    )
}
