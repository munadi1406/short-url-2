'use client'

import { useEffect, useState, lazy, Suspense } from "react";
import { JSONToHTML } from "html-to-json-parser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load komponen Editor
const Editor = lazy(() => import("./Editor"));

export default function Edit({ id }) {
  const [content, setContent] = useState(``);

  const [initialValue, setInitialValue] = useState()
  const convert = async (content) => {
    const datas = await JSONToHTML(content, true);
    setInitialValue(datas)
  };

  const { toast } = useToast()


  const navigate = useRouter()


  const [title, setTitle] = useState("")

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const datas = await axios.put('/api/article', {
        title, content, articleId: id
      })
      return datas.data
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: data.msg, variant: "primary", })
      navigate.push('/dashboard/article')
    },
    onError: (error) => {
      // console.log(error)
      toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
    }
  },)

  const { data, isLoading, isError } = useQuery({
    queryKey: [`article-${id}`], queryFn: async () => {
      const datas = await axios.get(`/api/article/${id}`)
      await convert(datas.data.data.content)
      setContent(JSON.parse(datas.data.data.content))
      setTitle(datas.data.data.title)
      return datas.data
    }
  })


  if (isError) {
    return <div>Article Not Found</div>
  }


  return (
    <div className='flex flex-col gap-2 px-2 py-4 shadow-md rounded-md border border-gray-300'>
      {isLoading ? <Skeleton className={"w-full h-[500px] rounded-md"} /> : (
        <>
          <div className='bg-white w-full top-5 sticky p-2 z-10 rounded-md shadow-md'>
            <Button onClick={mutate} disabled={isPending} className="w-full">Update</Button>
          </div>
          <Textarea type="text" className=" !text-3xl font-semibold " placeholder={"Masukkan Judul Article"} onChange={(e) => setTitle(e.target.value)} defaultValue={data?.data?.title} />
          <div className="border rounded-md prose lg:prose-lg prose-slate prose-img:rounded-md prose-img:shadow-lg prose-img:block prose-img:m-auto  w-full max-w-none">
            <Suspense fallback={<Skeleton className={"w-full rounded-md w-full h-[200px]"}/>}>
              <Editor initialValue={initialValue} onChange={setContent} />
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}
