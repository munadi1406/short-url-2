import Article from "@/models/article"
import { JSONToHTML } from "html-to-json-parser";
import LocalTime from "./LocalTime";
import { NotFound } from 'next/navigation';



export default async function Page({ params }) {
  const { slug } = await params
  const data = await Article.findOne({ where: { slug } })
  if (!data) {
    return <NotFound />; // Mengarahkannya ke halaman 404
  }
  const result = await JSONToHTML(data.content, true);

  return (
    <div className="flex justify-center items-center py-6">
      <div className="md:w-[70vw] w-full">
        <div className="prose lg:prose-lg prose-h2:m-auto prose-h1:my-4 prose-h3:m-auto prose-p:my-4  prose-slate prose-img:rounded-md prose-img:shadow-lg prose-img:block prose-img:m-auto  w-full max-w-none" >
          <h1 className="text-center">{data.title}</h1>
          <p className="prose-none text-center text-md"><LocalTime date={data.createdAt}/></p>
          <div
            dangerouslySetInnerHTML={{ __html: result }}
            className='ProseMirror'
          />
        </div>
      </div>
    </div>
  )
}
