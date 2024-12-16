'use client'

import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios"
import { Fragment, Suspense, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import ShortUrl from "./ShortUrl"

export default function Scrapper() {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const { mutate, isPending, isSuccess, isError, data } = useMutation({
        mutationFn: async (e) => {
            e.preventDefault()
            const scrape = await axios.post('/api/scrapper', { url })
            return scrape.data
        }
    })




    return (
        <div className="flex flex-col gap-2 p-2">
            <form onSubmit={mutate} className="flex flex-col gap-2 border p-2 rounded-md">
         
                <div className="space-y-2">
                    <Label htmlFor="url">Url</Label>
                    <Input id={"url"} type="text" required onChange={(e) => setUrl(e.target.value)} />
                </div>
                <Button type="submit" disabled={isPending}>{isPending ? "Loading..." : 'Scrape'}</Button>
            </form>
            {isPending && <Skeleton className={"w-full h-[800px] rounded-md"} />}
            {isSuccess && (
                <div className="border p-2 rounded-md">
                    <h2 className="text-xl font-semibold">Scrapper Result</h2>
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    {isSuccess && data.data.map((e, i) => (
                        <div key={i} className="flex flex-col gap-2 p-2">
                            <p className="text-md py-4 border-b-2 border-gray-300 font-semibold">Episode {e.episode}</p>
                            <div className="pl-2 border-l-2 border-blue-600">
                                <Suspense fallback={<Skeleton className={"w-full h-10 rounded-md"} />}>
                                    {e.links.map((link, subIndex) => (
                                        <Fragment key={subIndex}>
                                            <ShortUrl
                                                linkData={link}
                                               
                                                title={`${title} Eps ${e.episode} ${link.quality}`}
                                                originalTitle={title}
                                            />
                                        </Fragment>
                                    ))}
                                </Suspense>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
