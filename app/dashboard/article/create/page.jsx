'use client'

import { useState } from 'react'
import Editor from '@/components/Article/Editor'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'


const Page = () => {
  const [value, setValue] = useState({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is an example for the editor",
          },
        ],
      },
    ],
  })
  const { toast } = useToast()


  const navigate = useRouter()

  const [title, setTitle] = useState("")
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const datas = await axios.post('/api/article', {
        title, content: value
      })
      return datas.data
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: data.msg, variant: "primary", })
      navigate.push('/dashboard/article')
    },
    onError: (error) => {
      toast({ title: "Error", description: error.response.data.msg, variant: "destructive", })
    }
  },
  )




  return (
    <div className='flex flex-col gap-2'>
      <Button onClick={mutate} disabled={isPending}>Publish</Button>
      <Textarea type="text" className="border-none text-3xl font-semibold active:border-none focus:border-none" placeholder={"Title"} onChange={(e) => setTitle(e.target.value)} value={title} />
      <div className="prose lg:prose-lg prose-slate prose-img:rounded-md prose-img:shadow-lg prose-img:block prose-img:m-auto  w-full max-w-none">
        <Editor initialValue={value} onChange={setValue} />
      </div>
    </div>
  )
}

export default Page