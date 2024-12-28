import AddLink from '@/components/post/link/AddLink'
import Post from '@/models/post'
import { notFound } from 'next/navigation'
import React from 'react'


const getData = async (id) => {
  const data = await Post.findByPk(id, { attributes: ['id', 'title'] })
  return data
}


export default async function page({ params }) {
  const { id } = await params
  const data = await getData(id)
  if (!data) {
    return notFound()
  }
  return (
    <div className='bg-white shadow-md rounded-md p-2'>
      <div>
        <h1 className='text-lg font-semibold'>{data.title}</h1>
      </div>
      <div>
        <AddLink id={data.id} />
      </div>
    </div>
  )
}
