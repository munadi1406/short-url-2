import Scrapper from "@/components/scrapper/Scrapper";
export const metadata = {
  title: "Scrapper"
}
export default function page() {
  return (
    <div className='bg-white shadow-md p-2 rounded-md'>
        <h1 className='text-lg font-semibold'>Scrapper</h1>
        <Scrapper/>



    </div>
  )
}
