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
export const metadata = {
    title: {
        template: '%s | DCRYPT',
        default: 'DCRYPT',
    },
    robots: {
        index: false,
        follow: false,
    }
}

export default async function layout({ children }) {
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
                    <div className="p-2">
                        {children}
                    </div>
                </div>
                <Toaster />
                <ToastSonner />

            </SidebarInset>
        </SidebarProvider>

    )
}
