import { AppSidebar } from "@/components/app-sidebar"
import DynamicBreadcrumb from "@/components/DynamicBreadCrumb"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as ToastSonner } from "sonner"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { getUser } from "@/lib/dal"
import { redirect } from "next/navigation"

export default async function layout({ children }) {
    const datas = await getUser()
    if (!datas) redirect('/')

    return (


        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <DynamicBreadcrumb />
                    </div>
                </header>
                <div className="w-full grid grid-cols-1 relative">
                    <div className="p-2 border border-gray-300 shadow-md rounded-md m-2">
                        {children}
                    </div>
                </div>
                <Toaster />
                <ToastSonner/>
                
            </SidebarInset>
        </SidebarProvider>

    )
}
