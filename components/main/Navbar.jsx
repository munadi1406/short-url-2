import Link from 'next/link'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChartBarStacked, House, Timer, Vote } from 'lucide-react'
import { Ubuntu, Nunito_Sans } from 'next/font/google'
import { Genre } from '@/models/genre'
import Search from './Search'
const oswald = Ubuntu({
    weight: ['400', '500', '700'],
    subsets: ['cyrillic'],
    display: 'swap',
    variable: '--font-cinzel',
});
const nunito = Nunito_Sans({
    weight: ['400', '500', '700'],
    subsets: ['cyrillic'],
    display: 'swap',
    variable: '--font-cinzel',
});
export default async function Navbar() {
    const genres = await Genre.findAll({ attributes: ['name'], order: [['name', 'asc']] })
    const menu = [
        {
            title: "Home",
            url: "/",
            icon: <House />
        },
        {
            title: "Search",
            url: "#",
            icon: <Search />
        },
        {
            title: "Ongoing",
            url: '/tag/ongoing',
            icon: <Timer />
        },
        {
            title: "Completed",
            url: '/tag/completed',
            icon: <Vote />
        },

    ]
    return (
        <header className='w-full flex flex-col justify-center items-center  sticky top-0 z-40 bg-white'>
            <Link href="/">
                <h1
                    className={`text-5xl font-bold p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent ${oswald.className}`}
                >
                    Lyco
                </h1>
            </Link>

            <div className={`${nunito.className} hidden md:flex gap-6 text-lg font-semibold border w-full p-4 justify-center `}>
                <Link href="/">Home</Link>
                <Link href="/tag/ongoing">Ongoing</Link>
                <Link href="/tag/completed">Completed</Link>
                <DropdownMenu>
                    <DropdownMenuTrigger>Genre</DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-[70vh] overflow-auto">
                        
                        {genres.map((e, i) => (
                            <Link key={i} href={`/genre/${e.name}`}>
                                <DropdownMenuItem key={i}>{e.name}</DropdownMenuItem>
                            </Link>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Search placeholder={"Search..."}/>
            </div>
            {/* mobile */}
            <div className='md:hidden left-0 bottom-0 z-40 py-4 bg-white w-full fixed'>
                <div className='flex gap-2 w-full justify-evenly text-lg text-blue-900'>
                    {menu.map((e, i) => (
                        <Link href={e.url} key={i} className='active:scale-95'>
                            {e.icon}
                        </Link>
                    ))}
                    <DropdownMenu>
                        <DropdownMenuTrigger className='active:scale-95'><ChartBarStacked /></DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[70vh] overflow-auto">
                            {genres.map((e, i) => (
                                <Link key={i} href={`/genre/${e.name}`} >
                                    <DropdownMenuItem key={i}>{e.name}</DropdownMenuItem>
                                </Link>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
