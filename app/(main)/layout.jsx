import Navbar from '@/components/main/Navbar'
import React from 'react'
import { Nunito_Sans } from 'next/font/google';
import Popular from '@/components/main/Popular';

import RecoredVisitors from '@/components/visitor/RecordVisitors';



const nunito = Nunito_Sans({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700']
})
export const metadata = {
    robots: {
        index: true,
        follow: true,
    },
}


export default async function layout({ children }) {
    return (
        <>
            <RecoredVisitors />
            <Navbar />
            <div className={`flex md:flex-row md:mb-0  flex-col relative  w-full min-h-screen p-4 ${nunito.className}`}>
                <div className='md:w-4/6 w-full'>
                    {children}
                </div>
                <div className='md:w-2/6 w-full py-4 md:px-6 px-2 top-0 h-max'>
                    <Popular />
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
    )
}
