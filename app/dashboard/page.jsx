import Overview from "@/components/Overview/Overview"


export const metadata = {
  title: "Dashboard",
}

const page = async () => {

  return (
    <div>
      <h1 className="text-xl font-semibold p-2 rounded-md my-2 w-full border shadow-md">Overview</h1>
      <Overview />
    </div>
  )
}

export default page