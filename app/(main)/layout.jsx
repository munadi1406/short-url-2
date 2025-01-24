import Navbar from '@/components/main/Navbar'
import React from 'react'
import { Nunito_Sans } from 'next/font/google';
import Popular from '@/components/main/Popular';
import LogSender from '@/lib/LogSender';
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
            <LogSender />
            <Navbar />
            <div className={`flex md:flex-row md:mb-0 mb-8 flex-col relative  w-full min-h-screen p-4 ${nunito.className}`}>
                <div className='md:w-4/6 w-full'>
                    {children}
                </div>
                <div className='md:w-2/6 w-full py-4 md:px-6 px-2 top-0 h-max'>
                    <Popular />
                </div>
            </div>
        </>
    )
}
